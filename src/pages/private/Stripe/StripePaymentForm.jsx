import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { useAuth } from "../../../featured/auth/AuthContext";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  },
};

const StripePaymentForm = ({ plan, onPaymentSuccess, isTrial, buttonText }) => {
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();

  useEffect(() => {
    if (stripe && elements) {
      setIsReady(true);
      console.log(
        "🟢 [StripeForm] Stripe and Elements are ready! Button should be enabled.",
      );
    } else {
      setIsReady(false);
    }
  }, [stripe, elements]);

  const handleSubmit = async (event) => {
    if (event) event.preventDefault();

    console.log(
      "➡️ [StripeForm] Button click handler activated. Starting Stripe process...",
    );

    if (!isReady) {
      toast.error("Stripe is not fully loaded. Please wait a moment.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement || cardElement._empty || !cardElement._complete) {
      toast.error("Please provide complete and valid card information.");
      return;
    }

    setLoading(true);

    try {
      console.log("➡️ [StripeForm] Calling stripe.createPaymentMethod...");
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: { email: user?.email, name: user?.name || "Customer" },
      });
      console.log(
        "⬅️ [StripeForm] Received response from stripe.createPaymentMethod.",
      );

      if (error) {
        toast.error(error.message);
        console.error(
          "❌ [StripeForm Error] Payment Method Creation Failed:",
          error,
        );
        return;
      }

      console.log(
        "✅ [StripeForm] Payment Method successfully created. ID:",
        paymentMethod.id,
      );

      console.log("➡️ [StripeForm] Calling onPaymentSuccess to hit API...");
      await onPaymentSuccess(plan, paymentMethod.id, isTrial);
      console.log("✅ [StripeForm] onPaymentSuccess call finished.");
    } catch (error) {
      console.error("💣 [StripeForm Catch Error]", error);
      toast.error(
        "An unexpected error occurred during the payment processing.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="relative z-20 flex flex-col gap-4">
      <div className="relative z-30 rounded-lg border border-gray-300 bg-gray-50 p-3">
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!isReady || loading}
        style={{ zIndex: 9999, pointerEvents: "auto", position: "relative" }}
        className="inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-lg bg-blue-600 p-2.5 text-base font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : buttonText}
      </button>

      {isTrial && (
        <p className="mt-1 text-center text-xs text-gray-500">
          You will not be charged today. We only verify the payment method for
          the trial.
        </p>
      )}
    </form>
  );
};

export default StripePaymentForm;
