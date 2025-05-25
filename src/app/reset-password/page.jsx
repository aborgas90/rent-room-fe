"use client";

import React, { Suspense } from "react";
import ForgotPasswordForm from "../components/master/reset-password/ResetPassword";

const ForgotPasswordPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPasswordForm />
    </Suspense>
  );
};

export default ForgotPasswordPage;
