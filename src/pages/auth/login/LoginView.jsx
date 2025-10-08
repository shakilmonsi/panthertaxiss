// src/pages/auth/login/LoginView.jsx
import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import instance from "../../../utils/axiosInstance";
import { AuthContext } from "../../../featured/auth/AuthContext";
import toast, { Toaster } from "react-hot-toast";

const LoginView = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [step, setStep] = useState(0);

  const navigate = useNavigate();
  const { login: authLogin, user, loading } = useContext(AuthContext);

  useEffect(() => {
    if (!loading && user) {
      const userRole = user?.role?.toUpperCase();
      if (userRole === "ADMIN") {
        navigate("/admin", { replace: true });
      } else if (userRole === "USER") {
        navigate("/user-dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [user, loading, navigate]);

  // ================code by shakil munshi ==============
  // only handleLoginSubmit function
  // =======================================================

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();

    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }

    const loginToastId = toast.loading("Logging in...");

    try {
      const res = await authLogin(email, password);

      toast.dismiss(loginToastId);

      if (res.success) {
        toast.success("Login successful! Redirecting...");
        setEmail("");
        setPassword("");

        // ================code by shakil munshi ==============
        // ✅ Login successful to redirect
        // =======================================================
        const userRole = res.user?.role?.toUpperCase();
        if (userRole === "ADMIN") {
          navigate("/admin", { replace: true });
        } else if (userRole === "USER") {
          navigate("/user-dashboard", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } else {
        toast.error(
          res.message || "Login failed. Please check your credentials.",
        );
      }
    } catch (err) {
      toast.dismiss(loginToastId);
      const message =
        err.response?.data?.message ||
        "An unexpected error occurred during login.";
      toast.error(message);
    }
  };

  // ================code by shakil munshi ==============
  //  Other funtion
  // =======================================================
  const handleSendCode = async (e) => {
    e.preventDefault();
    toast.dismiss();

    if (!forgotPasswordEmail || !/\S+@\S+\.\S+/.test(forgotPasswordEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const sendCodeToastId = toast.loading("Sending reset code...");

    try {
      const res = await instance.post("/auth/send-code", {
        email: forgotPasswordEmail,
      });
      toast.dismiss(sendCodeToastId);
      if (res.data.success) {
        toast.success(
          res.data.message || "Reset code sent successfully! Check your email.",
        );
        setStep(2);
      } else {
        toast.error(res.data.message || "Error sending reset code.");
      }
    } catch (err) {
      toast.dismiss(sendCodeToastId);
      const message = err.response?.data?.message || "Error sending code.";
      toast.error(message);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    toast.dismiss();

    if (!code || code.length !== 6 || !/^\d{6}$/.test(code)) {
      toast.error("Please enter a valid 6-digit code.");
      return;
    }

    const verifyCodeToastId = toast.loading("Verifying code...");

    try {
      const res = await instance.post("/auth/verify-email", {
        email: forgotPasswordEmail,
        code,
      });
      toast.dismiss(verifyCodeToastId);
      if (res.data.success) {
        toast.success(res.data.message || "Code verified successfully!");
        setStep(3);
      } else {
        toast.error(res.data.message || "Error verifying code.");
      }
    } catch (err) {
      toast.dismiss(verifyCodeToastId);
      const message = err.response?.data?.message || "Error verifying code.";
      toast.error(message);
    }
  };

  const handleResendCode = async () => {
    toast.dismiss();
    const resendCodeToastId = toast.loading("Resending code...");

    try {
      const res = await instance.post("/auth/resend-code", {
        email: forgotPasswordEmail,
      });
      toast.dismiss(resendCodeToastId);
      if (res.data.success) {
        toast.success(
          res.data.message || "New verification code sent successfully!",
        );
      } else {
        toast.error(res.data.message || "Error resending code.");
      }
    } catch (err) {
      toast.dismiss(resendCodeToastId);
      const message = err.response?.data?.message || "Error resending code.";
      toast.error(message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    toast.dismiss();

    if (!newPassword || !confirmNewPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const resetPasswordToastId = toast.loading("Updating password...");

    try {
      const res = await instance.put("/auth/reset-password", {
        email: forgotPasswordEmail,
        newPassword,
      });
      toast.dismiss(resetPasswordToastId);
      if (res.data.success) {
        toast.success(
          res.data.message ||
            "Password updated successfully! You can now login.",
        );
        setStep(0);
        setForgotPasswordEmail("");
        setCode("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        toast.error(res.data.message || "Error resetting password.");
      }
    } catch (err) {
      toast.dismiss(resetPasswordToastId);
      const message =
        err.response?.data?.message || "Error resetting password.";
      toast.error(message);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
          <div className="text-xl font-semibold text-gray-700">
            Loading user data...
          </div>
        </div>
      );
    }

    switch (step) {
      case 1:
        return (
          <div className="p-8">
            <div className="mb-8 text-center sm:mb-12 md:mb-16">
              <h1 className="text-[32px] font-semibold text-[#221122]">
                Forgot Password
              </h1>
              <p className="mt-2 mb-4 text-center text-gray-600">
                Please enter your email to reset the password.
              </p>
            </div>
            <form onSubmit={handleSendCode} className="flex flex-col gap-4">
              <div className="mb-1">
                <label
                  htmlFor="forgot-email"
                  className="text-base font-normal text-gray-700"
                >
                  Email Address*
                </label>
                <input
                  type="email"
                  id="forgot-email"
                  placeholder="Your email address"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-center text-neutral-700 focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="h-10 w-full rounded-lg bg-blue-500 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Code"}
              </button>
              <button
                type="button"
                onClick={() => setStep(0)}
                className="mt-1 text-sm font-bold text-blue-500 hover:underline"
              >
                Back to Login
              </button>
            </form>
          </div>
        );
      case 2:
        return (
          <div className="p-8">
            <div className="mb-8 text-center sm:mb-12 md:mb-16">
              <h1 className="text-[32px] font-semibold text-[#221122]">
                Check your email
              </h1>
              <p className="mt-2 mb-4 text-center text-gray-600">
                We sent a 6-digit code to **{forgotPasswordEmail}**
              </p>
            </div>
            <form onSubmit={handleVerifyCode} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="verify-code"
                  className="text-base font-normal text-gray-700"
                >
                  Verification Code*
                </label>
                <input
                  type="text"
                  id="verify-code"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-center text-neutral-700 focus:outline-none"
                  maxLength="6"
                  required
                />
              </div>
              <button
                type="submit"
                className="h-10 w-full rounded-lg bg-blue-500 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
              <p className="mt-2 text-center text-sm text-gray-600">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="font-semibold text-blue-500 hover:underline"
                  disabled={loading}
                >
                  Resend email
                </button>
              </p>
            </form>
          </div>
        );
      case 3:
        return (
          <div className="p-8">
            <div className="mb-8 text-center sm:mb-12 md:mb-16">
              <h1 className="text-[32px] font-semibold text-[#221122]">
                Set a new password
              </h1>
              <p className="mt-2 mb-4 text-center text-gray-600">
                Create a new password for your account.
              </p>
            </div>
            <form
              onSubmit={handleResetPassword}
              className="flex flex-col gap-4"
            >
              <div>
                <label
                  htmlFor="new-password"
                  className="text-base font-normal text-gray-700"
                >
                  New Password*
                </label>
                <input
                  type="password"
                  id="new-password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-center text-neutral-700 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="text-base font-normal text-gray-700"
                >
                  Confirm Password*
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  placeholder="Confirm New Password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-center text-neutral-700 focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="mt-1 h-10 w-full rounded-lg bg-blue-500 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        );
      default:
        return (
          <>
            <div className="mb-8 flex items-center justify-center sm:mb-12 md:mb-16">
              <h1 className="text-[32px] font-semibold text-[#221122]">
                Welcome Back
              </h1>
            </div>
            <form
              onSubmit={handleLoginSubmit}
              className="flex w-full flex-col gap-6"
            >
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-base font-normal text-gray-700"
                  htmlFor="email"
                >
                  Email Address*
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 shadow-sm">
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-base font-normal text-gray-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-base font-normal text-gray-700"
                  htmlFor="password"
                >
                  Password*
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 shadow-sm">
                  <input
                    id="password"
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-base font-normal text-gray-500 placeholder-gray-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm font-semibold text-neutral-600"
                  >
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm font-semibold text-blue-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <button
                type="submit"
                className="flex w-full items-center justify-center rounded-lg bg-blue-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></div>
                ) : (
                  "Log In"
                )}
              </button>
            </form>
            <p className="mt-3 flex items-center justify-center pt-2 text-sm font-semibold text-neutral-600 md:mt-4">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="px-1 text-blue-600 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </>
        );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50 p-4 font-['Roboto'] sm:p-6 lg:p-8">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full max-w-lg p-6 md:p-10">{renderContent()}</div>
    </div>
  );
};

export default LoginView;
