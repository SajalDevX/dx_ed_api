'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Circle,
  FileText,
  HelpCircle,
  Loader2,
  Menu,
  X,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { QuizPlayer } from '@/components/quiz/QuizPlayer';
import { coursesApi } from '@/lib/api/courses';
import { useAuthStore } from '@/stores/authStore';
import type { Lesson, Module } from '@/types';

export default function LearnPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const slug = params.slug as string;
  const { isAuthenticated } = useAuthStore();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/courses/${slug}/learn`);
    }
  }, [isAuthenticated, router, slug]);

  const { data: courseData, isLoading: courseLoading } = useQuery({
    queryKey: ['course', slug],
    queryFn: () => coursesApi.getCourseBySlug(slug),
    enabled: !!slug && isAuthenticated,
  });

  const { data: curriculumData, isLoading: curriculumLoading } = useQuery({
    queryKey: ['curriculum', slug],
    queryFn: () => coursesApi.getCourseCurriculum(slug),
    enabled: !!slug && isAuthenticated,
  });

  const completeMutation = useMutation({
    mutationFn: (lessonId: string) => coursesApi.markLessonComplete(slug, lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curriculum', slug] });
      queryClient.invalidateQueries({ queryKey: ['course', slug] });
    },
  });

  const course = courseData?.data?.course;
  const isEnrolled = courseData?.data?.isEnrolled;
  const modules = curriculumData?.data?.modules || [];
  const progress = curriculumData?.data?.progress;
  const completedLessons = new Set(progress?.completedLessons || []);

  // Get all lessons flattened
  const allLessons: { lesson: Lesson; moduleIndex: number; lessonIndex: number }[] = [];
  modules.forEach((module: Module, moduleIndex: number) => {
    module.lessons.forEach((lesson: Lesson, lessonIndex: number) => {
      allLessons.push({ lesson, moduleIndex, lessonIndex });
    });
  });

  // Set initial lesson
  useEffect(() => {
    if (allLessons.length > 0 && !currentLessonId) {
      // Find the first incomplete lesson or start from beginning
      const firstIncomplete = allLessons.find(({ lesson }) => !completedLessons.has(lesson._id));
      setCurrentLessonId(firstIncomplete?.lesson._id || allLessons[0].lesson._id);
    }
  }, [allLessons, currentLessonId, completedLessons]);

  const currentLessonData = allLessons.find(({ lesson }) => lesson._id === currentLessonId);
  const currentLesson = currentLessonData?.lesson;
  const currentIndex = allLessons.findIndex(({ lesson }) => lesson._id === currentLessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const handleMarkComplete = () => {
    if (currentLessonId && !completedLessons.has(currentLessonId)) {
      completeMutation.mutate(currentLessonId);
    }
    if (nextLesson) {
      setCurrentLessonId(nextLesson.lesson._id);
    }
  };

  if (courseLoading || curriculumLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isEnrolled) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900">Not Enrolled</h1>
        <p className="mt-2 text-gray-600">You need to enroll in this course to access the content.</p>
        <Link href={`/courses/${slug}`}>
          <Button className="mt-4">Go to Course Page</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 transform bg-white shadow-lg transition-transform duration-200 lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <Link href={`/courses/${slug}`} className="text-sm text-blue-600 hover:underline">
                <ChevronLeft className="mr-1 inline h-4 w-4" />
                Back to Course
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <h2 className="mt-2 font-semibold text-gray-900 line-clamp-2">{course?.title}</h2>
            <div className="mt-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>{completedLessons.size} / {allLessons.length} completed</span>
                <span>{Math.round((completedLessons.size / allLessons.length) * 100)}%</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-blue-600 transition-all"
                  style={{ width: `${(completedLessons.size / allLessons.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Modules & Lessons */}
          <div className="flex-1 overflow-y-auto p-4">
            {modules.map((module: Module, moduleIndex: number) => (
              <div key={module._id} className="mb-4">
                <h3 className="mb-2 text-sm font-medium text-gray-500">
                  Module {moduleIndex + 1}: {module.title}
                </h3>
                <div className="space-y-1">
                  {module.lessons.map((lesson: Lesson) => {
                    const isCompleted = completedLessons.has(lesson._id);
                    const isCurrent = lesson._id === currentLessonId;

                    return (
                      <button
                        key={lesson._id}
                        onClick={() => setCurrentLessonId(lesson._id)}
                        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                          isCurrent
                            ? 'bg-blue-50 text-blue-700'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
                        ) : (
                          <Circle className="h-4 w-4 shrink-0 text-gray-300" />
                        )}
                        {lesson.type === 'quiz' ? (
                          <HelpCircle className="h-4 w-4 shrink-0 text-purple-500" />
                        ) : (
                          <FileText className="h-4 w-4 shrink-0 text-blue-500" />
                        )}
                        <span className="line-clamp-1">{lesson.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Mobile Header */}
        <div className="sticky top-0 z-40 flex items-center gap-4 border-b bg-white p-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          <span className="font-medium text-gray-900 line-clamp-1">{currentLesson?.title}</span>
        </div>

        {/* Lesson Content */}
        <div className="mx-auto max-w-4xl p-6 lg:p-12">
          {currentLesson ? (
            <>
              <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                {currentLesson.type === 'quiz' ? (
                  <HelpCircle className="h-4 w-4 text-purple-500" />
                ) : (
                  <FileText className="h-4 w-4 text-blue-500" />
                )}
                <span className="capitalize">{currentLesson.type}</span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900">{currentLesson.title}</h1>

              {/* Article Content */}
              {currentLesson.type === 'article' && (
                <div className="prose prose-gray mt-8 max-w-none">
                  {currentLesson.content?.articleContent ? (
                    <div dangerouslySetInnerHTML={{ __html: currentLesson.content.articleContent }} />
                  ) : (
                    <div className="rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
                      <FileText className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-4 text-gray-500">
                        Article content will be displayed here.
                      </p>
                      <p className="mt-2 text-sm text-gray-400">
                        Content for this lesson is being prepared.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Quiz Content */}
              {currentLesson.type === 'quiz' && (
                <div className="mt-8">
                  <QuizPlayer
                    lessonId={currentLesson._id}
                    onComplete={handleMarkComplete}
                  />
                </div>
              )}

              {/* Resources */}
              {currentLesson.content?.resources && currentLesson.content.resources.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900">Resources</h3>
                  <ul className="mt-4 space-y-2">
                    {currentLesson.content.resources.map((resource, index) => (
                      <li key={index}>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {resource.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Navigation */}
              <div className="mt-12 flex items-center justify-between border-t pt-6">
                {prevLesson ? (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentLessonId(prevLesson.lesson._id)}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                ) : (
                  <div />
                )}

                <Button
                  onClick={handleMarkComplete}
                  disabled={completeMutation.isPending}
                >
                  {completeMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : completedLessons.has(currentLessonId!) ? (
                    nextLesson ? 'Next Lesson' : 'Completed!'
                  ) : (
                    'Mark Complete & Continue'
                  )}
                  {nextLesson && <ChevronRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </>
          ) : (
            <div className="flex min-h-[400px] items-center justify-center">
              <p className="text-gray-500">Select a lesson to begin</p>
            </div>
          )}
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
