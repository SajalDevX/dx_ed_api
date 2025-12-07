import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Quiz } from '../models/Quiz.js';
import { Enrollment } from '../models/Enrollment.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

// Get quiz by lesson ID
export const getQuizByLesson = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { lessonId } = req.params;

    const quiz = await Quiz.findOne({ lesson: lessonId, isActive: true });

    if (!quiz) {
      throw ApiError.notFound('Quiz not found for this lesson');
    }

    // Check enrollment
    const enrollment = await Enrollment.findOne({
      user: req.userId,
      course: quiz.course,
    });

    if (!enrollment) {
      throw ApiError.forbidden('Not enrolled in this course');
    }

    // Return quiz without correct answers
    const quizData = quiz.toObject();
    const sanitizedQuestions = quizData.questions.map((q) => {
      const { correctAnswer, ...rest } = q;
      return {
        ...rest,
        options: q.options?.map((o) => ({
          _id: o._id,
          text: o.text,
          media: o.media,
        })),
      };
    });

    // Get previous attempts
    const attempts = enrollment.quizAttempts.filter(
      (a) => a.quizId.toString() === quiz._id.toString()
    );

    res.json({
      success: true,
      data: {
        quiz: { ...quizData, questions: sanitizedQuestions },
        attempts: attempts.length,
        maxAttempts: quiz.settings.maxAttempts,
        canAttempt:
          !quiz.settings.maxAttempts ||
          attempts.length < quiz.settings.maxAttempts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get quiz by ID
export const getQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);

    if (!quiz || !quiz.isActive) {
      throw ApiError.notFound('Quiz not found');
    }

    // Check enrollment
    const enrollment = await Enrollment.findOne({
      user: req.userId,
      course: quiz.course,
    });

    if (!enrollment) {
      throw ApiError.forbidden('Not enrolled in this course');
    }

    // Return quiz without correct answers
    const quizData = quiz.toObject();
    const sanitizedQuestions = quizData.questions.map((q) => {
      const { correctAnswer, ...rest } = q;
      return {
        ...rest,
        options: q.options?.map((o) => ({
          _id: o._id,
          text: o.text,
          media: o.media,
        })),
      };
    });

    // Get previous attempts
    const attempts = enrollment.quizAttempts.filter(
      (a) => a.quizId.toString() === quizId
    );

    res.json({
      success: true,
      data: {
        quiz: { ...quizData, questions: sanitizedQuestions },
        attempts: attempts.length,
        maxAttempts: quiz.settings.maxAttempts,
        canAttempt:
          !quiz.settings.maxAttempts ||
          attempts.length < quiz.settings.maxAttempts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to randomly select n items from an array (Fisher-Yates shuffle)
const getRandomQuestions = <T>(array: T[], n: number): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(n, shuffled.length));
};

// Default number of questions per quiz attempt
const DEFAULT_QUESTIONS_PER_QUIZ = 10;

// Start quiz attempt
export const startQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { quizId } = req.params;
    // Allow specifying number of questions (default: 10, max: total questions)
    const requestedQuestionCount = parseInt(req.query.questionCount as string) || DEFAULT_QUESTIONS_PER_QUIZ;

    const quiz = await Quiz.findById(quizId);

    if (!quiz || !quiz.isActive) {
      throw ApiError.notFound('Quiz not found');
    }

    const enrollment = await Enrollment.findOne({
      user: req.userId,
      course: quiz.course,
    });

    if (!enrollment) {
      throw ApiError.forbidden('Not enrolled in this course');
    }

    // Check attempt limit
    const attempts = enrollment.quizAttempts.filter(
      (a) => a.quizId.toString() === quizId
    );

    if (
      quiz.settings.maxAttempts &&
      attempts.length >= quiz.settings.maxAttempts
    ) {
      throw ApiError.badRequest('Maximum attempts reached');
    }

    // Get all questions from the quiz
    let allQuestions = [...quiz.questions];

    // Determine how many questions to select
    const questionCount = Math.min(requestedQuestionCount, allQuestions.length);

    // Randomly select questions from the pool
    let selectedQuestions = getRandomQuestions(allQuestions, questionCount);

    // Additional shuffle if enabled (for the selected questions order)
    if (quiz.settings.shuffleQuestions) {
      selectedQuestions = selectedQuestions.sort(() => Math.random() - 0.5);
    }

    // Shuffle answer options if enabled
    if (quiz.settings.shuffleAnswers) {
      selectedQuestions = selectedQuestions.map((q) => ({
        ...q,
        options: q.options ? [...q.options].sort(() => Math.random() - 0.5) : q.options,
      }));
    }

    // Store the selected question IDs in session for grading
    // This ensures we grade only the questions that were shown
    const selectedQuestionIds = selectedQuestions.map((q) => q._id.toString());

    // Remove correct answers for client
    const cleanQuestions = selectedQuestions.map((q) => ({
      _id: q._id,
      type: q.type,
      question: q.question,
      questionMedia: q.questionMedia,
      options: q.options?.map((o) => ({
        _id: o._id,
        text: o.text,
        media: o.media,
      })),
      points: q.points,
      difficulty: q.difficulty,
    }));

    // Calculate max possible score for this attempt
    const maxPossibleScore = selectedQuestions.reduce((sum, q) => sum + (q.points || 10), 0);

    res.json({
      success: true,
      data: {
        questions: cleanQuestions,
        questionIds: selectedQuestionIds, // Client should send this back when submitting
        totalQuestionsInPool: allQuestions.length,
        questionsSelected: cleanQuestions.length,
        maxPossibleScore,
        timeLimit: quiz.settings.timeLimit,
        attemptNumber: attempts.length + 1,
        startedAt: new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Submit quiz answers
export const submitQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { quizId } = req.params;
    const { answers, timeSpent, questionIds } = req.body;

    const quiz = await Quiz.findById(quizId);

    if (!quiz || !quiz.isActive) {
      throw ApiError.notFound('Quiz not found');
    }

    const enrollment = await Enrollment.findOne({
      user: req.userId,
      course: quiz.course,
    });

    if (!enrollment) {
      throw ApiError.forbidden('Not enrolled in this course');
    }

    // Get only the questions that were presented in this attempt
    // If questionIds provided, use those; otherwise grade all questions (backward compatibility)
    const questionsToGrade = questionIds
      ? quiz.questions.filter((q) => questionIds.includes(q._id.toString()))
      : quiz.questions;

    // Calculate score
    let score = 0;
    let maxScore = 0;
    const gradedAnswers: Array<{
      questionId: mongoose.Types.ObjectId;
      answer: unknown;
      isCorrect: boolean;
    }> = [];

    for (const question of questionsToGrade) {
      maxScore += question.points;

      const userAnswer = answers.find(
        (a: { questionId: string }) =>
          a.questionId === question._id.toString()
      );

      let isCorrect = false;

      if (userAnswer) {
        switch (question.type) {
          case 'multiple-choice':
          case 'true-false': {
            const correctOption = question.options?.find((o) => o.isCorrect);
            isCorrect =
              correctOption?._id.toString() === userAnswer.answer;
            break;
          }

          case 'multiple-select': {
            const correctIds = question.options
              ?.filter((o) => o.isCorrect)
              .map((o) => o._id.toString())
              .sort();
            const userIds = (userAnswer.answer as string[])?.sort();
            isCorrect =
              JSON.stringify(correctIds) === JSON.stringify(userIds);
            break;
          }

          case 'fill-blank':
          case 'short-answer': {
            const correctAnswer = (question.correctAnswer as string)
              ?.toLowerCase()
              .trim();
            const userAnswerText = (userAnswer.answer as string)
              ?.toLowerCase()
              .trim();
            isCorrect = correctAnswer === userAnswerText;
            break;
          }

          default:
            isCorrect = false;
        }

        if (isCorrect) {
          score += question.points;
        }
      }

      gradedAnswers.push({
        questionId: question._id,
        answer: userAnswer?.answer,
        isCorrect,
      });
    }

    // Calculate percentage
    const percentage = Math.round((score / maxScore) * 100);
    const passed = percentage >= quiz.settings.passingScore;

    // Get attempt number
    const attemptNumber =
      enrollment.quizAttempts.filter(
        (a) => a.quizId.toString() === quizId
      ).length + 1;

    // Save attempt
    enrollment.quizAttempts.push({
      quizId: new mongoose.Types.ObjectId(quizId),
      attemptNumber,
      score,
      maxScore,
      answers: gradedAnswers,
      completedAt: new Date(),
      timeSpent: timeSpent || 0,
    });

    await enrollment.save();

    // Update quiz stats
    quiz.stats.totalAttempts += 1;
    quiz.stats.averageScore =
      (quiz.stats.averageScore * (quiz.stats.totalAttempts - 1) + percentage) /
      quiz.stats.totalAttempts;
    quiz.stats.passRate =
      (quiz.stats.passRate * (quiz.stats.totalAttempts - 1) +
        (passed ? 100 : 0)) /
      quiz.stats.totalAttempts;
    await quiz.save();

    // Award points if passed
    if (passed) {
      const user = await User.findById(req.userId);
      if (user) {
        const pointsToAdd = attemptNumber === 1 ? 50 : 25;
        user.gamification.points += pointsToAdd;

        // Update streak
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const lastActivity = user.gamification.streak.lastActivityDate;

        if (!lastActivity || lastActivity < today) {
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);

          if (lastActivity && lastActivity >= yesterday) {
            user.gamification.streak.current += 1;
          } else {
            user.gamification.streak.current = 1;
          }

          if (
            user.gamification.streak.current >
            user.gamification.streak.longest
          ) {
            user.gamification.streak.longest =
              user.gamification.streak.current;
          }

          user.gamification.streak.lastActivityDate = new Date();
        }

        await user.save();
      }
    }

    // Build response
    const result: Record<string, unknown> = {
      score,
      maxScore,
      percentage,
      passed,
      attemptNumber,
    };

    // Include answers if settings allow
    if (quiz.settings.showCorrectAnswers) {
      result.answers = gradedAnswers;
    }

    if (quiz.settings.showExplanations) {
      // Only show explanations for questions that were graded
      result.explanations = questionsToGrade.map((q) => ({
        questionId: q._id,
        explanation: q.explanation,
      }));
    }

    // Add info about questions graded
    result.questionsGraded = questionsToGrade.length;
    result.totalQuestionsInPool = quiz.questions.length;

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get quiz results/attempts
export const getQuizResults = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      throw ApiError.notFound('Quiz not found');
    }

    const enrollment = await Enrollment.findOne({
      user: req.userId,
      course: quiz.course,
    });

    if (!enrollment) {
      throw ApiError.forbidden('Not enrolled in this course');
    }

    const attempts = enrollment.quizAttempts.filter(
      (a) => a.quizId.toString() === quizId
    );

    res.json({
      success: true,
      data: {
        attempts,
        quiz: {
          title: quiz.title,
          passingScore: quiz.settings.passingScore,
          maxAttempts: quiz.settings.maxAttempts,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Create quiz (instructor)
export const createQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const quizData = req.body;

    // Add order to questions
    quizData.questions = quizData.questions.map(
      (q: Record<string, unknown>, index: number) => ({
        ...q,
        order: index,
      })
    );

    const quiz = await Quiz.create(quizData);

    res.status(201).json({
      success: true,
      data: { quiz },
    });
  } catch (error) {
    next(error);
  }
};

// Update quiz (instructor)
export const updateQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { quizId } = req.params;
    const updates = req.body;

    const quiz = await Quiz.findByIdAndUpdate(quizId, updates, {
      new: true,
      runValidators: true,
    });

    if (!quiz) {
      throw ApiError.notFound('Quiz not found');
    }

    res.json({
      success: true,
      data: { quiz },
    });
  } catch (error) {
    next(error);
  }
};
