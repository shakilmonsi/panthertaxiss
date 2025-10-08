import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const ContactView = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const FORMSPREE_URL = "https://formspree.io/f/mkgzbkwl";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, phone, message }),
      });

      if (response.ok) {
        toast.success("Message sent successfully!");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setMessage("");
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again later.");
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-10 sm:px-5 sm:py-16 lg:px-6">
      {/* Header */}
      <div className="mb-12 text-center lg:mb-20">
        <h1 className="mb-2 text-3xl font-semibold text-blue-600 sm:text-4xl lg:text-5xl lg:font-bold">
          Contact Us
        </h1>
        <p className="mx-auto max-w-xl text-base text-gray-700 sm:text-lg">
          At <strong>TaxiLog UK</strong>, we’re here to make things simple.
          Whether you’re a driver looking for support, a customer with a
          question, or a business partner wanting to connect, our team is ready
          to help.
        </p>
        <p className="text-gray-700">
            📧 Email us directly:{" "}
            <a
              href="mailto:support@taxiloguk.co.uk"
              className="text-blue-600 underline"
            >
              support@taxiloguk.co.uk
            </a>
          </p>
      </div>

      {/* Form + Image Container */}
      <div className="flex flex-col items-stretch gap-8 rounded-2xl border border-gray-200 bg-white/10 p-6 backdrop-blur-md sm:p-8 lg:flex-row lg:gap-12">
        {/* Form */}
        <div className="flex flex-1 flex-col">
          <form className="flex flex-1 flex-col gap-4" onSubmit={handleSubmit}>
            {/* Name Fields */}
            <div className="flex flex-col gap-4 lg:flex-row">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />

            {/* Phone */}
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            {/* Message */}
            <textarea
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="h-28 rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white transition duration-200 hover:bg-blue-700 sm:mt-0 lg:mt-12"
            >
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        {/* Image - hidden on small devices */}
        <div className="hidden w-[500px] flex-shrink-0 overflow-hidden rounded-xl lg:block">
          <img
            src="/image/about.png"
            alt="Contact Us"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <Toaster position="top-right" />
    </div>
  );
};

export default ContactView;
