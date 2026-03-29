import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search, Filter, Star, Clock, Users, ShoppingCart, TrendingUp, Zap,
} from 'lucide-react';
import { useCourses } from '../../features/course/useCourse';
import { cartApi } from '../../features/cart/cartApi';
import { useCartStore } from '../../features/cart/cartStore';
import { CourseCardSkeleton } from '../../components/ui/SkeletonLoader';
import { EmptyState } from '../../components/ui/EmptyState';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { toastService } from '../../hooks/useToast';
import { COURSE_LEVELS } from '../../constants';
import { formatCurrency, formatStudentCount, buildCourseDetailRoute, truncateText } from '../../utils/formatters';
import { Course } from '../../types';

const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  const { addItem, items } = useCartStore();
  const navigate = useNavigate();
  const courseId = course.id || course._id;
  const isInCart = items.some((i) => i.courseId === courseId);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInCart) { navigate('/cart'); return; }
    setAdding(true);
    try {
      if (!courseId) return;
      const cart = await cartApi.addToCart(courseId);
      addItem({ courseId, course, addedAt: new Date().toISOString() });
      toastService.success('Added to cart!');
    } catch {
      toastService.error('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div
      className="group bg-slate-800/40 backdrop-blur-sm border border-slate-700/40 rounded-2xl overflow-hidden hover:border-slate-600/60 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer"
      onClick={() => navigate(buildCourseDetailRoute(courseId))}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden h-48">
        <img
          src={course.thumbnail || `https://picsum.photos/seed/${course._id || course.id}/400/250`}
          alt={course.name || course.title || 'Course'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <Badge variant="purple">{course.level || 'Beginner'}</Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-white text-sm leading-tight mb-1.5 group-hover:text-indigo-300 transition-colors">
          {truncateText(course.name || course.title, 60)}
        </h3>
        <p className="text-xs text-slate-400 mb-3">{course.tutor?.name || 'Unknown Instructor'}</p>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-amber-300 font-semibold">{(course.rating || 0).toFixed(1)}</span>
            {course.ratingCount && <span>({course.ratingCount})</span>}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            {formatStudentCount(course.studentsEnrolled || 0)}
          </span>
          {course.duration && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {course.duration}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-700/40">
          <span className="text-lg font-bold text-white">
            {formatCurrency(course.price)}
          </span>
          <Button
            size="sm"
            variant={isInCart ? 'outline' : 'primary'}
            leftIcon={<ShoppingCart className="w-3.5 h-3.5" />}
            isLoading={adding}
            onClick={handleAddToCart}
          >
            {isInCart ? 'In Cart' : 'Add'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [level, setLevel] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useCourses({
    search: search || undefined,
    level: level || undefined,
    page,
    limit: 12,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900/60 via-purple-900/60 to-pink-900/40 border border-slate-700/40 p-8 lg:p-12">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px]" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-purple-500/20 rounded-full blur-[80px]" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
              10,000+ Courses Available
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
            Unlock Your Potential with
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"> Expert-Led Courses</span>
          </h1>
          <p className="text-slate-300 text-sm lg:text-base mb-6">
            Learn from industry professionals and advance your career at your own pace.
          </p>

          {/* Search form */}
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="What do you want to learn?"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900/60 backdrop-blur-sm border border-slate-600/50 text-white placeholder-slate-400 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500/60 transition-all"
              />
            </div>
            <Button type="submit" size="md">
              Search
            </Button>
          </form>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Filter className="w-4 h-4" />
          <span>Filter:</span>
        </div>
        <select
          value={level}
          onChange={(e) => { setLevel(e.target.value); setPage(1); }}
          className="bg-slate-800/60 border border-slate-700/50 text-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500/60 transition-all"
        >
          <option value="">All Levels</option>
          {COURSE_LEVELS.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        {(search || level) && (
          <button
            onClick={() => { setSearch(''); setLevel(''); setPage(1); }}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Stats row */}
      {data && (
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <TrendingUp className="w-4 h-4" />
          <span>Showing <span className="text-white font-semibold">{data.total}</span> courses</span>
        </div>
      )}

      {/* Course grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          title="Failed to load courses"
          description="Something went wrong. Please try refreshing the page."
        />
      ) : !data?.data?.length ? (
        <EmptyState
          icon={<Search className="w-8 h-8" />}
          title="No courses found"
          description="Try adjusting your search or filters to find what you're looking for."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {data.data.map((course) => (
            <CourseCard key={course._id || course.id} course={course} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-slate-400">
            Page {page} of {data.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === data.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}