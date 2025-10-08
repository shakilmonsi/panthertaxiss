// src/pages/auth/ForgotPasswordModal.jsx

import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../featured/auth/AuthContext";
import toast from "react-hot-toast";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: New Password

  const { sendCode, verifyEmail, resetPassword, resendCode, loading } =
    useContext(AuthContext);

  // Modal বন্ধ হলে সব স্টেট রিসেট করা হবে।
  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setCode("");
      setNewPassword("");
      setConfirmNewPassword("");
      setStep(1);
      toast.dismiss();
    }
  }, [isOpen]);

  // Handle backdrop click to close modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    toast.dismiss();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      const result = await sendCode(email);
      if (result.success) {
        toast.success(result.message || "Verification code sent successfully!");
        setStep(2); // কোড সফলভাবে পাঠানো হলে পরবর্তী ধাপে (ধাপ ২) যাবে।
      } else {
        toast.error(result.message || "Failed to send verification code.");
      }
    } catch (error) {
      console.error("Send code error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    toast.dismiss();

    if (!code || code.length !== 6 || !/^\d{6}$/.test(code)) {
      toast.error("Please enter a valid 6-digit code.");
      return;
    }

    try {
      const result = await verifyEmail(email, code);
      if (result.success) {
        toast.success(result.message || "Code verified successfully!");
        setStep(3); // কোড সঠিক হলে পরবর্তী ধাপে (ধাপ ৩) যাবে।
      } else {
        toast.error(result.message || "Invalid verification code.");
      }
    } catch (error) {
      console.error("Verify code error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const handleResendCode = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    toast.dismiss();

    try {
      const result = await resendCode(email);
      if (result.success) {
        toast.success(result.message || "New verification code sent!");
      } else {
        toast.error(result.message || "Failed to resend verification code.");
      }
    } catch (error) {
      console.error("Resend code error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    toast.dismiss();

    if (!newPassword || !confirmNewPassword) {
      toast.error("Please fill in both password fields.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    try {
      const result = await resetPassword(email, newPassword);
      if (result.success) {
        toast.success(result.message || "Password reset successfully!");
        onClose(); // পাসওয়ার্ড সফলভাবে রিসেট হলে মডাল বন্ধ হবে।
      } else {
        toast.error(result.message || "Failed to reset password.");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  // Go back to previous step
  const handleGoBack = () => {
    if (step === 2) {
      setStep(1);
      setCode("");
    } else if (step === 3) {
      setStep(2);
      setNewPassword("");
      setConfirmNewPassword("");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-sm rounded-lg border border-fuchsia-700 bg-gradient-to-br from-purple-800 to-black p-8 shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-3 right-3 text-2xl font-bold text-white transition-colors hover:text-gray-300"
        >
          &times;
        </button>

        {/* Back Button (for steps 2 and 3) */}
        {(step === 2 || step === 3) && (
          <button
            onClick={handleGoBack}
            type="button"
            className="absolute top-3 left-3 text-white transition-colors hover:text-gray-300"
          >
            ← Back
          </button>
        )}

        {/* Step 1: Email Input */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <h2 className="bg-gradient-to-b from-[#F5DEB3] to-[#DAA520] bg-clip-text text-center text-3xl font-[700] text-transparent md:text-4xl">
              Forgot Password
            </h2>
            <p className="mt-2 mb-4 text-center text-white">
              Please enter your email to reset the password.
            </p>

            <form onSubmit={handleSendCode} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="modal-email"
                  className="font-poppins text-sm font-normal text-white capitalize"
                >
                  Email Address*
                </label>
                <input
                  type="email"
                  id="modal-email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 h-10 w-full rounded-lg bg-white px-3 py-2 text-neutral-700 focus:ring-2 focus:ring-orange-300 focus:outline-none"
                  required
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                className="font-poppins h-10 w-full rounded-lg bg-gradient-to-b from-orange-200 to-yellow-500 text-sm font-medium text-black capitalize transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Code"}
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Code Verification */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <h2 className="bg-gradient-to-b from-[#F5DEB3] to-[#DAA520] bg-clip-text text-center text-3xl font-[700] text-transparent md:text-4xl">
              Check your email
            </h2>
            <p className="mt-2 mb-4 text-center text-white">
              We sent a 6-digit code to <strong>{email}</strong>. Please enter
              it below.
            </p>

            <form onSubmit={handleVerifyCode} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="modal-code"
                  className="font-poppins text-sm font-normal text-white capitalize"
                >
                  Verification Code*
                </label>
                <input
                  type="text"
                  id="modal-code"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className="mt-1 h-10 w-full rounded-lg bg-white px-3 py-2 text-center font-mono text-lg tracking-widest text-neutral-700 focus:ring-2 focus:ring-orange-300 focus:outline-none"
                  maxLength="6"
                  required
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                className="font-poppins h-10 w-full rounded-lg bg-gradient-to-b from-orange-200 to-yellow-500 text-sm font-medium text-black capitalize transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
            </form>

            <p className="mt-2 text-center text-sm text-white">
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={handleResendCode}
                className="font-semibold text-orange-300 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loading}
              >
                Resend email
              </button>
            </p>
          </div>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <h2 className="bg-gradient-to-b from-[#F5DEB3] to-[#DAA520] bg-clip-text text-center text-3xl font-[700] text-transparent md:text-4xl">
              Set a new password
            </h2>
            <p className="mt-2 mb-4 text-center text-white">
              Create a new password for your account.
            </p>

            <form
              onSubmit={handleResetPassword}
              className="flex flex-col gap-4"
            >
              <div>
                <label
                  htmlFor="new-password"
                  className="font-poppins text-sm font-normal text-white capitalize"
                >
                  New Password*
                </label>
                <input
                  type="password"
                  id="new-password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 h-10 w-full rounded-lg bg-white px-3 py-2 text-neutral-700 focus:ring-2 focus:ring-orange-300 focus:outline-none"
                  required
                  disabled={loading}
                  minLength="6"
                />
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="font-poppins text-sm font-normal text-white capitalize"
                >
                  Confirm Password*
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  placeholder="Confirm New Password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="mt-1 h-10 w-full rounded-lg bg-white px-3 py-2 text-neutral-700 focus:ring-2 focus:ring-orange-300 focus:outline-none"
                  required
                  disabled={loading}
                  minLength="6"
                />
              </div>
              <button
                type="submit"
                className="font-poppins h-10 w-full rounded-lg bg-gradient-to-b from-orange-200 to-yellow-500 text-sm font-medium text-black capitalize transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
