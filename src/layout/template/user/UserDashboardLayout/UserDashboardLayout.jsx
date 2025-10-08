import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import UserLeftSide from "./UserLeftSide";
import { Clock, AlertTriangle, ArrowRight } from "lucide-react";
import { useAuth } from "../../../../featured/auth/AuthContext";

// ============code by shakil munshi =================
//  New: Trial Notification Banner Component
// =================================================
const TrialNotificationBanner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isTrialing = user?.isTrialing;
  const trialEndsAt = user?.trialEndsAt;
  const [timeLeft, setTimeLeft] = useState(null);

  // ============code by shakil munshi =================
  // dynamic counter
  // =================================================

  useEffect(() => {
    if (!isTrialing || !trialEndsAt || user?.isSubscribed) return;

    const finalDate = new Date(trialEndsAt).getTime();

    // Time format utility (e.g., 5 -> 05)
    const formatTime = (t) => (t < 10 ? `0${t}` : t);

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

      // ============code by shakil munshi =================
      // mane massage fortmat create now
      // =================================================
      const timeString = `${days}d ${formatTime(hours)}h ${formatTime(minutes)}m ${formatTime(seconds)}s`;

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        expired: false,
        timeString,
      });
    };
    // ============code by shakil munshi =================
    //fast call and par 1 secent update nwo setinterval use
    // =================================================
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [isTrialing, trialEndsAt, user?.isSubscribed]);

  // ============code by shakil munshi =================
  // trial time fhnish or trial na tekhe
  // =================================================
  if (
    !isTrialing ||
    !trialEndsAt ||
    user?.isSubscribed ||
    !timeLeft ||
    timeLeft.expired
  ) {
    return null;
  }

  // ============code by shakil munshi =================
  //if trial run but time hiwy load go
  // =================================================
  if (!timeLeft.timeString) {
    return (
      <div className="sticky top-0 z-20 w-full bg-gray-100 p-3 text-center text-sm font-medium text-gray-700 shadow-lg">
        Checking trial status...
      </div>
    );
  }

  // Banner colors and message logic
  let bannerClass = "bg-yellow-100 text-yellow-800 border-b border-yellow-300";
  let message = `Your 7-day free trial is active. You have ${timeLeft.timeString} left.`;

  if (timeLeft.days < 2) {
    bannerClass = "bg-red-500 text-white border-b border-red-700 animate-pulse";
    message = `⚠️ Warning! Your free trial is ending soon! Only ${timeLeft.timeString} remaining.`;
  }

  return (
    <div
      className={`sticky top-0 z-20 w-full p-3 text-center text-sm font-medium shadow-lg ${bannerClass}`}
    >
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
        {timeLeft.days < 2 ? (
          <AlertTriangle className="h-4 w-4" />
        ) : (
          <Clock className="h-4 w-4" />
        )}
        <span className="font-semibold">{message}</span>
      </div>
    </div>
  );
};

const UserDashboardLayout = () => {
  return (
    <section className="flex min-h-screen bg-[#212121] text-white">
      {/* Fixed Sidebar */}
      <div className="fixed z-10 h-screen bg-[#212121] lg:w-[260px]">
        <UserLeftSide />
      </div>

      {/* Content Area */}
      <div className="w-full overflow-y-auto bg-white bg-gradient-to-b lg:pl-62">
        {/* 🏆 Banner Component */}
        <TrialNotificationBanner />
        <Outlet />
      </div>
    </section>
  );
};

export default UserDashboardLayout;
