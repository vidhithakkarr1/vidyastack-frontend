import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowRight, Tag } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '../../features/cart/cartApi';
import { paymentApi } from '../../features/payment/paymentApi';
import { useCartStore } from '../../features/cart/cartStore';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/SkeletonLoader';
import { toastService } from '../../hooks/useToast';
import { formatCurrency } from '../../utils/formatters';
import { QUERY_KEYS, STRIPE_PUBLISHABLE_KEY } from '../../constants';
import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export default function CartPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { removeItem } = useCartStore();
  const [checkingOut, setCheckingOut] = useState(false);

  const { data: cart, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.CART],
    queryFn: cartApi.getCart,
  });

  const handleRemove = async (courseId: string) => {
    try {
      await cartApi.removeFromCart(courseId);
      removeItem(courseId);
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.CART] });
      toastService.success('Removed from cart');
    } catch {
      toastService.error('Failed to remove item');
    }
  };

  const handleCheckout = async () => {
    if (!cart?.items.length) return;
    setCheckingOut(true);
    try {
      const { sessionId } = await paymentApi.createCheckoutSession(
        cart.items.map((i) => i.courseId)
      );
      clearItems(); // Clear cart after creating checkout session
      const stripe = await stripePromise;
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch {
      toastService.error('Checkout failed. Please try again.');
    } finally {
      setCheckingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-8 w-40" />
        {[1, 2].map((i) => <Skeleton key={i} className="h-28 w-full rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingCart className="w-6 h-6 text-indigo-400" />
        <h1 className="text-2xl font-bold text-white">Shopping Cart</h1>
        <span className="text-sm text-slate-400">({cart?.items.length || 0} items)</span>
      </div>

      {!cart?.items.length ? (
        <EmptyState
          icon={<ShoppingCart className="w-10 h-10" />}
          title="Your cart is empty"
          description="Browse our courses and add something you'd like to learn."
          action={
            <Button onClick={() => navigate('/')} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Browse Courses
            </Button>
          }
        />
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-3">
            {cart.items.map(({ courseId, course }) => (
              <div
                key={courseId}
                className="flex gap-4 bg-slate-800/40 border border-slate-700/40 rounded-2xl p-4 hover:border-slate-600/50 transition-all"
              >
                <img
                  src={course.thumbnail || `https://picsum.photos/seed/${courseId}/120/80`}
                  alt={course.name}
                  className="w-24 h-16 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm truncate">{course.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{course.instructor?.name || 'Unknown Instructor'}</p>
                  <p className="text-sm font-bold text-white mt-2">{formatCurrency(course.price)}</p>
                </div>
                <button
                  onClick={() => handleRemove(courseId)}
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4">Order Summary</h3>
              <div className="space-y-2.5 mb-4 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span>{formatCurrency(cart.total)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Discount</span>
                  <span className="text-emerald-400">-$0.00</span>
                </div>
                <div className="flex justify-between font-bold text-white text-base pt-2 border-t border-slate-700/50">
                  <span>Total</span>
                  <span>{formatCurrency(cart.total)}</span>
                </div>
              </div>
              <Button fullWidth size="lg" isLoading={checkingOut} onClick={handleCheckout} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Proceed to Checkout
              </Button>
              <p className="text-xs text-slate-500 text-center mt-3">
                Powered by Stripe · 100% Secure
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}