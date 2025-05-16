import BookingApprovedPaymentPage from "@/app/components/master/dashboard/pembayaran-approve/PembayaranApprove";
import React, { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingApprovedPaymentPage />
    </Suspense>
  );
}
