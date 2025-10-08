import React, { useState, useEffect, useCallback } from "react";
import { PiSubtitlesThin } from "react-icons/pi";
import {
  CreditCard,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  ExternalLink,
  RefreshCw,
  Shield,
  Users,
  Zap,
  XCircle,
  Info,
  Star,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../featured/auth/AuthContext";

// Constants
const SUBSCRIPTION_STATUS = {
  ACTIVE: "ACTIVE",
  TRIALING: "TRIALING",
  PAST_DUE: "PAST_DUE",
  CANCELED: "CANCELED",
  UNPAID: "UNPAID",
  DEMO: "DEMO",
};

const PLAN_TYPES = {
  MONTHLY: "monthly_plan",
  ANNUAL: "annual_plan",
};

const UserSeting = () => {
  const { user, isAuthenticated, fetchUserProfile, loading } = useAuth();
  const navigate = useNavigate();

  // Local state
  const [refreshing, setRefreshing] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [billingHistory, setBillingHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Fetch billing history on component mount
  useEffect(() => {
    if (isAuthenticated && user?.subscription?.id) {
      fetchBillingHistory();
    }
  }, [user?.subscription?.id, isAuthenticated]);

  // Mock function - replace with actual API call
  const fetchBillingHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      // Replace this with actual API call
      // const response = await instance.get('/billing/history');

      // Mock data for demo
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

      const mockHistory = [
        {
          id: "inv_1025",
          amount: user?.subscription?.amount || 500, // £5.00 in pence
          currency: "GBP",
          status: "paid",
          created: thirtyDaysAgo.toISOString(),
          invoice_pdf: "#",
          description: "Monthly Subscription",
        },
        {
          id: "inv_1024",
          amount: user?.subscription?.amount || 500,
          currency: "GBP",
          status: "paid",
          created: sixtyDaysAgo.toISOString(),
          invoice_pdf: "#",
          description: "Monthly Subscription",
        },
      ];

      setBillingHistory(mockHistory);
    } catch (error) {
      console.error("Failed to fetch billing history:", error);
      toast.error("Failed to load billing history");
    } finally {
      setLoadingHistory(false);
    }
  }, [user?.subscription?.amount]);

  // Refresh user data
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchUserProfile();
      await fetchBillingHistory();
      toast.success("Account information refreshed");
    } catch (error) {
      toast.error("Failed to refresh data");
    } finally {
      setRefreshing(false);
    }
  }, [fetchUserProfile, fetchBillingHistory]);

  // Handle plan upgrade/change
  const handlePlanChange = useCallback(() => {
    navigate("/#pricing");
    toast.info("Redirecting to pricing plans...");
  }, [navigate]);

  // Handle payment method update
  const handleUpdatePayment = useCallback(() => {
    // This would typically open a Stripe customer portal
    toast.info("Opening payment method update...");
    // window.open(customerPortalUrl, '_blank');
  }, []);

  // Handle subscription cancellation
  const handleCancelSubscription = useCallback(async () => {
    try {
      // Replace with actual API call
      // await instance.post('/subscription/cancel');

      toast.success(
        "Subscription cancelled. You can continue using the service until your billing period ends.",
      );
      setShowCancelConfirm(false);
      await fetchUserProfile();
    } catch (error) {
      toast.error("Failed to cancel subscription. Please contact support.");
    }
  }, [fetchUserProfile]);

  // Get subscription display info
  const getSubscriptionInfo = useCallback(() => {
    if (!user?.subscription) {
      return {
        planName: "No Active Plan",
        planType: "free",
        status: "inactive",
        statusColor: "bg-gray-100 text-gray-800",
        statusIcon: XCircle,
        nextBilling: null,
        amount: 0,
        isActive: false,
        showUpgrade: true,
        showCancel: false,
      };
    }

    const subscription = user.subscription;
    const status = subscription.status?.toUpperCase();
    const isActive = status === SUBSCRIPTION_STATUS.ACTIVE;
    const isTrialing = user.isTrialing;

    // Determine plan name
    let planName = "Unknown Plan";
    let planType = "unknown";

    if (subscription.priceId?.includes("month")) {
      planName = "Monthly Plan";
      planType = "monthly";
    } else if (
      subscription.priceId?.includes("annual") ||
      subscription.priceId?.includes("year")
    ) {
      planName = "Annual Plan";
      planType = "annual";
    }

    // Handle trial status
    if (isTrialing) {
      planName = `${planName} (Trial)`;
      planType = "trial";
    }

    // Status display logic
    let statusDisplay = {
      statusColor: "bg-green-100 text-green-800",
      statusIcon: CheckCircle,
      showUpgrade: true,
      showCancel: true,
    };

    switch (status) {
      case SUBSCRIPTION_STATUS.ACTIVE:
        statusDisplay = {
          statusColor: "bg-green-100 text-green-800",
          statusIcon: CheckCircle,
          showUpgrade: true,
          showCancel: true,
        };
        break;
      case SUBSCRIPTION_STATUS.TRIALING:
      case SUBSCRIPTION_STATUS.DEMO:
        statusDisplay = {
          statusColor: "bg-blue-100 text-blue-800",
          statusIcon: Clock,
          showUpgrade: true,
          showCancel: false,
        };
        break;
      case SUBSCRIPTION_STATUS.PAST_DUE:
        statusDisplay = {
          statusColor: "bg-orange-100 text-orange-800",
          statusIcon: AlertTriangle,
          showUpgrade: true,
          showCancel: false,
        };
        break;
      case SUBSCRIPTION_STATUS.CANCELED:
        statusDisplay = {
          statusColor: "bg-red-100 text-red-800",
          statusIcon: XCircle,
          showUpgrade: true,
          showCancel: false,
        };
        break;
      default:
        statusDisplay = {
          statusColor: "bg-gray-100 text-gray-800",
          statusIcon: AlertTriangle,
          showUpgrade: true,
          showCancel: false,
        };
    }

    return {
      planName,
      planType,
      status: status?.toLowerCase() || "unknown",
      ...statusDisplay,
      nextBilling: subscription.currentPeriodEnd
        ? new Date(subscription.currentPeriodEnd)
        : null,
      amount: subscription.amount || 0,
      isActive: isActive || isTrialing,
      currency: subscription.currency || "GBP",
    };
  }, [user]);

  const subscriptionInfo = getSubscriptionInfo();

  // Format currency
  const formatCurrency = useCallback((amount, currency = "GBP") => {
    try {
      const numericAmount = Number(amount) || 0;

      // Fallback for environments where Intl is not available
      if (typeof Intl !== "undefined" && Intl.NumberFormat) {
        return new Intl.NumberFormat("en-GB", {
          style: "currency",
          currency: currency,
          minimumFractionDigits: 2,
        }).format(numericAmount / 100); // Assuming amount is in pence
      } else {
        // Manual formatting fallback
        const formattedAmount = (numericAmount / 100).toFixed(2);
        return `£${formattedAmount}`;
      }
    } catch (error) {
      console.error("Currency formatting error:", error);
      return `£${((Number(amount) || 0) / 100).toFixed(2)}`;
    }
  }, []);

  // Format date
  const formatDate = useCallback((date) => {
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return "Invalid Date";
      }

      // Fallback for environments where Intl is not available
      if (typeof Intl !== "undefined" && Intl.DateTimeFormat) {
        return new Intl.DateTimeFormat("en-GB", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }).format(dateObj);
      } else {
        // Manual formatting fallback
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        return `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
      }
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid Date";
    }
  }, []);

  // Get payment method display
  const getPaymentMethodInfo = useCallback(() => {
    if (!user?.subscription?.paymentMethod) {
      return {
        display: "No payment method",
        brand: "",
        last4: "",
        showUpdate: false,
      };
    }

    const pm = user.subscription.paymentMethod;
    return {
      display: `${pm.brand?.toUpperCase() || "Card"} ending in ****${pm.last4 || "0000"}`,
      brand: pm.brand || "unknown",
      last4: pm.last4 || "0000",
      showUpdate: true,
    };
  }, [user]);

  const paymentInfo = getPaymentMethodInfo();

  if (!isAuthenticated) {
    return (
      <div className="mt-[72px] mb-4 flex w-full flex-col items-center bg-white px-4 sm:mt-2 sm:px-6 md:mt-[64px] md:px-8 lg:mt-0 lg:px-10">
        <div className="w-full px-4 py-2.5">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <XCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                Access Denied
              </h3>
              <p className="mb-4 text-gray-600">
                Please log in to view your settings.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-[72px] mb-4 flex w-full flex-col items-center bg-white px-4 sm:mt-2 sm:px-6 md:mt-[64px] md:px-8 lg:mt-0 lg:px-10">
      {/* Header Section */}
      <div className="w-full px-4 py-2.5">
        <div className="flex flex-col gap-2 md:gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-['Roboto'] text-2xl font-bold text-neutral-800 md:text-3xl">
                Settings
              </h1>
              <p className="font-['Roboto'] text-sm font-normal text-neutral-600 md:text-base">
                Manage your subscription and account preferences.
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm transition-colors hover:bg-gray-200 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex w-full flex-col items-start gap-4 rounded-2xl border border-zinc-300 bg-[#E8E9E9] p-4 md:gap-5 md:p-6 lg:p-8">
        {/* Tab Header */}
        <div className="flex w-full justify-start">
          <div className="flex w-full items-center justify-center gap-2 rounded-t-lg border-b-2 border-blue-600 bg-sky-100 px-4 py-2 md:w-80 md:gap-2.5 md:px-6 md:py-3">
            <PiSubtitlesThin className="h-6 w-6 text-neutral-800 md:h-7 md:w-7" />
            <p className="font-['Roboto'] text-sm font-[600] text-neutral-800 md:text-base">
              Subscription
            </p>
          </div>
        </div>

        {/* Subscription Overview */}
        <div className="w-full">
          <h2 className="mb-4 font-['Roboto'] text-base font-[600] text-neutral-800 md:text-lg">
            Subscription & Payment
          </h2>

          <div className="flex w-full flex-col items-start gap-6 rounded-xl border border-neutral-300 bg-white p-4 md:p-6">
            {/* Current Plan Section */}
            <div className="flex w-full flex-col items-start gap-3 md:gap-4">
              <div className="flex items-center gap-2">
                <h3 className="w-full font-['Roboto'] text-sm font-medium text-neutral-600 md:text-base">
                  Current Plan
                </h3>
                <div
                  className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${subscriptionInfo.statusColor}`}
                >
                  <subscriptionInfo.statusIcon className="h-3 w-3" />
                  {subscriptionInfo.status}
                </div>
              </div>

              <div className="flex w-full flex-col items-start gap-2 rounded-lg border border-gray-200 bg-slate-50 px-3 py-3 md:flex-row md:items-center md:gap-4 md:px-4">
                <div className="flex flex-1 flex-col items-start gap-2">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-['Roboto'] text-base font-semibold text-neutral-800">
                        {subscriptionInfo.planName}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        {subscriptionInfo.amount > 0 && (
                          <span className="font-medium">
                            {formatCurrency(
                              subscriptionInfo.amount,
                              subscriptionInfo.currency,
                            )}
                          </span>
                        )}
                        {subscriptionInfo.nextBilling && (
                          <span>
                            • Next billing:{" "}
                            {formatDate(subscriptionInfo.nextBilling)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Trial Information */}
                  {user?.isTrialing && user?.trialEndsAt && (
                    <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-2 text-sm">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-800">
                        Trial ends {formatDate(user.trialEndsAt)}
                        {user.trialDaysRemaining > 0 &&
                          ` (${user.trialDaysRemaining} days remaining)`}
                      </span>
                    </div>
                  )}

                  {/* Subscription Issues */}
                  {subscriptionInfo.status === "past_due" && (
                    <div className="flex items-center gap-2 rounded-lg bg-orange-50 p-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <span className="text-orange-800">
                        Payment overdue. Please update your payment method.
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 md:flex-row">
                  {subscriptionInfo.showUpgrade && (
                    <button
                      onClick={handlePlanChange}
                      className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-blue-600 bg-blue-100 px-4 py-2 transition-colors hover:bg-blue-200 md:h-12 md:w-auto md:px-6"
                    >
                      <TrendingUp className="h-4 w-4" />
                      <span className="font-['Roboto'] text-sm font-[600] text-blue-600 md:text-base">
                        {subscriptionInfo.isActive ? "Change Plan" : "Upgrade"}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="flex w-full flex-col items-start gap-3 md:gap-4">
              <h3 className="w-full font-['Roboto'] text-sm font-medium text-neutral-600 md:text-base">
                Payment Method
              </h3>

              <div className="flex w-full flex-col items-start gap-2 rounded-lg border border-gray-200 bg-slate-50 px-3 py-3 md:flex-row md:items-center md:gap-4 md:px-4">
                <div className="flex flex-1 items-center gap-3">
                  <CreditCard className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-['Roboto'] text-base font-medium text-neutral-700">
                      {paymentInfo.display}
                    </p>
                    {paymentInfo.showUpdate && (
                      <p className="text-xs text-gray-500">
                        Secure payment powered by Stripe
                      </p>
                    )}
                  </div>
                </div>

                {paymentInfo.showUpdate && (
                  <button
                    onClick={handleUpdatePayment}
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-100 md:h-12 md:w-auto md:px-6"
                  >
                    <Shield className="h-4 w-4" />
                    <span className="font-['Roboto'] text-sm font-[600] text-gray-700 md:text-base">
                      Update
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Billing History Section */}
            <div className="flex w-full flex-col items-start gap-3 md:gap-4">
              <div className="flex w-full items-center justify-between">
                <h3 className="font-['Roboto'] text-sm font-medium text-neutral-600 md:text-base">
                  Billing History
                </h3>
                {loadingHistory && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Loading...
                  </div>
                )}
              </div>

              <div className="flex w-full flex-col items-start gap-2 rounded-lg border border-gray-200 bg-slate-50 px-3 py-3 md:px-4">
                {billingHistory.length > 0 ? (
                  <div className="w-full space-y-3">
                    {billingHistory.map((invoice) => (
                      <div
                        key={invoice.id}
                        className="flex w-full flex-col items-start justify-between gap-2 md:flex-row md:items-center md:gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {invoice.status === "paid" ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <AlertTriangle className="h-5 w-5 text-orange-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-['Roboto'] text-sm font-medium text-neutral-700">
                              Invoice #{invoice.id.replace("inv_", "")}
                            </p>
                            <p className="font-['Roboto'] text-xs text-neutral-500">
                              {invoice.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-['Roboto'] text-sm font-semibold text-neutral-700">
                              {formatCurrency(invoice.amount, invoice.currency)}
                            </p>
                            <p className="font-['Roboto'] text-xs text-neutral-500">
                              {formatDate(invoice.created)}
                            </p>
                          </div>

                          {invoice.invoice_pdf &&
                            invoice.invoice_pdf !== "#" && (
                              <button
                                onClick={() =>
                                  window.open(invoice.invoice_pdf, "_blank")
                                }
                                className="rounded p-2 text-blue-600 transition-colors hover:bg-blue-50"
                                title="Download Invoice"
                              >
                                <Download className="h-4 w-4" />
                              </button>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full py-8 text-center">
                    <Calendar className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                    <p className="font-['Roboto'] text-sm text-neutral-500">
                      No billing history available yet
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Account Features */}
            <div className="flex w-full flex-col items-start gap-3 md:gap-4">
              <h3 className="w-full font-['Roboto'] text-sm font-medium text-neutral-600 md:text-base">
                Account Features
              </h3>

              <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-3">
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      Daily vehicle checks
                    </p>
                    <p className="text-xs text-green-600">Unlimited access</p>
                  </div>
                </div>
                {/* 
                <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <Shield className="h-5 w-5 flex-shrink-0 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      Priority support
                    </p>
                    <p className="text-xs text-blue-600">24/7 assistance</p>
                  </div>
                </div> */}
              </div>
            </div>

            {/* Cancel Subscription Section */}
            {subscriptionInfo.showCancel && subscriptionInfo.isActive && (
              <div className="flex w-full flex-col items-start gap-3 md:gap-4">
                <div className="flex w-full flex-col items-start gap-2 rounded-lg border border-amber-400 bg-orange-100 px-3 py-3 md:flex-row md:items-center md:gap-4 md:px-4">
                  <div className="flex flex-1 flex-col items-start justify-center gap-1">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                      <p className="font-['Roboto'] text-sm font-medium text-amber-800 md:text-base">
                        Need a break?
                      </p>
                    </div>
                    <p className="font-['Roboto'] text-sm text-amber-700">
                      You can cancel your subscription at any time. Your access
                      will continue until the end of your billing period.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowCancelConfirm(true)}
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-orange-300 bg-amber-100 px-4 py-2 transition-colors hover:bg-amber-200 md:h-12 md:w-auto md:px-6"
                  >
                    <XCircle className="h-4 w-4" />
                    <span className="font-['Roboto'] text-sm font-[600] text-amber-700 md:text-base">
                      Cancel Plan
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-blue-400 bg-white p-6">
            <div className="mb-4 flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Cancel Subscription
              </h3>
            </div>

            <p className="mb-6 text-gray-600">
              Are you sure you want to cancel your subscription? You'll continue
              to have access until
              {subscriptionInfo.nextBilling &&
                ` ${formatDate(subscriptionInfo.nextBilling)}`}
              .
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 rounded-lg border bg-blue-700 px-4 py-2 transition-colors hover:bg-blue-500"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSeting;
