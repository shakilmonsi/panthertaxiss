import { Users, Mail } from "lucide-react";

export default function AboutUs() {
  const sections = [
    {
      title: "Our Mission",
      icon: Users,
      content: [
        "Save drivers time",
        "Keep them compliant",
        "Give peace of mind on the road",
      ],
    },
  ];

  return (
    <div className="mx-auto flex lg:min-h-screen max-w-7xl justify-center px-3 py-6 sm:px-4 md:px-6">
      <div className="relative w-full max-w-7xl">
        <div className="rounded-2xl border-blue-100 bg-white">
          {/* Header */}
          <div className="mb-6 flex items-center gap-4">
            <div className="w-full">
              <h1 className="mb-2 text-4xl font-bold text-gray-900 sm:text-5xl">
                About Us{" "}
                <span className="block text-2xl font-bold text-blue-600 sm:inline sm:text-3xl">
                  TaxiLog UK
                </span>
              </h1>

              <div className="flex w-full flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="mb-4 leading-relaxed text-gray-700">
                    At <strong>TaxiLog UK</strong>, we understand the challenges
                    taxi drivers face in keeping up with daily vehicle checks
                    and compliance paperwork. Councils require strict
                    record-keeping, but for many drivers, that means piles of
                    forms, lost documents, and wasted time.
                  </p>
                  <p className="mb-4 leading-relaxed text-gray-700">
                    We created <strong>TaxiLog UK</strong> to make compliance
                    simple, fast, and stress-free. Our platform lets drivers
                    complete their daily vehicle checks in seconds, securely
                    store important documents, and access their history anytime
                    if asked by the council.
                  </p>
                  <p className="mb-4 leading-relaxed text-gray-700">
                    Whether you’re managing your badge, MOT, insurance, or
                    simply ticking off your daily checklist,{" "}
                    <strong>TaxiLog UK</strong> keeps everything organised in
                    one secure place.
                  </p>
                </div>
                <div>
                  <img
                    src="/image/about.png"
                    alt="Taxi car"
                    className="rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="mb-6 space-y-6">
            {sections.map((section, i) => {
              const Icon = section.icon;
              return (
                <div
                  key={i}
                  className="rounded-xl border border-gray-100 bg-blue-50 p-4 shadow-lg sm:p-6"
                >
                  <div className="mb-4 flex items-center gap-4">
                    <div className="rounded-lg bg-blue-100 p-2">
                      <Icon className="h-5 w-5 text-blue-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {section.title}
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {section.content.map((item, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Contact */}
          <div className="mb-6 rounded-xl border border-blue-100 bg-white p-4 shadow-lg sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <Mail className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Have Questions?
              </h2>
            </div>
            <p className="text-gray-700">
              We’re here to help. Contact us at:{" "}
              <a
                href="mailto:support@taxiloguk.co.uk"
                className="text-indigo-600 hover:underline"
              >
                support@taxiloguk.co.uk
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
