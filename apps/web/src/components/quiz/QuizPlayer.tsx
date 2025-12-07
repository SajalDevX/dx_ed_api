'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CheckCircle,
  XCircle,
  HelpCircle,
  Loader2,
  RefreshCw,
  Trophy,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import apiClient from '@/lib/api/client';

interface QuizOption {
  _id: string;
  text: string;
}

interface QuizQuestion {
  _id: string;
  type: 'multiple-choice' | 'multiple-select' | 'true-false';
  question: string;
  options?: QuizOption[];
  points: number;
}

interface Quiz {
  _id: string;
  title: string;
  description?: string;
  settings: {
    passingScore: number;
    showCorrectAnswers: boolean;
    showExplanations: boolean;
  };
  questions: QuizQuestion[];
}

interface QuizResult {
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  attemptNumber: number;
  answers?: Array<{
    questionId: string;
    isCorrect: boolean;
  }>;
}

interface QuizPlayerProps {
  lessonId: string;
  onComplete?: () => void;
}

export function QuizPlayer({ lessonId, onComplete }: QuizPlayerProps) {
  const queryClient = useQueryClient();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['quiz', lessonId],
    queryFn: async () => {
      const response = await apiClient.get(`/quizzes/lesson/${lessonId}`);
      return response.data;
    },
    enabled: !!lessonId,
  });

  const submitMutation = useMutation({
    mutationFn: async (quizId: string) => {
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer,
      }));
      const response = await apiClient.post(`/quizzes/${quizId}/submit`, {
        answers: formattedAnswers,
        timeSpent: 0,
      });
      return response.data;
    },
    onSuccess: (response) => {
      setResult(response.data);
      queryClient.invalidateQueries({ queryKey: ['quiz', lessonId] });
      if (response.data.passed && onComplete) {
        onComplete();
      }
    },
  });

  const quiz: Quiz | null = data?.data?.quiz;
  const attempts = data?.data?.attempts || 0;
  const canAttempt = data?.data?.canAttempt ?? true;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
        <HelpCircle className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-gray-500">
          No quiz available for this lesson yet.
        </p>
      </div>
    );
  }

  // Show result screen
  if (result) {
    return (
      <div className="rounded-lg bg-white p-8 shadow">
        <div className="text-center">
          {result.passed ? (
            <>
              <Trophy className="mx-auto h-16 w-16 text-yellow-500" />
              <h2 className="mt-4 text-2xl font-bold text-green-600">Congratulations!</h2>
              <p className="mt-2 text-gray-600">You passed the quiz!</p>
            </>
          ) : (
            <>
              <XCircle className="mx-auto h-16 w-16 text-red-500" />
              <h2 className="mt-4 text-2xl font-bold text-red-600">Not Quite!</h2>
              <p className="mt-2 text-gray-600">You didn't pass this time. Try again!</p>
            </>
          )}

          <div className="mt-6 rounded-lg bg-gray-50 p-4">
            <div className="text-4xl font-bold text-gray-900">{result.percentage}%</div>
            <div className="text-sm text-gray-500">
              {result.score} / {result.maxScore} points
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Passing score: {quiz.settings.passingScore}%
            </div>
          </div>

          {/* Show answers if enabled */}
          {result.answers && quiz.settings.showCorrectAnswers && (
            <div className="mt-6 text-left">
              <h3 className="font-semibold text-gray-900">Results:</h3>
              <div className="mt-2 space-y-2">
                {quiz.questions.map((q, idx) => {
                  const answer = result.answers?.find(a => a.questionId === q._id);
                  return (
                    <div key={q._id} className="flex items-center gap-2 text-sm">
                      {answer?.isCorrect ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-gray-700">Question {idx + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-center gap-4">
            {canAttempt && !result.passed && (
              <Button
                onClick={() => {
                  setResult(null);
                  setAnswers({});
                  setCurrentQuestion(0);
                  setQuizStarted(false);
                  refetch();
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            )}
            {result.passed && onComplete && (
              <Button onClick={onComplete}>
                Continue to Next Lesson
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show start screen
  if (!quizStarted) {
    return (
      <div className="rounded-lg bg-white p-8 shadow">
        <div className="text-center">
          <HelpCircle className="mx-auto h-16 w-16 text-purple-500" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">{quiz.title}</h2>
          {quiz.description && (
            <p className="mt-2 text-gray-600">{quiz.description}</p>
          )}

          <div className="mt-6 rounded-lg bg-gray-50 p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500">Questions</div>
                <div className="font-semibold text-gray-900">{quiz.questions.length}</div>
              </div>
              <div>
                <div className="text-gray-500">Passing Score</div>
                <div className="font-semibold text-gray-900">{quiz.settings.passingScore}%</div>
              </div>
              <div>
                <div className="text-gray-500">Previous Attempts</div>
                <div className="font-semibold text-gray-900">{attempts}</div>
              </div>
              <div>
                <div className="text-gray-500">Total Points</div>
                <div className="font-semibold text-gray-900">
                  {quiz.questions.reduce((sum, q) => sum + q.points, 0)}
                </div>
              </div>
            </div>
          </div>

          <Button
            className="mt-6"
            onClick={() => setQuizStarted(true)}
            disabled={!canAttempt}
          >
            {canAttempt ? 'Start Quiz' : 'Maximum Attempts Reached'}
          </Button>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const selectedAnswer = answers[question._id];

  const handleSelectAnswer = (optionId: string) => {
    if (question.type === 'multiple-select') {
      const current = (answers[question._id] as string[]) || [];
      if (current.includes(optionId)) {
        setAnswers({
          ...answers,
          [question._id]: current.filter(id => id !== optionId),
        });
      } else {
        setAnswers({
          ...answers,
          [question._id]: [...current, optionId],
        });
      }
    } else {
      setAnswers({
        ...answers,
        [question._id]: optionId,
      });
    }
  };

  const isOptionSelected = (optionId: string) => {
    if (question.type === 'multiple-select') {
      return ((answers[question._id] as string[]) || []).includes(optionId);
    }
    return answers[question._id] === optionId;
  };

  const handleSubmit = () => {
    submitMutation.mutate(quiz._id);
  };

  return (
    <div className="rounded-lg bg-white p-8 shadow">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
          <span>{question.points} points</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-purple-600 transition-all"
            style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{question.question}</h3>
        {question.type === 'multiple-select' && (
          <p className="mt-1 text-sm text-gray-500">Select all that apply</p>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options?.map((option) => (
          <button
            key={option._id}
            onClick={() => handleSelectAnswer(option._id)}
            className={`w-full rounded-lg border-2 p-4 text-left transition-colors ${
              isOptionSelected(option._id)
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  isOptionSelected(option._id)
                    ? 'border-purple-500 bg-purple-500'
                    : 'border-gray-300'
                }`}
              >
                {isOptionSelected(option._id) && (
                  <CheckCircle className="h-3 w-3 text-white" />
                )}
              </div>
              <span className="text-gray-900">{option.text}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>

        {currentQuestion < quiz.questions.length - 1 ? (
          <Button
            onClick={() => setCurrentQuestion(currentQuestion + 1)}
            disabled={!selectedAnswer}
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={submitMutation.isPending || Object.keys(answers).length < quiz.questions.length}
          >
            {submitMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Quiz'
            )}
          </Button>
        )}
      </div>

      {/* Question navigation dots */}
      <div className="mt-6 flex justify-center gap-2">
        {quiz.questions.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentQuestion(idx)}
            className={`h-2 w-2 rounded-full transition-colors ${
              idx === currentQuestion
                ? 'bg-purple-600'
                : answers[quiz.questions[idx]._id]
                ? 'bg-purple-300'
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
