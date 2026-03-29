// src/pages/student/SuccessPage.tsx

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from "react-router-dom";
import { paymentApi } from "../../features/payment/paymentApi";
import { cartApi } from "../../features/cart/cartApi";
import { orderApi } from "../../features/order/orderApi";
import { toastService } from "../../hooks/useToast";
import { QUERY_KEYS } from '../../constants';

export default function SuccessPage() {
  const navigate = useNavigate();

  const { data: cart } = useQuery({
    queryKey: [QUERY_KEYS.CART],
    queryFn: cartApi.getCart,
  });

  useEffect(() => {
    if (!cart) return; // ✅ WAIT

    const sessionId = new URLSearchParams(window.location.search).get("session_id");

    if (!sessionId) {
      toastService.error("Invalid payment");
      navigate("/cart");
      return;
    }

    const verify = async () => {
      try {
        await paymentApi.verifyPayment(sessionId);

        await orderApi.createOrder(
          cart.items.map(i => i.courseId),
          cart.total
        );

        toastService.success("Payment successful 🎉");
        navigate("/my-courses");
      } catch (error) {
        toastService.error("Payment verification failed");
        navigate("/cart");
      }
    };

    verify();
  }, [cart]); // ✅ ADD DEPENDENCY

  return <h1 className="text-white text-center mt-10">Processing Payment...</h1>;
}