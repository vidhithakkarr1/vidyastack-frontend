import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function CheckoutCancelPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-red-500/20 border border-red-500/30 mb-6">
          <XCircle className="w-10 h-10 text-red-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Payment Cancelled</h1>
        <p className="text-slate-400 mb-8">
          Your payment was cancelled. No charges were made. Your cart items are still saved.
        </p>
        <Button onClick={() => navigate('/cart')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Return to Cart
        </Button>
      </div>
    </div>
  );
}