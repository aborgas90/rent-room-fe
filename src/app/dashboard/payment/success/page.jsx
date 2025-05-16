// app/dashboard/payment/success/page.jsx
import PaymentSuccessPage from "@/app/components/master/dashboard/payment-success/PaymentSuccess";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessPage />
    </Suspense>
  );
}
