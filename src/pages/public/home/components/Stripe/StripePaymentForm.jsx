// src/components/StripePaymentForm/StripePaymentForm.jsx (একটি নতুন ফাইল)

import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";

// এটি শুধুমাত্র স্টাইল করার জন্য, আপনি আপনার নিজের স্টাইল ব্যবহার করতে পারেন
const CARD_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#c4f0ff",
      color: "#000",
      fontWeight: "500",
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": { color: "#fce883" },
      "::placeholder": { color: "#87bbfd" },
    },
    invalid: {
      iconColor: "#ffc7ee",
      color: "#ffc7ee",
    },
  },
};

// parent-এর handlePayment ফাংশনটি prop হিসেবে আসবে
const StripePaymentForm = ({ onPaymentSuccess, plan, buttonText, isTrial }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    const cardElement = elements.getElement(CardElement);

    try {
      // ১. Payment Method তৈরি করা (টোকেনাইজেশন)
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      // ২. PaymentMethodId সহ main logic-কে কল করা
      await onPaymentSuccess(plan, paymentMethod.id, isTrial);
    } catch (err) {
      console.error("Stripe Error:", err);
      toast.error("পেমেন্ট প্রক্রিয়ায় একটি সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="rounded-lg border bg-white p-3 shadow-sm">
        {/* Stripe-এর কার্ড ইনপুট ফিল্ড */}
        <CardElement options={CARD_OPTIONS} />
      </div>

      <button
        type="submit"
        className="inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-lg bg-blue-600 p-2.5 transition-colors hover:bg-blue-700 disabled:opacity-50"
        disabled={!stripe || loading}
      >
        <span className="text-base font-[600] text-white">
          {loading ? "প্রক্রিয়া চলছে..." : buttonText}
        </span>
      </button>
    </form>
  );
};

export default StripePaymentForm;
