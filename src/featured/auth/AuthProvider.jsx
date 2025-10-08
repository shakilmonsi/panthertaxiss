import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import instance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { AuthContext } from "./AuthContext";

const COOKIE_NAME = "token";

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!Cookies.get(COOKIE_NAME),
  );
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const setToken = (token) => {
    Cookies.set(COOKIE_NAME, token, {
      expires: 7,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      path: "/",
    });
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const clearToken = () => {
    Cookies.remove(COOKIE_NAME, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      path: "/",
    });
    delete instance.defaults.headers.common["Authorization"];
  };

  const normalizeEmail = (email) => {
    return email ? email.trim().toLowerCase() : "";
  };

  const isResponseSuccessful = (res) => {
    return (
      res.data?.success === true ||
      res.status === 200 ||
      res.status === 201 ||
      (res.status >= 200 && res.status < 300)
    );
  };

  const fetchUserProfile = async () => {
    try {
      console.log("🔄 [AUTH] Fetching user profile...");
      const res = await instance.get("user/profile");

      let currentUser = null; // 🏆 ডেটা পার্সিং লজিক সমন্বয় করা হলো:
      if (res.data.data) {
        // যদি "users" অ্যারেতে থাকে (যেমন "Fetch All Users" এ আসে)
        if (
          Array.isArray(res.data.data.users) &&
          res.data.data.users.length > 0
        ) {
          currentUser = res.data.data.users[0];
        } else if (res.data.data.id) {
          // যদি সরাসরি "data" অবজেক্টে ইউজার থাকে
          currentUser = res.data.data;
        }
      } else if (res.data.user) {
        currentUser = res.data.user;
      } else if (res.data && res.data.id) {
        currentUser = res.data;
      }

      if (currentUser) {
        const subscription = currentUser.subscription || {}; // 🚨 ডেটা ডিবাগিং: পোস্টম্যানের ডেটা ব্রাউজারে আসছে কি না তা চেক করার জন্য

        console.log("💣 [DEBUG] Raw Subscription Data from API:", subscription);

        const subscriptionStatus = subscription?.status?.toUpperCase();
        const subscriptionExists = !!subscription.id;

        const isAdmin = currentUser.role?.toUpperCase() === "ADMIN"; // ট্রায়াল শেষ হওয়ার ডেটটি বের করা

        // **এখানে পরিবর্তন করা হয়েছে: const এর বদলে let ব্যবহার করা হয়েছে**
        let trialEndDateString =
          subscription?.trialEndsAt || subscription?.demoEndsAt;

        let isTrialActive = false; // **মূল ট্রায়াল লজিক:**

        if (trialEndDateString) {
          const trialEnd = new Date(trialEndDateString);
          const isDateInFuture = trialEnd > new Date();

          if (
            subscriptionStatus === "TRIALING" ||
            subscriptionStatus === "DEMO" ||
            (subscriptionStatus === "ACTIVE" && isDateInFuture)
          ) {
            isTrialActive = isDateInFuture;
          }
        }

        // 🛑 চূড়ান্ত ওভাররাইট প্রতিরোধক লজিক (Final Overwrite Prevention):
        const trialStartedFlag = Cookies.get("trial_started") === "true";
        if (trialStartedFlag) {
          isTrialActive = true;

          // ডেট না পেলে ৭ দিনের অনুমান সেট করা হলো (UI দেখানোর জন্য)
          if (!trialEndDateString) {
            const assumedTrialEnd = new Date();
            assumedTrialEnd.setDate(assumedTrialEnd.getDate() + 7);
            // ✅ এখানে মান পুনরায় অ্যাসাইন করা হচ্ছে, যা এখন let থাকার কারণে সম্ভব।
            trialEndDateString = assumedTrialEnd.toISOString();
          }

          // ট্রায়াল ডেটা সফলভাবে ফেচ হওয়ার পরে কুকিটি মুছে ফেলুন (এটি নিশ্চিত করতে যে এই সমস্যা বারবার না হয়)
          if (
            subscriptionStatus === "TRIALING" ||
            subscriptionStatus === "DEMO" ||
            (subscriptionStatus === "ACTIVE" &&
              new Date(trialEndDateString) > new Date())
          ) {
            Cookies.remove("trial_started", { path: "/" });
          }
        } // যদি isTrialActive হয়, তবে স্ট্যাটাস ACTIVE হলেও আমরা এটিকে Paid Subscription হিসেবে গণ্য করব না।

        const isSubscriptionActive =
          subscriptionStatus === "ACTIVE" && !isTrialActive;

        console.log("🌟 [AUTH] Trial Status Calculated:", {
          statusFromDB: subscriptionStatus,
          trialEndDate: trialEndDateString,
          isTrialActiveFrontend: isTrialActive,
          trialStartedFlag: trialStartedFlag, // ডিবাগিং এর জন্য
        }); // Access control: Admin OR Active Subscription OR Active Trial

        const canAccessServices =
          isAdmin || isTrialActive || isSubscriptionActive; // Determine if user has used trial

        const calculatedHasUsedTrial =
          (subscriptionExists && !isSubscriptionActive && !isTrialActive) ||
          currentUser.hasUsedTrial === true;

        const userData = {
          ...currentUser,
          subscription: subscription,
          isSubscribed: isSubscriptionActive,
          isTrialing: isTrialActive,
          trialEndsAt: isTrialActive ? trialEndDateString : null,
          canAccessServices: canAccessServices,
          hasUsedTrial: calculatedHasUsedTrial,
        };

        setUser(userData);
        setIsAuthenticated(true);
        console.log("✅ [AUTH] User profile loaded successfully.");
        return userData;
      } else {
        clearToken();
        setIsAuthenticated(false);
        return null;
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        clearToken();
        setIsAuthenticated(false);
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = Cookies.get(COOKIE_NAME);
      if (token) {
        instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        await fetchUserProfile();
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const normalizedEmail = normalizeEmail(email);
      const res = await instance.post("/auth/login", {
        email: normalizedEmail,
        password,
      });

      const token = res.data.token;

      if (token) {
        setToken(token);
        const userData = await fetchUserProfile();

        if (userData) {
          setLoading(false);
          return {
            success: true,
            message: res.data.message,
            user: userData,
          };
        } else {
          setLoading(false);
          const message = "Failed to fetch user data after login.";
          setError(message);
          return { success: false, message };
        }
      } else {
        setLoading(false);
        const message = res.data?.message || "Invalid email or password.";
        setError(message);
        return { success: false, message };
      }
    } catch (err) {
      setLoading(false);
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "An unexpected error occurred during login.";
      setError(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    clearToken();
    setUser(null);
    setIsAuthenticated(false);
    console.log("👋 [AUTH] User logged out.");
  };

  const registerUser = async (userData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const normalizedUserData = {
        ...userData,
        email: normalizeEmail(userData.email),
      };

      const formData = new FormData();

      Object.keys(normalizedUserData).forEach((key) => {
        if (
          normalizedUserData[key] !== null &&
          normalizedUserData[key] !== undefined
        ) {
          formData.append(key, normalizedUserData[key]);
        }
      });

      const res = await instance.post("/auth/registration", formData);

      if (isResponseSuccessful(res)) {
        const message = res.data?.message || "Registration successful!";
        setSuccess(message);
        return { success: true, user: res.data, requiresVerification: true };
      } else {
        const message =
          res.data?.message || res.data?.error || "Registration failed";
        setError(message);
        return { success: false, message };
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Registration failed. An unexpected error occurred.";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const sendCode = async (email) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const normalizedEmail = normalizeEmail(email);
      const res = await instance.post("/auth/send-code", {
        email: normalizedEmail,
      });

      if (isResponseSuccessful(res)) {
        const message = res.data?.message || "Verification code sent!";
        setSuccess(message);
        return { success: true, message };
      } else {
        const message =
          res.data?.message ||
          res.data?.error ||
          "Failed to send verification code.";
        setError(message);
        return { success: false, message };
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Error sending verification code.";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (email, code) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const normalizedEmail = normalizeEmail(email);
      const normalizedCode = code.toString().trim();

      const res = await instance.post("/auth/verify-email", {
        email: normalizedEmail,
        code: normalizedCode,
      });

      if (isResponseSuccessful(res)) {
        const message = res.data?.message || "Email verified successfully!";
        setSuccess(message);
        return { success: true, message };
      } else {
        const message =
          res.data?.message || res.data?.error || "Invalid verification code.";
        setError(message);
        return { success: false, message };
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Error verifying email.";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async (email) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const normalizedEmail = normalizeEmail(email);
      const res = await instance.post("/auth/resend-code", {
        email: normalizedEmail,
      });

      if (isResponseSuccessful(res)) {
        const message = res.data?.message || "New code sent successfully!";
        setSuccess(message);
        return { success: true, message };
      } else {
        const message =
          res.data?.message || res.data?.error || "Failed to resend code.";
        setError(message);
        return { success: false, message };
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Error resending code.";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email, newPassword) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const normalizedEmail = normalizeEmail(email);
      const res = await instance.put("/auth/reset-password", {
        email: normalizedEmail,
        newPassword,
      });

      if (isResponseSuccessful(res)) {
        const message = res.data?.message || "Password reset successfully!";
        setSuccess(message);
        return { success: true, message };
      } else {
        const message =
          res.data?.message || res.data?.error || "Failed to reset password.";
        setError(message);
        return { success: false, message };
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Error resetting password.";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const startTrial = async (plan, paymentMethodId) => {
    return await createGenericSubscription(
      paymentMethodId,
      plan?.priceId,
      true, // initial: true indicates trial start
    );
  };

  const subscribe = async (plan, paymentMethodId) => {
    return await createGenericSubscription(
      paymentMethodId,
      plan?.priceId,
      false, // initial: false indicates direct subscription
    );
  };

  const createGenericSubscription = async (
    paymentMethodId,
    priceId,
    isInitialTrial = false,
  ) => {
    console.log("🔥 [GEN_SUB] createGenericSubscription Called with:", {
      paymentMethodId: paymentMethodId ? "✅ Received" : "❌ Missing",
      priceId,
      isInitialTrial,
      userId: user?.id,
    });
    if (!paymentMethodId || !user?.id) {
      const message = "Payment method ID or User ID is missing. Please log in.";
      console.error("❌ [GEN_SUB] Validation Error:", message);
      toast.error(message);
      return { success: false, error: message };
    }

    try {
      const requestBody = {
        email: user.email, // 🔥 এখন email পাঠানো হবে
        paymentMethodId: paymentMethodId,
        userId: user.id,
        priceId: priceId,
        useTrial: isInitialTrial,
      };

      console.log("📤 [GEN_SUB] Sending request to backend:", requestBody);
      const response = await instance.post(
        "/stripeSubscription/create-subscription",
        requestBody,
      );

      if (isResponseSuccessful(response)) {
        console.log("✅ [GEN_SUB] Subscription API Call Successful!");

        // 🌟 বাইপাস লজিক: ট্রায়াল সফল হলে ফ্রন্ট-এন্ডে ট্রায়াল স্ট্যাটাস সেট করা
        if (isInitialTrial && user) {
          const assumedTrialEnd = new Date();
          assumedTrialEnd.setDate(assumedTrialEnd.getDate() + 7);

          // এই স্টেট আপডেটটি লোডিং চলাকালীন ট্রায়াল দেখাতে সাহায্য করবে
          setUser((prevUser) => ({
            ...prevUser,
            isTrialing: true,
            isSubscribed: false,
            trialEndsAt: assumedTrialEnd.toISOString(),
          }));

          // 🏆 চূড়ান্ত ফিক্স (কুকি সেট): fetchUserProfile যেন এটি ভুলে না যায়
          Cookies.set("trial_started", "true", { expires: 1 / 24, path: "/" });
        } // ⏱️ চূড়ান্ত ফিক্স: ৪ সেকেন্ড অপেক্ষা করা হলো (Race Condition এড়ানোর জন্য)

        console.log(
          "🔄 [GEN_SUB] Starting User Profile Refresh after 4 seconds delay for Webhook...",
        );
        await new Promise((resolve) => setTimeout(resolve, 4000));
        await fetchUserProfile();
        console.log("🟢 [GEN_SUB] User Profile Refresh Completed.");

        toast.success(
          isInitialTrial
            ? "Trial successfully started! Your access begins now."
            : "Subscription process successful!",
        );

        return { success: true, data: response.data };
      } else {
        const errorMsg =
          response.data?.message || "Could not create subscription.";
        console.error(
          "❌ [GEN_SUB] API returned non-success response:",
          response.status,
          errorMsg,
        );
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      console.error(
        "💣 [GEN_SUB] Exception occurred during API call:",
        error.response?.data || error.message,
      );
      const errorMessage =
        error.response?.data?.message || error.message || "An issue occurred.";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const deleteAccount = async () => {
    // TODO: Implement actual delete account logic
    return { success: false, message: "Failed to delete account." };
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    error,
    success,
    setError,
    setSuccess,
    login,
    logout,
    registerUser,
    sendCode,
    verifyEmail,
    resendCode,
    resetPassword,
    fetchUserProfile,
    startTrial,
    subscribe,
    createGenericSubscription,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
