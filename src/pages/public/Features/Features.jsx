// src/components/FeaturesSection.jsx

import React from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const features = [
  {
    title: "Daily Vehicle Checks",
    description:
      "Complete your mandatory checklist in seconds, with date & time auto-filled.",
  },
  {
    title: "Saved History",
    description:
      "All your checks are stored securely, ready for you at the council’s request.",
  },
  {
    title: "Document Storage",
    description:
      "Upload and keep track of your badge, insurance, vehicle licence, MOT, DBS update service and more in one central place.",
  },
  {
    title: "Expiry Reminders",
    description:
      "Get alerts before your important documents expire (so you never miss a renewal).",
  },
  {
    title: "Useful Links",
    description:
      "Quick access to council resources, apps, and other useful tools.",
  },
  {
    title: "Secure & Compliant",
    description: "Data stored safely in the UK/EU under GDPR rules.",
  },
  {
    title: "Free Trial",
    description: "7 days free trial",
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-white px-6 py-16 sm:px-10 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
          Features
        </h2>
        <ul className="grid gap-8 sm:grid-cols-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-4">
              <CheckCircleIcon className="h-6 w-6 flex-shrink-0 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {feature.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FeaturesSection;
