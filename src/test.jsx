import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

const LoginView = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // State for "Remember me" checkbox

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);

    // --- Client-side Validation ---
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://backend-ibracks.mtscorporate.com/api/users/login", // Your login API endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            rememberMe, // Send rememberMe state to the API
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || "Login successful!");
        // You would typically store the token and user data here (e.g., in localStorage, context, or Redux)
        console.log("Login Data:", data.data);
        console.log("User Token:", data.data.token);

        // Clear form fields on successful login
        setEmail("");
        setPassword("");
        setRememberMe(false);

        // Navigate to the home page after successful login
        navigate("/"); // Navigate to the root path (home page)
      } else {
        setError(
          data.message || "Login failed. Please check your credentials.",
        );
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error or server unavailable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-screen overflow-hidden bg-gradient-to-b from-black to-fuchsia-900">
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden md:hidden lg:flex">
        <div
          className="relative flex items-center justify-end"
          style={{
            transform: "rotate(2deg)",
            transformOrigin: "center center",
          }}
        >
          <img
            src="/log/loginbg.png"
            alt="Background"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="relative z-10 flex h-full w-full items-center justify-center">
        <div
          className="bg z-30 mx-auto flex h-full w-full flex-col items-start justify-center gap-4 overflow-y-auto px-8 py-6 backdrop-blur-xl md:w-full md:px-10 md:py-12 lg:w-1/2 lg:gap-6 lg:px-28 lg:py-16"
          style={{
            backgroundColor: "rgba(243, 243, 243, 0.10)",
          }}
        >
          <div className="mx-auto flex justify-center">
            <div className="">
              <h2 className="bg-gradient-to-b from-[#F5DEB3] to-[#DAA520] bg-clip-text text-center text-3xl font-[700] text-transparent md:text-4xl lg:text-5xl">
                Get Started -
              </h2>
              <h2 className="pt-2 text-center text-3xl font-[700] text-[#DAA520] md:pt-3 md:text-4xl lg:text-5xl">
                It’s Free
              </h2>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-start justify-start gap-4 self-stretch md:gap-5 lg:gap-6"
          >
            {/* Email */}
            <div className="flex flex-col items-start justify-start gap-1 self-stretch md:gap-2">
              <label
                htmlFor="email"
                className="font-poppins text-sm font-[400] font-normal text-white capitalize md:text-base"
              >
                Email
              </label>
              <div className="flex h-10 w-full items-center rounded-lg bg-white px-3 py-2 outline-1 outline-offset-[-1px] md:h-12 md:px-4 md:py-3">
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email here..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm text-neutral-700 focus:outline-none md:text-base"
                />
              </div>
            </div>
            {/* Password */}
            <div className="flex flex-col items-start justify-start gap-1 self-stretch md:gap-2">
              <label
                htmlFor="password"
                className="font-poppins text-sm font-normal text-white capitalize md:text-base"
              >
                Password
              </label>
              <div className="flex h-10 w-full items-center rounded-lg bg-white px-3 py-2 outline-1 outline-offset-[-1px] md:h-12 md:px-4 md:py-3">
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password here..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm text-neutral-700 focus:outline-none md:text-base"
                />
              </div>
            </div>
            {/* Remember / Forgot */}
            <div className="font-poppins flex w-full items-center justify-between text-sm md:text-base">
              <label className="flex cursor-pointer items-center gap-2 rounded p-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded-2xl checked:bg-red-500"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="font-poppins text-sm font-normal text-white capitalize md:text-base">
                  Remember me
                </span>
              </label>
              <div className="font-poppins justify-start text-sm font-normal text-white capitalize md:text-base">
                Forget Password?
              </div>
            </div>

            {error && (
              <p className="font-poppins self-stretch text-center text-sm text-red-500">
                {error}
              </p>
            )}
            {success && (
              <p className="font-poppins self-stretch text-center text-sm text-green-500">
                {success}
              </p>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              className="font-poppins h-10 w-full rounded-lg bg-gradient-to-b from-orange-200 to-yellow-500 text-sm font-medium text-black capitalize hover:opacity-90 md:h-12 md:text-base"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <h6 className="mx-auto flex items-center justify-center gap-2 text-center text-sm font-bold text-white">
            Don't have a account?{" "}
            <Link className="font-bold" to="/register">
              {" "}
              Sign Up now{" "}
            </Link>{" "}
          </h6>
          {/* Separator */}
          <div className="my-2 flex w-full items-center gap-2 md:my-4 md:gap-4">
            <div className="h-px flex-1 bg-neutral-200"></div>
            <span className="font-poppins text-sm text-neutral-200 md:text-base">
              Or Sign in with
            </span>
            <div className="h-px flex-1 bg-neutral-200"></div>
          </div>

          {/* Social Login Buttons */}
          {/* <div className="flex w-full flex-col gap-3 md:gap-4">
            <button className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border bg-white px-3 py-2 hover:bg-gray-50 md:h-12 md:px-4 md:py-3">
              <img
                src="/New folder/google.svg" // Ensure this path is correct
                className="h-5 w-5 md:h-6 md:w-6"
                alt="Google"
              />
              <span className="font-poppins text-sm text-neutral-700 md:text-base">
                Sign in With Google
              </span>
            </button>
          </div> */}
        </div>
        {/* Right Part - Hidden on md (tablet) and smaller screens */}
        <div className="hidden w-1/2 lg:block"></div>
      </div>
    </div>
  );
};

export default LoginView;
