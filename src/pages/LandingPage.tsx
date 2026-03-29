import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Star, Users, Clock, TrendingUp, Zap, BookOpen,
  Award, Globe, CheckCircle, ArrowRight, Play, LogOut, ChevronDown
} from 'lucide-react';
import { useCourses } from '../features/course/useCourse';
import { useAuthStore } from '../features/auth/authStore';
import { useLogout } from '../features/auth/useAuth';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatCurrency, formatStudentCount, buildCourseDetailRoute, truncateText, getInitials } from '../utils/formatters';
import { COURSE_CATEGORIES } from '../constants';
import { useState } from 'react';

const FeaturedCourseCard: React.FC<{ course: any; onBuyClick: () => void }> = ({ course, onBuyClick }) => {
  const navigate = useNavigate();

  return (
    <div
      className="group bg-slate-800/40 backdrop-blur-sm border border-slate-700/40 rounded-2xl overflow-hidden hover:border-slate-600/60 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer"
      onClick={() => navigate(buildCourseDetailRoute(course.id))}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden h-48">
        <img
          src={course.thumbnail || `https://picsum.photos/seed/${course.id}/400/250`}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <Badge variant="purple">{course.level}</Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant="default">{course.category}</Badge>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Play className="w-6 h-6 text-white ml-1" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-white text-sm leading-tight mb-1.5 group-hover:text-indigo-300 transition-colors">
          {truncateText(course.title, 60)}
        </h3>
        <p className="text-xs text-slate-400 mb-3">{course.tutor.name}</p>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-amber-300 font-semibold">{course.rating.toFixed(1)}</span>
            <span>({course.ratingCount})</span>
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            {formatStudentCount(course.studentsEnrolled)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            {course.duration}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-700/40">
          <span className="text-lg font-bold text-white">
            {formatCurrency(course.price)}
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => navigate(buildCourseDetailRoute(course.id))}>
              View Details
            </Button>
            <Button size="sm" onClick={onBuyClick}>
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CategoryCard: React.FC<{ category: typeof COURSE_CATEGORIES[number]; count: number }> = ({ category, count }) => {
  const navigate = useNavigate();

  return (
    <div
      className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/40 rounded-xl p-6 hover:border-slate-600/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/courses?category=${encodeURIComponent(category)}`)}
    >
      <div className="flex items-center justify-between mb-3">
        <BookOpen className="w-8 h-8 text-indigo-400" />
        <span className="text-xs text-slate-400">{count} courses</span>
      </div>
      <h3 className="font-semibold text-white text-sm mb-2">{category}</h3>
      <p className="text-xs text-slate-400">Learn from industry experts</p>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; value: string; label: string }> = ({ icon, value, label }) => (
  <div className="text-center">
    <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
      {icon}
    </div>
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    <div className="text-sm text-slate-400">{label}</div>
  </div>
);

export default function LandingPage() {
  const navigate = useNavigate();
  const { data: featuredCourses } = useCourses({ limit: 8 });
  const { user, hasHydrated, isAuthenticated } = useAuthStore();
  const { logout } = useLogout();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleGetStarted = () => {
    if (isAuthenticated) navigate('/dashboard');
    else navigate('/register');
  };

  const handleBrowseCourses = () => {
    navigate('/courses');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="relative z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                LearningHub
              </h1>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#courses" className="text-slate-300 hover:text-white transition-colors">Courses</a>
              <a href="#categories" className="text-slate-300 hover:text-white transition-colors">Categories</a>
              <a href="#about" className="text-slate-300 hover:text-white transition-colors">About</a>
            </nav>

            <div className="flex items-center space-x-4">
              {hasHydrated && isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                      {getInitials(user.name)}
                    </div>
                    <span className="text-sm text-slate-300">{user.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl z-50 overflow-hidden">
                        <div className="p-4 border-b border-slate-700/50">
                          <p className="text-sm font-semibold text-white">{user.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
                        </div>
                        <div className="p-2">
                          <button
                            onClick={() => { logout(); setProfileOpen(false); }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : hasHydrated ? (
                <>
                  <Button variant="ghost" size="sm" onClick={handleLogin}>
                    Sign In
                  </Button>
                  <Button size="sm" onClick={handleRegister}>
                    Sign Up
                  </Button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800/50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]" />
          <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Zap className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-semibold text-amber-300 uppercase tracking-wider">
                Join 10,000+ Learners Worldwide
              </span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Unlock Your Potential with
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block">
                Expert-Led Courses
              </span>
            </h1>

            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Learn from industry professionals and advance your career at your own pace.
              Access thousands of courses in technology, business, design, and more.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" onClick={handleGetStarted} className="px-8">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" onClick={handleBrowseCourses}>
                Browse Courses
              </Button>
            </div>

            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="What do you want to learn?"
                  onClick={() => navigate('/courses')}
                  className="w-full bg-slate-800/60 backdrop-blur-sm border border-slate-600/50 text-white placeholder-slate-400 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-indigo-500/60 transition-all cursor-pointer"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-900/50 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard
              icon={<Users className="w-6 h-6 text-indigo-400" />}
              value="10,000+"
              label="Active Learners"
            />
            <StatCard
              icon={<BookOpen className="w-6 h-6 text-purple-400" />}
              value="500+"
              label="Expert Courses"
            />
            <StatCard
              icon={<Award className="w-6 h-6 text-pink-400" />}
              value="50+"
              label="Expert Instructors"
            />
            <StatCard
              icon={<Globe className="w-6 h-6 text-green-400" />}
              value="25+"
              label="Countries"
            />
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section id="courses" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Featured Courses
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Start your learning journey with our most popular and highly-rated courses
            </p>
          </div>

          {featuredCourses?.data?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {featuredCourses.data.slice(0, 8).map((course: any) => (
                <FeaturedCourseCard key={course.id} course={course} onBuyClick={handleRegister} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-slate-400">Loading featured courses...</p>
            </div>
          )}

          <div className="text-center">
            <Button size="lg" variant="outline" onClick={handleBrowseCourses}>
              View All Courses
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-20 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Explore Categories
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Discover courses in your area of interest and advance your skills
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {COURSE_CATEGORIES.slice(0, 10).map((category: typeof COURSE_CATEGORIES[number]) => (
              <CategoryCard
                key={category}
                category={category}
                count={Math.floor(Math.random() * 50) + 10} // Mock count
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Why Choose LearningHub?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Join thousands of learners who trust us for their professional development
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Expert Instructors</h3>
              <p className="text-slate-400">
                Learn from industry professionals with years of real-world experience
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Lifetime Access</h3>
              <p className="text-slate-400">
                Get lifetime access to course materials and future updates
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Career Advancement</h3>
              <p className="text-slate-400">
                Gain skills that employers value and advance your career
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-900/60 via-purple-900/60 to-pink-900/40">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-lg text-slate-300 mb-8">
            Join our community of learners and unlock your potential today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleGetStarted} className="px-8">
              Create Free Account
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
              Sign In
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}