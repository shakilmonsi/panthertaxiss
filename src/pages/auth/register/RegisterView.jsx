import { useState, useContext } from "react";

import { Link, useNavigate } from "react-router-dom";

import toast, { Toaster } from "react-hot-toast";

import { AuthContext } from "../../../featured/auth/AuthContext";

const RegisterView = () => {
  const { registerUser, loading } = useContext(AuthContext);

  const [name, setName] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [companyName, setCompanyName] = useState("");

  const [profileImage, setProfileImage] = useState(null);

  const navigate = useNavigate();

  const compressImage = (file, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");

      const ctx = canvas.getContext("2d");

      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;

          width = maxWidth;
        }

        canvas.width = width;

        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob], file.name, {
              type: file.type,

              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },

          file.type,

          quality,
        );
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");

        e.target.value = "";

        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");

        e.target.value = "";

        return;
      }

      try {
        const compressedFile = await compressImage(file);

        setProfileImage(compressedFile);

        toast.success("Image compressed and ready for upload");
      } catch (error) {
        toast.error("Error processing image. Please try again.");

        e.target.value = "";
      }
    } else {
      setProfileImage(null);
    }
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();

    toast.dismiss();

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all required fields.");

      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");

      return;
    }

    const uploadingToastId = toast.loading("Creating your account...");

    const userData = {
      name,

      email,

      password,

      phoneNumber,

      companyName,

      // ================code by shakil munshi ==============
      // if profileImage there is, only then this will go tow userData-
      //  `profileImage` ( null)
      // =======================================================

      image: profileImage,
    };

    const res = await registerUser(userData);

    toast.dismiss(uploadingToastId);

    if (res.success) {
      toast.success("✅ Registration successful! Redirecting to login...", {
        duration: 3000,
      });

      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } else {
      toast.error(res.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50 p-6 font-sans sm:p-8 lg:p-16">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-8 p-4 md:gap-12">
        <div className="flex w-full flex-col items-center gap-4">
          {/* <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2.5 shadow-sm transition-colors duration-200 hover:bg-gray-50">

            <img src="image/google.png" alt="" className="h-6 w-6" />

            <span className="text-base font-[700] text-gray-700">

              Sign in with Google

            </span>

          </button> */}

          <div className="flex w-full items-center gap-4">
            <hr className="flex-1 border-t border-black" />

            <span className="text-base font-medium text-black">
              or sign up with email
            </span>

            <hr className="flex-1 border-t border-black" />
          </div>
        </div>

        <form
          onSubmit={handleRegistrationSubmit}
          className="flex w-full flex-col gap-8"
        >
          <div className="flex flex-col gap-1">
            <label
              htmlFor="fullName"
              className="text-base font-normal text-gray-700"
            >
              Full Name*
            </label>

            <input
              type="text"
              id="fullName"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="text-base font-normal text-gray-700"
            >
              Email Address*
            </label>

            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="companyName"
              className="text-base font-normal text-gray-700"
            >
              Company Name (Optional)
            </label>

            <input
              type="text"
              id="companyName"
              placeholder="Choose Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="phone"
              className="text-base font-normal text-gray-700"
            >
              Phone Number (Optional)
            </label>

            <input
              type="tel"
              id="phone"
              placeholder="Enter your number here..."
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="text-base font-normal text-gray-700"
            >
              Password*
            </label>

            <input
              type="password"
              id="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="confirmPassword"
              className="text-base font-normal text-gray-700"
            >
              Confirm password*
            </label>

            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="profileImage"
              className="text-base font-normal text-gray-700"
            >
              Upload Profile Image (Optional)
            </label>

            <input
              type="file"
              id="profileImage"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5"
            />

            {profileImage && (
              <div className="text-xs text-green-600">
                ✓ Image ready: {profileImage.name} (
                {(profileImage.size / 1024).toFixed(1)}KB)
              </div>
            )}
          </div>

          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-blue-500 px-3.5 py-2.5 font-semibold text-white shadow-sm hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="gap-2 px-2 text-base font-[700] text-gray-700">
          Already have an account?
          <Link to="/login" className="px-2 text-blue-700 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterView;
