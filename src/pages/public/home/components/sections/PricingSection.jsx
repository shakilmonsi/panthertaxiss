import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import { RiCheckboxCircleLine } from "react-icons/ri";

import {
  CheckCircle,
  AlertTriangle,
  Clock,
  XCircle,
  Loader2,
} from "lucide-react";

import { Elements } from "@stripe/react-stripe-js";

import { loadStripe } from "@stripe/stripe-js";

import { useAuth } from "../../../../../featured/auth/AuthContext";

import StripePaymentForm from "../../../../private/Stripe/StripePaymentForm";

import PricingStatusPopup from "../PricingStatusPopup/PricingStatusPopup";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// 🏆 নতুন স্টেট: প্রতি সেকেন্ডে UI আপডেট করার জন্য

const useCountdown = (endTime) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!endTime) return;

    // endTime হল ISO string, সেটিকে Date অবজেক্টে রূপান্তর করা হলো

    const finalDate = new Date(endTime).getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();

      const difference = finalDate - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,

          hours: 0,

          minutes: 0,

          seconds: 0,

          expired: true,
        });

        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));

      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );

      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, expired: false });
    };

    // প্রথমবার কল করা হলো

    calculateTimeLeft();

    // প্রতি 1 সেকেন্ডে আপডেট করার জন্য setInterval ব্যবহার করা হলো

    const timer = setInterval(calculateTimeLeft, 1000);

    // কম্পোনেন্ট আনমাউন্ট হলে টাইমার বন্ধ করা

    return () => clearInterval(timer);
  }, [endTime]);

  return timeLeft;
};

// ----------------------------------------------------------------------

const PricingSection = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [popupContent, setPopupContent] = useState({});

  const {
    user,

    isAuthenticated,

    createGenericSubscription,

    subscriptionLoading,

    loading: authLoading,
  } = useAuth();

  const navigate = useNavigate();

  // 🏆 ব্যবহার করা হলো useCountdown Hook:

  const countdown = useCountdown(user?.trialEndsAt);

  const pricingData = [
    // ... (Your pricingData array remains the same)

    {
      id: "monthly_plan",

      title: "Monthly Subscription",

      price: "£5/monthly",

      period: "Per Month",

      trial: "7-Day FREE Trial",

      trialNote:
        "Payment details required, but you won't be charged for 7 days.",

      priceId: "price_1SBprCFJTw8ifWpVxapLpW5c",

      features: [
        "Daily vehicle checks",

        "Full history & export",

        "Expiry date reminders",

        "Useful Links",

        "Email support",

        "Cancel anytime",
      ],

      isAnnual: false,
    },

    {
      id: "annual_plan",

      title: "Annual Subscription",

      price: "£39/year",

      period: "Annual",

      trial: "7-Day FREE Trial",

      trialNote:
        "Payment details required, but you won't be charged for 7 days.",

      priceId: "price_1SBpnBFJTw8ifWpVj3NZQmjD",

      features: [
        "Daily vehicle checks",

        "Full history & export",

        "Expiry date reminders",

        "Useful Links",

        "Priority email support",

        "Advanced analytics",

        "Cancel anytime",
      ],

      isAnnual: true,
    },
  ];

  // ... (useEffect and handleSubscriptionAction functions remain the same)

  useEffect(() => {
    console.log("🔍 [PRICING] Component mounted/updated");

    console.log("🔍 [PRICING] User isTrialing (From Auth):", user?.isTrialing);

    console.log(
      "🔍 [PRICING] Subscription Loading State:",

      subscriptionLoading,
    );
  }, [user, isAuthenticated, subscriptionLoading]);

  const handleSubscriptionAction = async (plan, paymentMethodId, isTrial) => {
    if (!paymentMethodId || typeof paymentMethodId !== "string") {
      toast.error("Please select a payment method.");

      return;
    }

    setSelectedPlan(null);

    if (!plan.priceId || plan.priceId.includes("_ID_HERE")) {
      toast.error("Plan priceId is not set. Please contact the administrator.");

      return;
    }

    try {
      console.log(
        "📤 [PRICING_ACTION] Sending Subscription Request. Plan ID:",

        plan.id,

        "| Is Trial:",

        isTrial,
      );

      const result = await createGenericSubscription(
        paymentMethodId,

        plan.priceId,

        isTrial,
      );

      if (result && result.success) {
        console.log(
          "✅ [PRICING_ACTION] API Success. Backend handled the request.",
        );

        if (!result.data?.redirectUrl) {
          navigate("user-dashboard");
        }

        if (result.data?.redirectUrl) {
          console.log(
            "⚠️ [PRICING_ACTION] Redirecting for 3D Secure/Next Action.",
          );

          window.location.href = result.data.redirectUrl;

          return;
        }
      } else {
        const errorMessage =
          result?.error ||
          result?.message ||
          "Could not complete the process. Please try again.";

        console.error("❌ [PRICING_ACTION] API Response Failed:", errorMessage);

        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "An issue occurred. Please try again later.";

      toast.error(errorMessage);
    }
  };

  const handleButtonClick = (plan, isTrial) => {
    if (!isAuthenticated) {
      toast.warn("Please log in.");

      navigate("/login"); // 👈 This is already correct for redirection

      return;
    }

    setSelectedPlan({ ...plan, isTrial });
  };

  const handleManageSubscription = () => {
    toast.info(
      "Redirecting to the Dashboard to view your subscription status.",
    );

    navigate("user-dashboard");
  };

  // 🏆 getUserStatus ফাংশনটিকে Countdown Timer ব্যবহার করার জন্য আপডেট করা হলো

  const getUserStatus = () => {
    if (authLoading) {
      return {
        statusText: "Loading User Status...",

        statusColor: "bg-gray-100 text-gray-700",

        statusIcon: Loader2,

        showTrialButton: false,

        showSubscribeButton: false,

        showManageButton: false,

        statusAction: "",

        statusActionPath: "",
      };
    }

    if (!isAuthenticated) {
      return {
        statusText: "Not Logged In",

        statusColor: "bg-gray-100 text-gray-700",

        statusIcon: XCircle,

        showTrialButton: false,

        showSubscribeButton: false,

        showManageButton: false,

        statusAction: "Login to Continue",

        statusActionPath: "/login",
      };
    }

    if (subscriptionLoading) {
      return {
        statusText: "Processing Subscription...",

        statusColor: "bg-blue-100 text-blue-800",

        statusIcon: Loader2,

        showTrialButton: false,

        showSubscribeButton: false,

        showManageButton: false,

        statusAction: "Wait...",

        statusActionPath: "",
      };
    }

    const subscription = user?.subscription;

    const subscriptionStatus = subscription?.status?.toLowerCase();

    const hasUsedTrial = user?.hasUsedTrial;

    const subscriptionRecordExists =
      subscription && Object.keys(subscription).length > 0 && !!subscription.id;

    // 🏆 ডাইনামিক ট্রায়াল স্ট্যাটাস ক্যালকুলেশন (Countdown State ব্যবহার করে)

    if (user?.isTrialing && countdown) {
      let trialStatusText = "Free Trial Active";

      let statusColor = "bg-yellow-100 text-yellow-800";

      const formatTime = (t) => (t < 10 ? `0${t}` : t);

      if (countdown.expired) {
        // 🛑 ট্রায়াল শেষ

        trialStatusText = "Free Trial Expired. Please Subscribe.";

        statusColor = "bg-red-100 text-red-800";
      } else {
        // ✅ Countdown চলাকালীন

        const remainingTime = `${countdown.days}d ${formatTime(countdown.hours)}h ${formatTime(countdown.minutes)}m ${formatTime(countdown.seconds)}s left`;

        trialStatusText = `Free Trial Active (${remainingTime})`;

        if (countdown.days === 0 && countdown.hours < 4) {
          // 4 ঘণ্টার কম বাকি থাকলে লাল সতর্ক বার্তা

          statusColor = "bg-red-100 text-red-800";
        }
      }

      console.log(
        "🟡 [USER_STATUS] Result: TRIALING. Remaining Time:",

        countdown.expired
          ? "Expired"
          : `${countdown.days}d ${countdown.hours}h`,
      );

      return {
        statusText: trialStatusText,

        statusColor: statusColor,

        statusIcon: Clock,

        showTrialButton: false,

        showSubscribeButton: true,

        showManageButton: false,

        statusAction: "Go to Dashboard",

        statusActionPath: "user-dashboard",
      };
    }

    // Active paid subscription

    if (subscriptionStatus === "active") {
      console.log("🟢 [USER_STATUS] Result: ACTIVE Subscription.");

      return {
        statusText: "Subscription Active",

        statusColor: "bg-green-100 text-green-800",

        statusIcon: CheckCircle,

        showTrialButton: false,

        showSubscribeButton: false,

        showManageButton: true,

        statusAction: "Dashboard",

        statusActionPath: "user-dashboard",
      };
    }

    // Has used trial OR Subscription cancelled/expired/failed

    if (
      hasUsedTrial === true ||
      subscriptionRecordExists ||
      subscriptionStatus
    ) {
      if (
        subscriptionStatus === "canceled" ||
        subscriptionStatus === "past_due" ||
        subscriptionStatus === "unpaid"
      ) {
        console.log("🔴 [USER_STATUS] Result: Subscription Expired/Issue.");

        return {
          statusText: "Subscription Expired/Issue",

          statusColor: "bg-red-100 text-red-800",

          statusIcon: AlertTriangle,

          showTrialButton: false,

          showSubscribeButton: true,

          showManageButton: false,

          statusAction: "Renew Now",

          statusActionPath: "POPUP_RENEW",
        };
      }

      if (hasUsedTrial === true) {
        console.log(
          "🟠 [USER_STATUS] Result: Free Trial Used. Hiding Trial Button.",
        );

        return {
          statusText: "Free Trial Used",

          statusColor: "bg-orange-100 text-orange-800",

          statusIcon: AlertTriangle,

          showTrialButton: false,

          showSubscribeButton: true,

          showManageButton: false,

          statusAction: "Subscribe Now",

          statusActionPath: "POPUP_TRIAL_USED",
        };
      }
    }

    // New user

    console.log(
      "🔵 [USER_STATUS] Result: New User/Ready for Subscription. Showing Trial Button.",
    );

    return {
      statusText: "Ready for Subscription",

      statusColor: "bg-blue-100 text-blue-800",

      statusIcon: Clock,

      showTrialButton: true,

      showSubscribeButton: true,

      showManageButton: false,

      statusAction: "Dashboard",

      statusActionPath: "/dashboard",
    };
  };

  const userStatus = getUserStatus();

  // ... (handleStatusActionClick remains the same)

  const handleStatusActionClick = () => {
    if (userStatus.statusActionPath === "POPUP_TRIAL_USED") {
      setPopupContent({
        title: "Free Trial Ended",

        message:
          "Your 7-day free trial has been used. Please select a plan and subscribe to continue the service.",

        actionText: "View Subscription Plans",

        action: () => {
          setIsPopupOpen(false);

          document

            .getElementById("pricing")

            .scrollIntoView({ behavior: "smooth" });
        },
      });

      setIsPopupOpen(true);
    } else if (userStatus.statusActionPath === "POPUP_RENEW") {
      setPopupContent({
        title: "Renew Subscription",

        message:
          "Your subscription has expired or there was a payment issue. Please renew your plan to continue the service.",

        actionText: "View Plans to Renew",

        action: () => {
          setIsPopupOpen(false);

          document

            .getElementById("pricing")

            .scrollIntoView({ behavior: "smooth" });
        },
      });

      setIsPopupOpen(true);
    } else if (userStatus.statusActionPath) {
      navigate(userStatus.statusActionPath);
    }
  };

  return (
    <div
      id="pricing"
      className="flex w-full flex-col items-center justify-center gap-4 bg-blue-600/5 px-4 py-10 sm:px-12 sm:py-16 md:px-16 md:py-24 lg:px-24"
    >
      <div className="flex max-w-7xl flex-col items-center justify-center gap-10">
        <div className="mb-5 flex flex-col items-center justify-start gap-4 text-center font-['Roboto']">
          <h1 className="text-3xl font-semibold text-neutral-800 sm:text-4xl md:text-5xl">
            Simple, Transparent Pricing
          </h1>

          <p className="text-sm font-normal text-neutral-600 sm:text-base">
            Start with a free trial, then choose the plan that works for you.
          </p>

          {/* 🏆 স্ট্যাটাস ডিসপ্লে */}

          {isAuthenticated && (
            <div
              className={`flex items-center gap-3 rounded-lg px-4 py-2 shadow-md ${userStatus.statusColor}`}
            >
              {(() => {
                const StatusIconComponent = userStatus.statusIcon;

                const iconClass =
                  userStatus.statusIcon === Loader2 ? "animate-spin" : "";

                return (
                  <StatusIconComponent
                    className={`h-5 w-5 flex-shrink-0 ${iconClass}`}
                  />
                );
              })()}

              <p className="text-sm font-medium sm:text-base">
                Your current status:{" "}
                <span className="font-bold">{userStatus.statusText}</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ... (Pricing plan cards section remains the same) */}

      <div className="flex w-full max-w-5xl flex-col items-center justify-center gap-10 md:flex-row md:flex-wrap">
        {pricingData.map((plan) => (
          <div
            key={plan.id}
            className={`w-full max-w-sm transform overflow-hidden rounded-2xl shadow-[20px_20px_36px_0px_rgba(18,118,249,0.20)] transition-all duration-300 md:w-96 lg:w-96 ${
              plan.isAnnual
                ? "bg-blue-600 text-white"
                : "bg-white text-zinc-700"
            }`}
          >
            <div
              className={`flex w-full flex-col items-center justify-start gap-3 px-6 py-6 font-[Inter] ${
                plan.isAnnual
                  ? "bg-blue-600 text-white"
                  : "bg-white text-zinc-700"
              }`}
            >
              <div className="flex flex-col items-center justify-start gap-3 self-stretch">
                <div className="font-[Inter] text-xl font-[600]">
                  {plan.title}
                </div>

                <div className="text-3xl font-[700]">{plan.price}</div>
              </div>

              <div className="text-base font-normal capitalize">
                {plan.period}
              </div>

              <div
                className={`flex flex-col items-center justify-start self-stretch rounded-lg p-2 font-[600] outline outline-1 outline-offset-[-1px] ${
                  plan.isAnnual
                    ? "bg-blue-500/20 outline-blue-500/10"
                    : "bg-white outline-neutral-600/5"
                }`}
              >
                <div
                  className={`text-sm font-semibold ${
                    plan.isAnnual ? "text-white" : "text-yellow-900"
                  }`}
                >
                  {plan.trial}
                </div>

                <div
                  className={`text-xs font-normal ${
                    plan.isAnnual ? "text-white" : "text-yellow-900"
                  }`}
                >
                  {plan.trialNote}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-start gap-6 bg-[#FFF] px-5 pb-8 font-['Roboto']">
              <div className="flex w-full flex-col items-start justify-start gap-2 pt-6">
                {plan.features.map((feature, featureIndex) => (
                  <div
                    key={featureIndex}
                    className="inline-flex w-full items-center justify-start gap-3"
                  >
                    <RiCheckboxCircleLine className="h-5 w-5 flex-shrink-0 text-green-500" />

                    <div
                      className={`text-base font-normal ${
                        plan.isAnnual ? "text-[#747474]" : "text-neutral-500"
                      }`}
                    >
                      {feature}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center justify-start gap-3 self-stretch font-['Roboto'] text-base font-semibold text-white">
                {selectedPlan?.id === plan.id ? (
                  <div className="w-full">
                    <Elements stripe={stripePromise}>
                      <StripePaymentForm
                        plan={plan}
                        onPaymentSuccess={handleSubscriptionAction}
                        isTrial={selectedPlan.isTrial}
                        buttonText={
                          selectedPlan.isTrial
                            ? "Confirm Free Trial & Add Card"
                            : "Confirm Subscription"
                        }
                      />
                    </Elements>

                    <button
                      onClick={() => setSelectedPlan(null)}
                      className="mt-2 w-full text-sm text-red-500 hover:text-red-700"
                    >
                      Cancel
                    </button>
                  </div>
                ) : userStatus.showManageButton ? (
                  <button
                    className="inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-lg p-2.5 outline outline-1 outline-offset-[-1px] outline-blue-600 disabled:opacity-50"
                    onClick={handleManageSubscription}
                    disabled={subscriptionLoading}
                  >
                    <span className="text-base font-[600] text-blue-600">
                      Manage Subscription
                    </span>
                  </button>
                ) : // ------------------------------------------------------------------------------------------------------------------------------------

                // 🎯 এই অংশটি পরিবর্তন করা হলো: যদি ইউজার লগইন না করে থাকে তবে ট্রায়াল এবং সাবস্ক্রাইব বাটন দুটিই দেখাবে।

                // ------------------------------------------------------------------------------------------------------------------------------------

                !isAuthenticated ? (
                  <>
                    {/* Logged Out: Show "Start Free Trial" button */}

                    <button
                      className="inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-lg bg-blue-600 p-2.5 transition-colors hover:bg-blue-700"
                      onClick={() => handleButtonClick(plan, true)}
                    >
                      <span className="text-base font-[600] text-white">
                        Start Free Trial
                      </span>
                    </button>

                    {/* Logged Out: Show "Subscribe Now" button */}

                    <button
                      className="inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-lg p-2.5 outline outline-1 outline-offset-[-1px] outline-blue-600 transition-colors hover:bg-blue-50"
                      onClick={() => handleButtonClick(plan, false)}
                    >
                      <span className="text-base font-[600] text-blue-600">
                        Subscribe Now
                      </span>
                    </button>
                  </>
                ) : (
                  // ------------------------------------------------------------------------------------------------------------------------------------

                  // ------------------------------------------------------------------------------------------------------------------------------------

                  <>
                    {userStatus.showTrialButton && (
                      <button
                        className="inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-lg bg-blue-600 p-2.5 transition-colors hover:bg-blue-700 disabled:opacity-50"
                        onClick={() => handleButtonClick(plan, true)}
                        disabled={
                          subscriptionLoading ||
                          user?.isTrialing ||
                          user?.isSubscribed ||
                          user?.hasUsedTrial
                        }
                      >
                        <span className="text-base font-[600] text-white">
                          {subscriptionLoading
                            ? "Starting Trial..."
                            : "Start Free Trial"}
                        </span>
                      </button>
                    )}

                    {userStatus.showSubscribeButton && (
                      <button
                        className="inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-lg p-2.5 outline outline-1 outline-offset-[-1px] outline-blue-600 transition-colors hover:bg-blue-50 disabled:opacity-50"
                        onClick={() => handleButtonClick(plan, false)}
                        disabled={subscriptionLoading || user?.isSubscribed}
                      >
                        <span className="text-base font-[600] text-blue-600">
                          {subscriptionLoading
                            ? "Processing..."
                            : "Subscribe Now"}
                        </span>
                      </button>
                    )}
                  </>
                )}

                <div className="w-full text-center text-xs leading-tight font-normal text-neutral-600">
                  Cancel anytime • No hidden fees • Secure payments
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <PricingStatusPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        content={popupContent}
      />
    </div>
  );
};

export default PricingSection;
