import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useCartStore } from '../../features/cart/cartStore';

export default function CheckoutSuccessPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { clearItems } = useCartStore();

  useEffect(() => {
    clearItems();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Payment Successful!</h1>
        <p className="text-slate-400 mb-8">
          Your courses are now available in your learning dashboard. Start learning immediately!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => navigate('/my-courses')} rightIcon={<ArrowRight className="w-4 h-4" />}>
            Go to My Courses
          </Button>
          <Button variant="outline" onClick={() => navigate('/courses')}>
            Browse More
          </Button>
        </div>
      </div>
    </div>
  );
}