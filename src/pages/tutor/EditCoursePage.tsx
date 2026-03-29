import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BookOpen, ChevronLeft, X, Plus, Upload } from 'lucide-react';
import { useCourseDetail, useUpdateCourse } from '../../features/course/useCourse';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/SkeletonLoader';
import { toastService } from '../../hooks/useToast';
import { COURSE_LEVELS } from '../../constants';

export default function EditCoursePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: course, isLoading } = useCourseDetail(id!);
  const { mutate: updateCourse, isPending } = useUpdateCourse();
  const [tagInput, setTagInput] = useState('');
  const [video, setVideo] = useState<File | null>(null);
  const [videoName, setVideoName] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: 0,
    category: '',
    level: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    duration: '',
    tags: [] as string[],
  });

  useEffect(() => {
    if (course) {
      setForm({
        title: course.name || course.title,
        description: course.description,
        price: course.price,

        level: course.level || 'Beginner',
        duration: course.duration || '',
        tags: course.tags || [],
      });
    }
  }, [course]);

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm({ ...form, tags: [...form.tags, tag] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });

  const handleVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate video file size (max 500MB)
      if (file.size > 500 * 1024 * 1024) {
        toastService.error('Video file must be less than 500MB');
        return;
      }
      setVideo(file);
      setVideoName(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (key === 'tags') {
        (val as string[]).forEach((t) => fd.append('tags[]', t));
      } else {
        fd.append(key, String(val));
      }
    });
    if (video) fd.append('video', video);

    updateCourse({ id: id!, formData: fd }, {
      onSuccess: () => {
        toastService.success('Course updated successfully!');
        navigate('/tutor/dashboard');
      },
      onError: () => toastService.error('Failed to update course'),
    });
  };

  const inputClass =
    'w-full bg-slate-800/60 border border-slate-700/50 text-slate-200 placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500/60 focus:bg-slate-800 transition-all';

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6">
        <ChevronLeft className="w-4 h-4" />Back to Dashboard
      </button>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Course</h1>
          <p className="text-sm text-slate-400">Update your course details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Course Title *</label>
          <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
        </div>

        {/* Video */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Course Video
          </label>
          <label className="relative flex items-center justify-center h-40 border-2 border-dashed border-slate-700/60 rounded-2xl cursor-pointer hover:border-purple-500/50 transition-all overflow-hidden">
            {videoName ? (
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-2">
                  <Upload className="w-6 h-6 text-purple-400" />
                </div>
                <p className="text-sm text-white font-medium truncate px-4">{videoName}</p>
                <p className="text-xs text-slate-400 mt-1">Click to change</p>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-sm text-slate-400">Click to upload new video (optional)</p>
                <p className="text-xs text-slate-600 mt-1">MP4, WebM up to 500MB</p>
              </div>
            )}
            <input type="file" accept="video/*" onChange={handleVideo} className="sr-only" />
          </label>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description *</label>
          <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputClass} resize-none`} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Price ($) *</label>
            <input type="number" required min={0} step={0.01} value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} className={inputClass} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Duration *</label>
            <input type="text" required value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Level *</label>
            <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value as any })} className={inputClass}>
              {COURSE_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tags</label>
          <div className="flex gap-2">
            <input type="text" placeholder="Add a tag..." value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} className={`${inputClass} flex-1`} />
            <Button type="button" variant="outline" size="md" leftIcon={<Plus className="w-4 h-4" />} onClick={addTag}>Add</Button>
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {form.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-xs text-indigo-300">
                  {tag}<button type="button" onClick={() => removeTag(tag)}><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" isLoading={isPending} size="lg">Save Changes</Button>
          <Button type="button" variant="ghost" size="lg" onClick={() => navigate(-1)}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}