"use client";

import React, { Suspense } from "react";
import ResetPasswordPage from "../components/master/reset-password/ResetPassword";

const ForgotPasswordPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  );
};

export default ForgotPasswordPage;
