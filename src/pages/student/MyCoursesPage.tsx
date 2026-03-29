import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Play, Clock } from 'lucide-react';
import { useMyPurchasedCourses } from '../../features/course/useCourse';
import { CourseCardSkeleton } from '../../components/ui/SkeletonLoader';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { buildCourseDetailRoute } from '../../utils/formatters';

export default function MyCoursesPage() {
  const { data: courses, isLoading } = useMyPurchasedCourses();
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <GraduationCap className="w-6 h-6 text-indigo-400" />
        <h1 className="text-2xl font-bold text-white">My Learning</h1>
        {courses && <span className="text-sm text-slate-400">({courses.length} courses)</span>}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => <CourseCardSkeleton key={i} />)}
        </div>
      ) : !courses?.length ? (
        <EmptyState
          icon={<GraduationCap className="w-10 h-10" />}
          title="No courses yet"
          description="Purchase a course to start your learning journey."
          action={
            <Button onClick={() => navigate('/courses')}>Browse Courses</Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-slate-800/40 border border-slate-700/40 rounded-2xl overflow-hidden hover:border-slate-600/60 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-40">
                <img
                  src={course.thumbnail || `https://picsum.photos/seed/${course.id}/400/250`}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  {/* Progress bar placeholder */}
                  <div className="h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-1/3 rounded-full" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2">{course.title}</h3>
                <p className="text-xs text-slate-400 mb-3">{course.tutor?.name || 'Unknown Instructor'}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    {course.duration}
                  </div>
                  <Button
                    size="sm"
                    leftIcon={<Play className="w-3.5 h-3.5" />}
                    onClick={() => navigate(buildCourseDetailRoute(course.id || course._id || ''))}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}