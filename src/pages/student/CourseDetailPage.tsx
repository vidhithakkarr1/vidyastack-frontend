import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Star, Clock, Users, Globe, ShoppingCart, Play, BookOpen, Award,
  ChevronLeft, Loader2, Check,
} from 'lucide-react';
import { useCourseDetail, useRateCourse } from '../../features/course/useCourse';
import { cartApi } from '../../features/cart/cartApi';
import { useCartStore } from '../../features/cart/cartStore';
import { useAuthStore } from '../../features/auth/authStore';
import { useLogout } from '../../features/auth/useAuth';
import { Button } from '../../components/ui/Button';
import { Badge, StatusBadge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/SkeletonLoader';
import { Modal } from '../../components/ui/Modal';
import { toastService } from '../../hooks/useToast';
import { formatCurrency, formatDate, formatStudentCount } from '../../utils/formatters';

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: course, isLoading } = useCourseDetail(id!);
  const { mutate: rateCourse, isPending: rating } = useRateCourse();
  const { addItem, items } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const { logout } = useLogout();
  const [adding, setAdding] = useState(false);
  const [ratingModal, setRatingModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [review, setReview] = useState('');

  const isInCart = items.some((i) => i.courseId === id);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }
    if (isInCart) { navigate('/cart'); return; }
    setAdding(true);
    try {
      await cartApi.addToCart(id!);
      if (course) addItem({ courseId: id!, course, addedAt: new Date().toISOString() });
      toastService.success('Added to cart!');
    } catch {
      toastService.error('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  const handleSubmitRating = () => {
    if (!selectedRating) { toastService.warning('Please select a rating'); return; }
    rateCourse({ courseId: id!, rating: selectedRating, review }, {
      onSuccess: () => { toastService.success('Rating submitted!'); setRatingModal(false); },
      onError: () => toastService.error('Failed to submit rating'),
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-8">
        <Skeleton className="h-10 w-32" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to courses
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thumbnail */}
          <div className="relative rounded-2xl overflow-hidden h-80 bg-slate-800">
            <img
              src={`https://picsum.photos/seed/${course._id || course.id}/800/450`}
              alt={course.name || course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            {/* <div className="absolute bottom-4 left-4 flex gap-2">
              <Badge variant="purple">Level</Badge>
              <Badge variant="default">Category</Badge>
            </div> */}
          </div>

          {/* Title & meta */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{course.name || course.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-4">
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-amber-300 font-bold">{course.rating.toFixed(1)}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                {formatStudentCount(course.studentsEnrolled)} students
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">{course.description}</p>
          </div>

          {/* Instructor - Commented for now as instructor field is ID, not object */}
          {/* <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Your Instructor</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {course.instructor[0]}
              </div>
              <div>
                <p className="font-semibold text-white">{course.instructor}</p>
                <p className="text-xs text-slate-400">Course Instructor</p>
              </div>
            </div>
          </div> */}

          {/* Rate button */}
          <Button variant="outline" leftIcon={<Star className="w-4 h-4" />} onClick={() => setRatingModal(true)}>
            Rate this course
          </Button>
        </div>

        {/* Sidebar purchase card */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
            <div className="text-3xl font-bold text-white mb-1">{formatCurrency(course.price)}</div>
            <p className="text-xs text-slate-400 mb-5">One-time purchase · Lifetime access</p>

            <Button fullWidth size="lg" isLoading={adding} leftIcon={<ShoppingCart className="w-4 h-4" />} onClick={handleAddToCart}>
              {isInCart ? 'Go to Cart' : 'Add to Cart'}
            </Button>

            <div className="mt-6 space-y-3 text-sm text-slate-400">
              {[
                { icon: Globe, text: 'Full lifetime access' },
                // { icon: Play, text: `${course.duration} of content` },
                // { icon: BookOpen, text: `${course.level} level` },
                { icon: Award, text: 'Certificate of completion' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Rating Modal */}
      <Modal isOpen={ratingModal} onClose={() => setRatingModal(false)} title="Rate this Course">
        <div className="space-y-4">
          <div className="flex items-center gap-2 justify-center">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} onClick={() => setSelectedRating(s)}>
                <Star className={`w-8 h-8 transition-colors ${s <= selectedRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
              </button>
            ))}
          </div>
          <textarea
            placeholder="Write your review (optional)..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={3}
            className="w-full bg-slate-800/60 border border-slate-700/50 text-slate-200 placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500/60 resize-none"
          />
          <Button fullWidth isLoading={rating} onClick={handleSubmitRating}>
            Submit Rating
          </Button>
        </div>
      </Modal>
    </div>
  );
}