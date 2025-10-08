import { useState } from "react";
import { Link } from "react-router-dom";

export const ForgotPasswordFlow = () => {
  const [step, setStep] = useState(1); // Step 1 = ForgotPassword

  // Step 1: Forgot Password
  const handleForgotPassword = (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    // console.log("Email entered:", email);
    setStep(2); // Move to CheckYourEmail
  };

  // Step 2: Verify OTP
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = [];

  const handleKeyDown = (e) => {
    if (
      !/^[0-9]{1}$/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "Tab" &&
      !e.metaKey
    ) {
      e.preventDefault();
    }

    if (e.key === "Delete" || e.key === "Backspace") {
      const index = inputRefs.indexOf(e.target);
      if (index > 0) {
        setOtp((prev) => [
          ...prev.slice(0, index - 1),
          "",
          ...prev.slice(index),
        ]);
        inputRefs[index - 1].focus();
      }
    }
  };

  const handleInput = (e) => {
    const { target } = e;
    const index = inputRefs.indexOf(target);
    if (target.value) {
      setOtp((prev) => [
        ...prev.slice(0, index),
        target.value,
        ...prev.slice(index + 1),
      ]);
      if (index < otp.length - 1) {
        inputRefs[index + 1].focus();
      }
    }
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    if (!/^[0-9]{6}$/.test(text)) return;
    const digits = text.split("");
    setOtp(digits);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    // console.log("OTP entered:", otp.join(""));
    setStep(3); // Move to SetPassword
  };

  // Step 3: Set Password
  const handleSetPassword = (e) => {
    e.preventDefault();
    // console.log("Password updated");
    setStep(4); // Move to ConfirmPassword
  };

  // Step 4: Confirm Password
  const handleConfirmPassword = (e) => {
    e.preventDefault();
    setStep(5); // Move to SuccessfulModal
  };

  // Step 5: SuccessfulModal
  const handleFinish = () => {
    // console.log("Flow completed");
    setStep(1); // Reset flow
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#EEF5FF] px-4 sm:px-6 lg:px-8">
      {step === 1 && (
        <form
          onSubmit={handleForgotPassword}
          className="w-full max-w-md p-6 md:p-10"
        >
          <h2 className="text-xl font-semibold text-[#1E1E1E]">
            Forgot password
          </h2>
          <p className="mb-4 text-base font-semibold text-[#989898]">
            Please enter your email to reset the password
          </p>
          <div className="my-6 flex flex-col gap-1.5 md:my-10">
            <label className="text-sm font-normal text-slate-700" htmlFor="email">
              Email Address*
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 shadow-sm">
              <input
                id="email"
                name="email"
                required
                type="email"
                placeholder="Enter your email"
                className="w-full text-base font-normal text-gray-500 placeholder-gray-500 focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-lg bg-blue-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-600"
          >
            Reset Password
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOTP} className="w-full max-w-md p-6 md:p-10">
          <h2 className="text-xl font-semibold text-[#1E1E1E]">Check your email</h2>
          <p className="mb-1 text-base font-semibold text-[#989898] md:my-2">
            We sent a reset link to <span className="font-bold text-[#545454]">contact@gmai.com</span>
          </p>
          <p className="text-base font-semibold text-[#989898]">Enter the 6-digit code mentioned in the email</p>

          <div className="my-6 flex justify-between md:gap-2 gap-1 md:my-10">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onPaste={handlePaste}
                ref={(el) => (inputRefs[index] = el)}
                className="h-[48px] w-[48px] rounded-lg border border-gray-200 bg-white text-center text-2xl font-medium focus:outline-none"
              />
            ))}
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-lg bg-blue-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-600"
          >
            Verify Code
          </button>

          <p className="mt-4 text-center text-sm font-semibold text-neutral-600 md:mt-6">
            Haven’t got the email yet?{" "}
            <Link to="#" className="font-extrabold text-blue-600 hover:underline">
              Resend email
            </Link>
          </p>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleSetPassword} className="w-full max-w-md p-6 md:p-10">
          <h2 className="text-xl font-semibold text-[#1E1E1E]">Set a new password</h2>
          <p className="mt-3 text-base font-semibold text-[#989898] md:mt-5">
            Create a new password. Ensure it differs from previous ones for security
          </p>

          <div className="flex flex-col gap-1.5 md:mt-15 mt-10">
            <label className="text-sm font-normal text-slate-700">Password</label>
            <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 shadow-sm">
              <input
                type="password"
                required
                placeholder="Enter your new password"
                className="w-full text-base font-normal text-gray-500 placeholder-gray-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 md:my-9 my-5">
            <label className="text-sm font-normal text-slate-700">Confirm Password</label>
            <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 shadow-sm">
              <input
                type="password"
                required
                placeholder="Re-enter password"
                className="w-full text-base font-normal text-gray-500 placeholder-gray-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-8 flex w-full items-center justify-center rounded-lg bg-blue-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-600 md:mt-12"
          >
            Update Password
          </button>
        </form>
      )}

      {step === 4 && (
        <form onSubmit={handleConfirmPassword} className="w-full max-w-md p-6 md:p-10">
          <h2 className="text-xl font-semibold text-[#1E1E1E]">Password reset</h2>
          <p className="mt-3 text-base font-semibold text-[#989898] md:mt-5">
            Your password has been successfully reset. Click confirm to set a new password
          </p>
          <button
            type="submit"
            className="mt-8 flex w-full items-center justify-center rounded-lg bg-blue-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-600 md:mt-12"
          >
            Confirm
          </button>
        </form>
      )}

      {step === 5 && (
        <div className="w-full max-w-md p-6 md:p-10 bg-white rounded-lg">
          <h2 className="text-xl font-semibold text-[#1E1E1E]">Successful</h2>
          <p className="md:my-7 my-4 text-base font-semibold text-[#989898]">
            Congratulations! Your password has been changed. Click continue to login
          </p>
          <button
            onClick={handleFinish}
            className="flex w-full items-center justify-center rounded-lg bg-blue-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-600"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
};
