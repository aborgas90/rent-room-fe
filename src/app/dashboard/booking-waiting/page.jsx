// app/dashboard/booking-waiting/page.jsx
"use client";

import BookingWaitingPage from "@/app/components/master/dashboard/booking-waiting/BookingWaitingPage";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingWaitingPage />
    </Suspense>
  );
}
