import React, { useContext, useState } from "react";
import {
  User,
  Mail,
  Image,
  Plus,
  Shield,
  ChevronDown,
  Lock,
} from "lucide-react";
import { AuthContext } from "../../../../featured/auth/AuthContext";
import toast from "react-hot-toast";

export default function AddUserForm({ onClose }) {
  const { registerUser, loading } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const roles = ["ADMIN", "USER"];

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();
    const uploadingToastId = toast.loading("Creating your account...");

    const userData = { ...formData, image: profileImage };
    const res = await registerUser(userData);

    toast.dismiss(uploadingToastId);

    if (res.success) {
      toast.success("New User created successfully", { duration: 3000 });
      setFormData({ name: "", email: "", password: "", role: "USER" });
      setProfileImage(null);
    } else {
      toast.error(res.message || "Registration failed. Please try again.");
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", email: "", password: "", role: "USER" });
    setProfileImage(null);
    setShowRoleDropdown(false);
    onClose();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-2xl rounded-3xl bg-white/90 p-8 shadow-xl backdrop-blur-md transition-all duration-300 hover:shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex flex-col items-center gap-4">
          <div className="relative">
            <img
              className="h-20 w-20 rounded-full border-4 border-blue-400 object-cover shadow-md transition-all duration-300 hover:scale-105"
              src={
                profileImage
                  ? typeof profileImage === "string"
                    ? profileImage
                    : URL.createObjectURL(profileImage)
                  : "https://placehold.co/84x84"
              }
              alt="User Avatar"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Add New User</h1>
          <p className="text-sm text-gray-500">
            Create an account for your team member
          </p>
        </div>

        {/* Form */}
        <form
          className="flex flex-col gap-5"
          onSubmit={handleRegistrationSubmit}
        >
          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-600">Full Name</label>
            <div className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 shadow-sm transition-all focus-within:ring-2 focus-within:ring-blue-400">
              <User className="text-blue-500" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter full name"
                className="flex-1 bg-transparent text-gray-700 placeholder-gray-400 outline-none"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-600">Email Address</label>
            <div className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 shadow-sm transition-all focus-within:ring-2 focus-within:ring-blue-400">
              <Mail className="text-blue-500" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter email address"
                className="flex-1 bg-transparent text-gray-700 placeholder-gray-400 outline-none"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-600">Password</label>
            <div className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 shadow-sm transition-all focus-within:ring-2 focus-within:ring-blue-400">
              <Lock className="text-blue-500" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Enter password"
                className="flex-1 bg-transparent text-gray-700 placeholder-gray-400 outline-none"
                required
              />
            </div>
          </div>

          {/* Role */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-600">Role</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-2 shadow-sm transition-all hover:bg-blue-50"
              >
                <Shield className="text-blue-500" />
                <span className="flex-1 text-left text-gray-700">
                  {formData.role}
                </span>
                <ChevronDown className="text-gray-500" />
              </button>
              {showRoleDropdown && (
                <div className="absolute top-full z-10 mt-1 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                  {roles.map((role) => (
                    <button
                      key={role}
                      type="button"
                      className="w-full px-4 py-2 text-left transition-all hover:bg-blue-100"
                      onClick={() => {
                        handleInputChange("role", role);
                        setShowRoleDropdown(false);
                      }}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Avatar */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-600">Avatar</label>
            <div className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 shadow-sm">
              <Image className="text-blue-500" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setProfileImage(e.target.files[0]);
                  }
                }}
                className="flex-1 bg-transparent text-gray-500 outline-none"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 rounded-xl border border-blue-500 px-6 py-2 font-semibold text-blue-500 transition-all hover:bg-blue-50 sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2 font-semibold text-white transition-all hover:from-blue-600 hover:to-purple-600 sm:w-auto"
            >
              <Plus />
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
