import { Types } from 'mongoose';
import { courseIds } from './courses.js';

// Helper to create a question
const createQuestion = (
  type: 'multiple-choice' | 'multiple-select' | 'true-false' | 'fill-blank',
  question: string,
  options: { text: string; isCorrect: boolean }[],
  explanation: string,
  points: number = 10,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  order: number
) => ({
  _id: new Types.ObjectId(),
  type,
  question,
  options: options.map(opt => ({
    _id: new Types.ObjectId(),
    text: opt.text,
    isCorrect: opt.isCorrect,
  })),
  explanation,
  points,
  difficulty,
  order,
});

// Create true/false question helper
const createTrueFalse = (
  question: string,
  correct: boolean,
  explanation: string,
  points: number = 10,
  difficulty: 'easy' | 'medium' | 'hard' = 'easy',
  order: number
) => createQuestion(
  'true-false',
  question,
  [
    { text: 'True', isCorrect: correct },
    { text: 'False', isCorrect: !correct },
  ],
  explanation,
  points,
  difficulty,
  order
);

export const getQuizzesData = (courseMap: Map<string, Types.ObjectId>) => [
  // ==================== AI COURSE QUIZZES ====================
  {
    _id: new Types.ObjectId(),
    course: courseIds.introToAI,
    title: 'Introduction to AI Quiz',
    description: 'Test your understanding of AI fundamentals and concepts.',
    type: 'practice',
    settings: {
      timeLimit: 900,
      passingScore: 70,
      maxAttempts: 3,
      shuffleQuestions: true,
      shuffleAnswers: true,
      showCorrectAnswers: true,
      showExplanations: true,
    },
    questions: [
      createQuestion(
        'multiple-choice',
        'What does AI stand for?',
        [
          { text: 'Artificial Intelligence', isCorrect: true },
          { text: 'Automated Integration', isCorrect: false },
          { text: 'Advanced Information', isCorrect: false },
          { text: 'Automatic Inference', isCorrect: false },
        ],
        'AI stands for Artificial Intelligence, which refers to the simulation of human intelligence in machines.',
        10,
        'easy',
        1
      ),
      createQuestion(
        'multiple-choice',
        'Which of the following is NOT a type of machine learning?',
        [
          { text: 'Supervised Learning', isCorrect: false },
          { text: 'Unsupervised Learning', isCorrect: false },
          { text: 'Reinforcement Learning', isCorrect: false },
          { text: 'Conclusive Learning', isCorrect: true },
        ],
        'The three main types of machine learning are Supervised, Unsupervised, and Reinforcement Learning. Conclusive Learning is not a recognized type.',
        10,
        'medium',
        2
      ),
      createTrueFalse(
        'Deep Learning is a subset of Machine Learning.',
        true,
        'Deep Learning is indeed a subset of Machine Learning that uses neural networks with multiple layers.',
        10,
        'easy',
        3
      ),
      createQuestion(
        'multiple-choice',
        'What is the primary goal of supervised learning?',
        [
          { text: 'To find patterns in unlabeled data', isCorrect: false },
          { text: 'To learn from labeled data to make predictions', isCorrect: true },
          { text: 'To maximize rewards through trial and error', isCorrect: false },
          { text: 'To reduce dimensionality of data', isCorrect: false },
        ],
        'Supervised learning uses labeled training data to learn a mapping from inputs to outputs for making predictions.',
        10,
        'medium',
        4
      ),
      createTrueFalse(
        'Neural networks are inspired by the human brain.',
        true,
        'Neural networks are computational models inspired by the biological neural networks in human brains.',
        10,
        'easy',
        5
      ),
      createQuestion(
        'multiple-select',
        'Which of the following are common applications of AI? (Select all that apply)',
        [
          { text: 'Image Recognition', isCorrect: true },
          { text: 'Natural Language Processing', isCorrect: true },
          { text: 'Manual Data Entry', isCorrect: false },
          { text: 'Autonomous Vehicles', isCorrect: true },
        ],
        'Image Recognition, NLP, and Autonomous Vehicles are common AI applications. Manual Data Entry is not an AI application.',
        15,
        'medium',
        6
      ),
      createQuestion(
        'multiple-choice',
        'What is an activation function in neural networks?',
        [
          { text: 'A function that starts the training process', isCorrect: false },
          { text: 'A function that determines if a neuron should be activated', isCorrect: true },
          { text: 'A function that loads the dataset', isCorrect: false },
          { text: 'A function that saves the model', isCorrect: false },
        ],
        'An activation function determines whether a neuron should be activated based on the weighted sum of its inputs.',
        10,
        'medium',
        7
      ),
      createTrueFalse(
        'AI can completely replace human decision-making in all scenarios.',
        false,
        'AI has limitations and cannot replace human decision-making in all scenarios, especially those requiring ethical judgment, creativity, and complex emotional understanding.',
        10,
        'medium',
        8
      ),
    ],
    stats: { totalAttempts: 0, averageScore: 0, passRate: 0 },
    isActive: true,
  },

  // ==================== ML FUNDAMENTALS QUIZZES ====================
  {
    _id: new Types.ObjectId(),
    course: courseIds.mlFundamentals,
    title: 'Supervised Learning Quiz',
    description: 'Test your knowledge of supervised learning algorithms.',
    type: 'graded',
    settings: {
      timeLimit: 1200,
      passingScore: 75,
      maxAttempts: 2,
      shuffleQuestions: true,
      shuffleAnswers: true,
      showCorrectAnswers: true,
      showExplanations: true,
    },
    questions: [
      createQuestion(
        'multiple-choice',
        'Which algorithm is commonly used for classification problems?',
        [
          { text: 'Linear Regression', isCorrect: false },
          { text: 'Logistic Regression', isCorrect: true },
          { text: 'K-Means Clustering', isCorrect: false },
          { text: 'PCA', isCorrect: false },
        ],
        'Logistic Regression is used for classification problems, while Linear Regression is for continuous predictions.',
        10,
        'medium',
        1
      ),
      createQuestion(
        'multiple-choice',
        'What does the "R-squared" metric measure?',
        [
          { text: 'The accuracy of a classification model', isCorrect: false },
          { text: 'The proportion of variance explained by the model', isCorrect: true },
          { text: 'The error rate of the model', isCorrect: false },
          { text: 'The learning rate of the model', isCorrect: false },
        ],
        'R-squared measures how well the model explains the variance in the target variable.',
        10,
        'medium',
        2
      ),
      createTrueFalse(
        'Decision Trees can be used for both classification and regression.',
        true,
        'Decision Trees are versatile and can handle both classification and regression tasks.',
        10,
        'easy',
        3
      ),
      createQuestion(
        'multiple-choice',
        'What is overfitting?',
        [
          { text: 'When a model performs well on training data but poorly on new data', isCorrect: true },
          { text: 'When a model is too simple to capture patterns', isCorrect: false },
          { text: 'When the training data is too small', isCorrect: false },
          { text: 'When the model trains too slowly', isCorrect: false },
        ],
        'Overfitting occurs when a model learns the training data too well, including noise, and fails to generalize.',
        10,
        'medium',
        4
      ),
      createQuestion(
        'multiple-choice',
        'What technique helps prevent overfitting in Random Forests?',
        [
          { text: 'Using a single tree', isCorrect: false },
          { text: 'Bootstrap aggregating (Bagging)', isCorrect: true },
          { text: 'Using less training data', isCorrect: false },
          { text: 'Removing all hyperparameters', isCorrect: false },
        ],
        'Random Forests use bagging to create multiple trees and aggregate their predictions, reducing overfitting.',
        10,
        'hard',
        5
      ),
      createQuestion(
        'multiple-select',
        'Which metrics are used for classification evaluation? (Select all that apply)',
        [
          { text: 'Precision', isCorrect: true },
          { text: 'Recall', isCorrect: true },
          { text: 'Mean Squared Error', isCorrect: false },
          { text: 'F1-Score', isCorrect: true },
        ],
        'Precision, Recall, and F1-Score are classification metrics. MSE is used for regression.',
        15,
        'medium',
        6
      ),
    ],
    stats: { totalAttempts: 0, averageScore: 0, passRate: 0 },
    isActive: true,
  },

  // ==================== AWS COURSE QUIZZES ====================
  {
    _id: new Types.ObjectId(),
    course: courseIds.awsArchitect,
    title: 'AWS Fundamentals Quiz',
    description: 'Test your knowledge of AWS core services and concepts.',
    type: 'practice',
    settings: {
      timeLimit: 900,
      passingScore: 70,
      maxAttempts: 5,
      shuffleQuestions: true,
      shuffleAnswers: true,
      showCorrectAnswers: true,
      showExplanations: true,
    },
    questions: [
      createQuestion(
        'multiple-choice',
        'What does EC2 stand for?',
        [
          { text: 'Elastic Cloud Computing', isCorrect: false },
          { text: 'Elastic Compute Cloud', isCorrect: true },
          { text: 'Enterprise Cloud Computing', isCorrect: false },
          { text: 'Enhanced Compute Cluster', isCorrect: false },
        ],
        'EC2 stands for Elastic Compute Cloud, which provides scalable computing capacity in the AWS cloud.',
        10,
        'easy',
        1
      ),
      createQuestion(
        'multiple-choice',
        'Which AWS service provides object storage?',
        [
          { text: 'EBS', isCorrect: false },
          { text: 'EFS', isCorrect: false },
          { text: 'S3', isCorrect: true },
          { text: 'RDS', isCorrect: false },
        ],
        'S3 (Simple Storage Service) provides object storage with high availability and durability.',
        10,
        'easy',
        2
      ),
      createTrueFalse(
        'IAM users should have the minimum necessary permissions.',
        true,
        'The principle of least privilege states that users should only have the permissions they need to perform their tasks.',
        10,
        'easy',
        3
      ),
      createQuestion(
        'multiple-choice',
        'What is the default timeout for an AWS Lambda function?',
        [
          { text: '1 second', isCorrect: false },
          { text: '3 seconds', isCorrect: true },
          { text: '15 minutes', isCorrect: false },
          { text: '30 seconds', isCorrect: false },
        ],
        'The default timeout for Lambda is 3 seconds, but it can be configured up to 15 minutes.',
        10,
        'medium',
        4
      ),
      createQuestion(
        'multiple-select',
        'Which are valid S3 storage classes? (Select all that apply)',
        [
          { text: 'S3 Standard', isCorrect: true },
          { text: 'S3 Intelligent-Tiering', isCorrect: true },
          { text: 'S3 Premium', isCorrect: false },
          { text: 'S3 Glacier', isCorrect: true },
        ],
        'S3 Standard, Intelligent-Tiering, and Glacier are valid storage classes. S3 Premium does not exist.',
        15,
        'medium',
        5
      ),
      createQuestion(
        'multiple-choice',
        'What is an Availability Zone?',
        [
          { text: 'A geographic region', isCorrect: false },
          { text: 'One or more discrete data centers', isCorrect: true },
          { text: 'A network security group', isCorrect: false },
          { text: 'A virtual private cloud', isCorrect: false },
        ],
        'An AZ is one or more discrete data centers with redundant power, networking, and connectivity in an AWS Region.',
        10,
        'medium',
        6
      ),
      createTrueFalse(
        'Security Groups are stateful.',
        true,
        'Security Groups are stateful, meaning return traffic is automatically allowed regardless of inbound rules.',
        10,
        'medium',
        7
      ),
    ],
    stats: { totalAttempts: 0, averageScore: 0, passRate: 0 },
    isActive: true,
  },

  // ==================== REACT COURSE QUIZZES ====================
  {
    _id: new Types.ObjectId(),
    course: courseIds.react18Complete,
    title: 'React Fundamentals Quiz',
    description: 'Test your understanding of React core concepts.',
    type: 'practice',
    settings: {
      timeLimit: 600,
      passingScore: 70,
      maxAttempts: 5,
      shuffleQuestions: true,
      shuffleAnswers: true,
      showCorrectAnswers: true,
      showExplanations: true,
    },
    questions: [
      createQuestion(
        'multiple-choice',
        'What is JSX?',
        [
          { text: 'A JavaScript framework', isCorrect: false },
          { text: 'A syntax extension for JavaScript', isCorrect: true },
          { text: 'A CSS preprocessor', isCorrect: false },
          { text: 'A build tool', isCorrect: false },
        ],
        'JSX is a syntax extension that allows you to write HTML-like code in JavaScript.',
        10,
        'easy',
        1
      ),
      createQuestion(
        'multiple-choice',
        'Which hook is used to manage state in functional components?',
        [
          { text: 'useEffect', isCorrect: false },
          { text: 'useState', isCorrect: true },
          { text: 'useContext', isCorrect: false },
          { text: 'useReducer', isCorrect: false },
        ],
        'useState is the primary hook for adding state to functional components.',
        10,
        'easy',
        2
      ),
      createTrueFalse(
        'useEffect runs after every render by default.',
        true,
        'Without a dependency array, useEffect runs after the initial render and after every update.',
        10,
        'medium',
        3
      ),
      createQuestion(
        'multiple-choice',
        'What is the purpose of the key prop in lists?',
        [
          { text: 'For styling purposes', isCorrect: false },
          { text: 'To help React identify which items have changed', isCorrect: true },
          { text: 'To encrypt the list items', isCorrect: false },
          { text: 'To sort the list', isCorrect: false },
        ],
        'Keys help React identify which items have changed, been added, or removed for efficient updates.',
        10,
        'medium',
        4
      ),
      createQuestion(
        'multiple-select',
        'Which are valid React hooks? (Select all that apply)',
        [
          { text: 'useState', isCorrect: true },
          { text: 'useEffect', isCorrect: true },
          { text: 'useClass', isCorrect: false },
          { text: 'useMemo', isCorrect: true },
        ],
        'useState, useEffect, and useMemo are built-in React hooks. useClass does not exist.',
        15,
        'easy',
        5
      ),
      createQuestion(
        'multiple-choice',
        'What does lifting state up mean?',
        [
          { text: 'Storing state in local storage', isCorrect: false },
          { text: 'Moving state to a common ancestor component', isCorrect: true },
          { text: 'Using context for state', isCorrect: false },
          { text: 'Deleting state', isCorrect: false },
        ],
        'Lifting state up means moving state to a common ancestor so multiple components can share it.',
        10,
        'medium',
        6
      ),
    ],
    stats: { totalAttempts: 0, averageScore: 0, passRate: 0 },
    isActive: true,
  },
  {
    _id: new Types.ObjectId(),
    course: courseIds.react18Complete,
    title: 'React Hooks Deep Dive Quiz',
    description: 'Advanced quiz on React Hooks usage patterns.',
    type: 'graded',
    settings: {
      timeLimit: 900,
      passingScore: 75,
      maxAttempts: 2,
      shuffleQuestions: true,
      shuffleAnswers: true,
      showCorrectAnswers: true,
      showExplanations: true,
    },
    questions: [
      createQuestion(
        'multiple-choice',
        'When should you use useCallback?',
        [
          { text: 'For every function in a component', isCorrect: false },
          { text: 'When passing callbacks to optimized child components', isCorrect: true },
          { text: 'To create new functions on every render', isCorrect: false },
          { text: 'To replace useState', isCorrect: false },
        ],
        'useCallback is used to memoize functions, preventing unnecessary re-renders of child components.',
        10,
        'hard',
        1
      ),
      createQuestion(
        'multiple-choice',
        'What is the difference between useMemo and useCallback?',
        [
          { text: 'They are the same', isCorrect: false },
          { text: 'useMemo memoizes values, useCallback memoizes functions', isCorrect: true },
          { text: 'useMemo is for effects, useCallback is for state', isCorrect: false },
          { text: 'useCallback is deprecated', isCorrect: false },
        ],
        'useMemo returns a memoized value, while useCallback returns a memoized callback function.',
        10,
        'hard',
        2
      ),
      createTrueFalse(
        'Custom hooks must start with the word "use".',
        true,
        'By convention, custom hooks must start with "use" so React can apply the Rules of Hooks.',
        10,
        'medium',
        3
      ),
      createQuestion(
        'multiple-choice',
        'What happens when you call setState with the same value?',
        [
          { text: 'The component always re-renders', isCorrect: false },
          { text: 'React bails out of the render', isCorrect: true },
          { text: 'An error is thrown', isCorrect: false },
          { text: 'The state is reset', isCorrect: false },
        ],
        'React uses Object.is to compare values. If the new state is the same, React skips the re-render.',
        10,
        'hard',
        4
      ),
      createQuestion(
        'multiple-choice',
        'How do you run useEffect only on mount?',
        [
          { text: 'Use no dependency array', isCorrect: false },
          { text: 'Use an empty dependency array []', isCorrect: true },
          { text: 'Return a cleanup function', isCorrect: false },
          { text: 'Use useLayoutEffect instead', isCorrect: false },
        ],
        'An empty dependency array [] tells React to only run the effect once after the initial render.',
        10,
        'medium',
        5
      ),
    ],
    stats: { totalAttempts: 0, averageScore: 0, passRate: 0 },
    isActive: true,
  },

  // ==================== NODE.JS COURSE QUIZZES ====================
  {
    _id: new Types.ObjectId(),
    course: courseIds.nodeExpress,
    title: 'Node.js Fundamentals Quiz',
    description: 'Test your understanding of Node.js core concepts.',
    type: 'practice',
    settings: {
      timeLimit: 600,
      passingScore: 70,
      maxAttempts: 5,
      shuffleQuestions: true,
      shuffleAnswers: true,
      showCorrectAnswers: true,
      showExplanations: true,
    },
    questions: [
      createQuestion(
        'multiple-choice',
        'What is Node.js?',
        [
          { text: 'A frontend framework', isCorrect: false },
          { text: 'A JavaScript runtime built on Chrome\'s V8 engine', isCorrect: true },
          { text: 'A database', isCorrect: false },
          { text: 'A CSS framework', isCorrect: false },
        ],
        'Node.js is a JavaScript runtime that allows you to run JavaScript on the server side.',
        10,
        'easy',
        1
      ),
      createTrueFalse(
        'Node.js is single-threaded.',
        true,
        'Node.js runs JavaScript in a single thread but uses async I/O operations and a thread pool for blocking operations.',
        10,
        'medium',
        2
      ),
      createQuestion(
        'multiple-choice',
        'What is npm?',
        [
          { text: 'Node Package Manager', isCorrect: true },
          { text: 'Node Process Manager', isCorrect: false },
          { text: 'New Programming Module', isCorrect: false },
          { text: 'Network Protocol Manager', isCorrect: false },
        ],
        'npm is Node Package Manager, used to install and manage Node.js packages.',
        10,
        'easy',
        3
      ),
      createQuestion(
        'multiple-choice',
        'What module is used for file system operations in Node.js?',
        [
          { text: 'file', isCorrect: false },
          { text: 'fs', isCorrect: true },
          { text: 'path', isCorrect: false },
          { text: 'os', isCorrect: false },
        ],
        'The fs (file system) module provides methods for interacting with the file system.',
        10,
        'easy',
        4
      ),
      createQuestion(
        'multiple-select',
        'Which are valid middleware types in Express? (Select all that apply)',
        [
          { text: 'Application-level middleware', isCorrect: true },
          { text: 'Router-level middleware', isCorrect: true },
          { text: 'Database middleware', isCorrect: false },
          { text: 'Error-handling middleware', isCorrect: true },
        ],
        'Express has application-level, router-level, error-handling, built-in, and third-party middleware.',
        15,
        'medium',
        5
      ),
    ],
    stats: { totalAttempts: 0, averageScore: 0, passRate: 0 },
    isActive: true,
  },

  // ==================== DOCKER COURSE QUIZZES ====================
  {
    _id: new Types.ObjectId(),
    course: courseIds.dockerKubernetes,
    title: 'Docker Fundamentals Quiz',
    description: 'Test your understanding of Docker concepts.',
    type: 'practice',
    settings: {
      timeLimit: 600,
      passingScore: 70,
      maxAttempts: 5,
      shuffleQuestions: true,
      shuffleAnswers: true,
      showCorrectAnswers: true,
      showExplanations: true,
    },
    questions: [
      createQuestion(
        'multiple-choice',
        'What is a Docker container?',
        [
          { text: 'A virtual machine', isCorrect: false },
          { text: 'A lightweight, standalone executable package', isCorrect: true },
          { text: 'A type of database', isCorrect: false },
          { text: 'A programming language', isCorrect: false },
        ],
        'A container is a lightweight, standalone package that includes everything needed to run a piece of software.',
        10,
        'easy',
        1
      ),
      createQuestion(
        'multiple-choice',
        'What file defines a Docker image?',
        [
          { text: 'docker-compose.yml', isCorrect: false },
          { text: 'Dockerfile', isCorrect: true },
          { text: 'package.json', isCorrect: false },
          { text: 'container.json', isCorrect: false },
        ],
        'A Dockerfile is a text file with instructions for building a Docker image.',
        10,
        'easy',
        2
      ),
      createTrueFalse(
        'Docker containers share the host OS kernel.',
        true,
        'Unlike VMs, Docker containers share the host kernel, making them lightweight and fast.',
        10,
        'medium',
        3
      ),
      createQuestion(
        'multiple-choice',
        'What command is used to build a Docker image?',
        [
          { text: 'docker create', isCorrect: false },
          { text: 'docker build', isCorrect: true },
          { text: 'docker make', isCorrect: false },
          { text: 'docker compile', isCorrect: false },
        ],
        'docker build is used to create an image from a Dockerfile.',
        10,
        'easy',
        4
      ),
      createQuestion(
        'multiple-select',
        'Which are valid Docker commands? (Select all that apply)',
        [
          { text: 'docker run', isCorrect: true },
          { text: 'docker ps', isCorrect: true },
          { text: 'docker compile', isCorrect: false },
          { text: 'docker exec', isCorrect: true },
        ],
        'docker run, ps, and exec are valid commands. docker compile does not exist.',
        15,
        'easy',
        5
      ),
      createQuestion(
        'multiple-choice',
        'What is the purpose of docker-compose?',
        [
          { text: 'To compress Docker images', isCorrect: false },
          { text: 'To define and run multi-container applications', isCorrect: true },
          { text: 'To deploy to Kubernetes', isCorrect: false },
          { text: 'To monitor containers', isCorrect: false },
        ],
        'Docker Compose is a tool for defining and running multi-container Docker applications.',
        10,
        'medium',
        6
      ),
    ],
    stats: { totalAttempts: 0, averageScore: 0, passRate: 0 },
    isActive: true,
  },

  // ==================== AGILE COURSE QUIZZES ====================
  {
    _id: new Types.ObjectId(),
    course: courseIds.agileScrum,
    title: 'Agile Fundamentals Quiz',
    description: 'Test your understanding of Agile principles.',
    type: 'practice',
    settings: {
      timeLimit: 600,
      passingScore: 70,
      maxAttempts: 5,
      shuffleQuestions: true,
      shuffleAnswers: true,
      showCorrectAnswers: true,
      showExplanations: true,
    },
    questions: [
      createQuestion(
        'multiple-choice',
        'How many values are in the Agile Manifesto?',
        [
          { text: '2', isCorrect: false },
          { text: '4', isCorrect: true },
          { text: '12', isCorrect: false },
          { text: '6', isCorrect: false },
        ],
        'The Agile Manifesto has 4 values and 12 principles.',
        10,
        'easy',
        1
      ),
      createQuestion(
        'multiple-choice',
        'What is a Sprint in Scrum?',
        [
          { text: 'A long-term project plan', isCorrect: false },
          { text: 'A time-boxed iteration of work', isCorrect: true },
          { text: 'A type of meeting', isCorrect: false },
          { text: 'A development tool', isCorrect: false },
        ],
        'A Sprint is a time-boxed period (usually 2-4 weeks) during which a potentially releasable increment is created.',
        10,
        'easy',
        2
      ),
      createTrueFalse(
        'The Scrum Master is responsible for managing the team.',
        false,
        'The Scrum Master is a servant-leader who facilitates the team, not a traditional manager.',
        10,
        'medium',
        3
      ),
      createQuestion(
        'multiple-select',
        'Which are Scrum ceremonies? (Select all that apply)',
        [
          { text: 'Sprint Planning', isCorrect: true },
          { text: 'Daily Standup', isCorrect: true },
          { text: 'Weekly Status Report', isCorrect: false },
          { text: 'Sprint Retrospective', isCorrect: true },
        ],
        'Sprint Planning, Daily Standup, Sprint Review, and Sprint Retrospective are Scrum ceremonies.',
        15,
        'medium',
        4
      ),
      createQuestion(
        'multiple-choice',
        'Who is responsible for maximizing the value of the product?',
        [
          { text: 'Scrum Master', isCorrect: false },
          { text: 'Product Owner', isCorrect: true },
          { text: 'Development Team', isCorrect: false },
          { text: 'Stakeholders', isCorrect: false },
        ],
        'The Product Owner is responsible for maximizing the value of the product and managing the Product Backlog.',
        10,
        'medium',
        5
      ),
    ],
    stats: { totalAttempts: 0, averageScore: 0, passRate: 0 },
    isActive: true,
  },

  // ==================== TYPESCRIPT COURSE QUIZZES ====================
  {
    _id: new Types.ObjectId(),
    course: courseIds.typescriptDeep,
    title: 'TypeScript Basics Quiz',
    description: 'Test your understanding of TypeScript fundamentals.',
    type: 'practice',
    settings: {
      timeLimit: 600,
      passingScore: 70,
      maxAttempts: 5,
      shuffleQuestions: true,
      shuffleAnswers: true,
      showCorrectAnswers: true,
      showExplanations: true,
    },
    questions: [
      createQuestion(
        'multiple-choice',
        'What is TypeScript?',
        [
          { text: 'A new programming language', isCorrect: false },
          { text: 'A typed superset of JavaScript', isCorrect: true },
          { text: 'A JavaScript library', isCorrect: false },
          { text: 'A build tool', isCorrect: false },
        ],
        'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.',
        10,
        'easy',
        1
      ),
      createQuestion(
        'multiple-choice',
        'What keyword is used to define an interface?',
        [
          { text: 'type', isCorrect: false },
          { text: 'interface', isCorrect: true },
          { text: 'class', isCorrect: false },
          { text: 'struct', isCorrect: false },
        ],
        'The interface keyword is used to define the shape of an object in TypeScript.',
        10,
        'easy',
        2
      ),
      createTrueFalse(
        'TypeScript is executed directly in the browser.',
        false,
        'TypeScript must be compiled to JavaScript before it can run in the browser.',
        10,
        'easy',
        3
      ),
      createQuestion(
        'multiple-choice',
        'What is the "any" type used for?',
        [
          { text: 'To define a specific type', isCorrect: false },
          { text: 'To opt-out of type checking', isCorrect: true },
          { text: 'To create unions', isCorrect: false },
          { text: 'To define arrays', isCorrect: false },
        ],
        'The any type disables type checking for that variable, allowing any value.',
        10,
        'easy',
        4
      ),
      createQuestion(
        'multiple-select',
        'Which are valid TypeScript types? (Select all that apply)',
        [
          { text: 'string', isCorrect: true },
          { text: 'number', isCorrect: true },
          { text: 'integer', isCorrect: false },
          { text: 'boolean', isCorrect: true },
        ],
        'string, number, and boolean are primitive types. TypeScript doesn\'t have a separate integer type.',
        15,
        'easy',
        5
      ),
      createQuestion(
        'multiple-choice',
        'What is a generic in TypeScript?',
        [
          { text: 'A default export', isCorrect: false },
          { text: 'A type that works with multiple types', isCorrect: true },
          { text: 'A special function', isCorrect: false },
          { text: 'A module system', isCorrect: false },
        ],
        'Generics allow you to write code that works with multiple types while maintaining type safety.',
        10,
        'medium',
        6
      ),
    ],
    stats: { totalAttempts: 0, averageScore: 0, passRate: 0 },
    isActive: true,
  },

  // ==================== DATA ANALYTICS QUIZ ====================
  {
    _id: new Types.ObjectId(),
    course: courseIds.dataAnalytics,
    title: 'SQL for Analytics Quiz',
    description: 'Test your SQL skills for data analysis.',
    type: 'practice',
    settings: {
      timeLimit: 900,
      passingScore: 70,
      maxAttempts: 5,
      shuffleQuestions: true,
      shuffleAnswers: true,
      showCorrectAnswers: true,
      showExplanations: true,
    },
    questions: [
      createQuestion(
        'multiple-choice',
        'Which SQL clause is used to filter rows?',
        [
          { text: 'SELECT', isCorrect: false },
          { text: 'WHERE', isCorrect: true },
          { text: 'ORDER BY', isCorrect: false },
          { text: 'GROUP BY', isCorrect: false },
        ],
        'The WHERE clause filters rows based on specified conditions.',
        10,
        'easy',
        1
      ),
      createQuestion(
        'multiple-choice',
        'What does GROUP BY do?',
        [
          { text: 'Sorts the results', isCorrect: false },
          { text: 'Groups rows that have the same values', isCorrect: true },
          { text: 'Filters rows', isCorrect: false },
          { text: 'Joins tables', isCorrect: false },
        ],
        'GROUP BY groups rows with the same values in specified columns, often used with aggregate functions.',
        10,
        'medium',
        2
      ),
      createQuestion(
        'multiple-select',
        'Which are aggregate functions in SQL? (Select all that apply)',
        [
          { text: 'SUM', isCorrect: true },
          { text: 'COUNT', isCorrect: true },
          { text: 'SELECT', isCorrect: false },
          { text: 'AVG', isCorrect: true },
        ],
        'SUM, COUNT, AVG, MAX, and MIN are aggregate functions. SELECT is a statement, not a function.',
        15,
        'easy',
        3
      ),
      createQuestion(
        'multiple-choice',
        'What type of JOIN returns all rows when there is a match in either table?',
        [
          { text: 'INNER JOIN', isCorrect: false },
          { text: 'LEFT JOIN', isCorrect: false },
          { text: 'FULL OUTER JOIN', isCorrect: true },
          { text: 'CROSS JOIN', isCorrect: false },
        ],
        'FULL OUTER JOIN returns all rows from both tables, with NULLs where there is no match.',
        10,
        'hard',
        4
      ),
      createTrueFalse(
        'HAVING is used to filter groups after GROUP BY.',
        true,
        'HAVING filters groups after aggregation, while WHERE filters rows before aggregation.',
        10,
        'medium',
        5
      ),
    ],
    stats: { totalAttempts: 0, averageScore: 0, passRate: 0 },
    isActive: true,
  },

  // ==================== CLOUD SECURITY QUIZ ====================
  {
    _id: new Types.ObjectId(),
    course: courseIds.cloudSecurity,
    title: 'Cloud Security Basics Quiz',
    description: 'Test your understanding of cloud security fundamentals.',
    type: 'practice',
    settings: {
      timeLimit: 600,
      passingScore: 70,
      maxAttempts: 5,
      shuffleQuestions: true,
      shuffleAnswers: true,
      showCorrectAnswers: true,
      showExplanations: true,
    },
    questions: [
      createQuestion(
        'multiple-choice',
        'What does the Shared Responsibility Model define?',
        [
          { text: 'How to share data between clouds', isCorrect: false },
          { text: 'Security responsibilities between cloud provider and customer', isCorrect: true },
          { text: 'How to share costs', isCorrect: false },
          { text: 'Network sharing policies', isCorrect: false },
        ],
        'The Shared Responsibility Model defines which security tasks are handled by the cloud provider and which by the customer.',
        10,
        'medium',
        1
      ),
      createTrueFalse(
        'Encryption at rest protects data while it is being transmitted.',
        false,
        'Encryption at rest protects stored data. Encryption in transit protects data during transmission.',
        10,
        'easy',
        2
      ),
      createQuestion(
        'multiple-choice',
        'What is MFA?',
        [
          { text: 'Multiple Factor Authentication', isCorrect: false },
          { text: 'Multi-Factor Authentication', isCorrect: true },
          { text: 'Main Firewall Application', isCorrect: false },
          { text: 'Managed File Access', isCorrect: false },
        ],
        'MFA (Multi-Factor Authentication) requires two or more verification methods for access.',
        10,
        'easy',
        3
      ),
      createQuestion(
        'multiple-select',
        'Which are common cloud security threats? (Select all that apply)',
        [
          { text: 'Data breaches', isCorrect: true },
          { text: 'Misconfiguration', isCorrect: true },
          { text: 'Hardware theft', isCorrect: false },
          { text: 'Account hijacking', isCorrect: true },
        ],
        'Data breaches, misconfiguration, and account hijacking are common cloud threats. Hardware security is the provider\'s responsibility.',
        15,
        'medium',
        4
      ),
      createQuestion(
        'multiple-choice',
        'What is the principle of least privilege?',
        [
          { text: 'Giving everyone admin access', isCorrect: false },
          { text: 'Giving users only the minimum access they need', isCorrect: true },
          { text: 'Using the cheapest services', isCorrect: false },
          { text: 'Minimizing cloud usage', isCorrect: false },
        ],
        'Least privilege means users should only have the minimum permissions necessary for their tasks.',
        10,
        'medium',
        5
      ),
    ],
    stats: { totalAttempts: 0, averageScore: 0, passRate: 0 },
    isActive: true,
  },
];
