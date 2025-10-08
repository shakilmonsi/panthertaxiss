import React from "react";
import { FaCheck } from "react-icons/fa";

const premiumPlanData = [
  {
    id: 1,
    tier: "Premium",
    description:
      "For all individuals and starters who want to start with domaining.",
    price: "$50.00",
    note: "Everything you need to get started.",
    features: [
      "Receive MP3 & WAV",
      "Allow Youtube Use",
      "Limited 500,000 audio/video streams",
      "Upload to Social platforms (TikTok, Instagram etc.)",
      "Release to Streaming Platforms (Spotify, Apple Music etc.)",
    ],
  },
  {
    id: 2,
    tier: "Enterprise",
    description:
      "For all individuals and starters who want to start with domaining.",
    price: "$100.00",
    note: "Use anywhere, without limitations.",
    features: [
      "Youtube Monetize",
      "1,000,000 Streams",
      "Receive Mp3, WAV & Stems",
      "Upload to social media platforms (Instagram, TikTok etc)",
      "Upload to streaming platforms (Apple Music, Spotify etc)",
      "1 Producer Tag on Beat",
    ],
  },
  {
    id: 3,
    tier: "Unlimited",
    description:
      "For all individuals and starters who want to start with domaining.",
    price: "$150.00",
    note: "Complete freedom. No limits.",
    features: [
      "Unlimited Streams",
      "Lifetime Use Rights",
      "Receive All Formats (MP3, WAV, STEMS)",
      "Use in Commercial Projects",
      "No Tag / Tag Removal Rights",
      "Use in Paid Ads / Sync Licensing",
    ],
  },
  {
    id: 4,
    tier: "Unlimited",
    description:
      "For all individuals and starters who want to start with domaining.",
    price: "$150.00",
    note: "Complete freedom. No limits.",
    features: [
      "Unlimited Streams",
      "Lifetime Use Rights",
      "Receive All Formats (MP3, WAV, STEMS)",
      "Use in Commercial Projects",
      "No Tag / Tag Removal Rights",
      "Use in Paid Ads / Sync Licensing",
    ],
  },
  {
    id: 5,
    tier: "License",
    description:
      "For all individuals and starters who want to start with domaining.",
    price: "$150.00",
    note: "Complete freedom. No limits.",
    features: [
      "Unlimited Streams",
      "Lifetime Use Rights",
      "Receive All Formats (MP3, WAV, STEMS)",
      "Use in Commercial Projects",
      "No Tag / Tag Removal Rights",
      "Use in Paid Ads / Sync Licensing",
    ],
  },
  {
    id: 6,
    tier: "Enterprise",
    description:
      "For all individuals and starters who want to start with domaining.",
    price: "$100.00",
    note: "Use anywhere, without limitations.",
    features: [
      "Youtube Monetize",
      "1,000,000 Streams",
      "Receive Mp3, WAV & Stems",
      "Upload to social media platforms (Instagram, TikTok etc)",
      "Upload to streaming platforms (Apple Music, Spotify etc)",
      "1 Producer Tag on Beat",
    ],
  },
];

const LicensingSection = () => {
  return (
    <section className="bg-gradient-to-b from-[#150618] to-[#150620] py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div>
          <h2 className="mb-10 text-center text-white">Licensing Info</h2>
        </div>
        <div className="grid grid-cols-1 gap-8 px-4 md:grid-cols-2 lg:grid-cols-3">
          {premiumPlanData.map((plan) => (
            <div
              key={plan.id}
              className="flex flex-col justify-between rounded-2xl border border-gray-500 bg-[#0A030B] p-6 text-white"
            >
              {/* Top content container */}
              <div className="flex flex-grow flex-col gap-8">
                {/* Tier Badge & Description */}
                <div className="w-30 rounded-md bg-black/20 bg-gradient-to-b from-yellow-700 to-yellow-300 px-3.5 py-1.5">
                  <h3 className="text-center text-sm leading-7 font-semibold text-white">
                    {plan.tier}
                  </h3>
                </div>

                <p className="text-sm font-light text-[#A1A1A1]">
                  {plan.description}
                </p>

                <div className="h-px w-full bg-gray-200 opacity-30" />

                <div className="text-7xl leading-[73.12px] font-semibold">
                  {plan.price}
                </div>
                <p className="text-sm font-semibold text-[#A1A1A1]">
                  {plan.note}
                </p>

                <div className="h-px w-full bg-neutral-500 opacity-30" />

                {/* Features List */}
                <div className="flex flex-col gap-3.5 text-sm text-neutral-400">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <FaCheck className="mt-1 min-w-[1.2rem] text-[#A1A1A1]" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom CTA Button */}
              <button className="mt-8 w-full rounded-lg bg-gradient-to-b from-orange-200 to-yellow-500 px-12 py-3 text-black">
                Read License
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LicensingSection;
