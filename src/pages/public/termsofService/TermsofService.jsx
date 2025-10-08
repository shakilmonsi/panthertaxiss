import {
  FileText,
  User,
  CreditCard,
  XCircle,
  UserCheck,
  Shield,
  Scale,
} from "lucide-react";

export default function TermsOfService() {
  const sections = [
    {
      title: "Accounts",
      icon: User,
      content: [
        "You must provide accurate details.",
        "Keep your login secure.",
      ],
    },
    {
      title: "Subscriptions",
      icon: CreditCard,
      content: [
        "Monthly, and yearly plans are available.",
        "We may offer a free trial period for new users. The duration and availability of any trial period are at our discretion",
        "Payments are handled securely via Stripe.",
        "We reserve the right to modify subscription fees at any time. Subscribers will be notified of changes before they take effect",
      ],
    },
    {
      title: "Cancellations & Refunds",
      icon: XCircle,
      content: [
        "Subscriptions renew automatically unless cancelled.",
        "You can cancel anytime in your account.",
        "Refunds are only given where legally required or in cases of error.",
      ],
    },
    {
      title: "User Responsibilities",
      icon: UserCheck,
      content: [
        "Complete check forms honestly.",
        "We do not verify user-submitted documents or information.",
        "We do not verify expiry date entries.",
        "Misuse may result in account suspension.",
      ],
    },
    {
      title: "Our Responsibilities",
      icon: Shield,
      content: [
        "We provide the service with reasonable care.",
        "We are not liable for fines, penalties, or loss of earnings caused by incorrect or incomplete use.",
      ],
    },
  ];

  return (
    <div className="mx-auto min-h-screen max-w-7xl p-6">
      {/* Header */}
      <div className="mb-8 rounded-2xl border border-blue-100 bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-center gap-4">
          <div className="rounded-full bg-blue-600 p-3">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Terms of Service
            </h1>
            <p className="font-medium text-blue-600">TaxiLog UK</p>
          </div>
        </div>

        <div className="mb-6 rounded-r-lg border-l-4 border-blue-400 bg-blue-100 p-4">
          <p className="text-sm text-blue-800">
            <strong>Effective Date:</strong> 10/09/2025
          </p>
        </div>

        <p className="leading-relaxed text-gray-700">
          By using TaxiLog UK, you agree to these terms.
        </p>
      </div>

      {/* Terms Sections */}
      <div className="mb-8 space-y-6">
        {sections.map((section, index) => {
          const IconComponent = section.icon;

          return (
            <div
              key={index}
              className="rounded-xl border border-gray-100 bg-white p-6 shadow-lg"
            >
              <div className="mb-4 flex items-center gap-4">
                <div className="rounded-lg bg-blue-100 p-2">
                  <IconComponent className="h-5 w-5 text-blue-500" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {section.title}
                </h2>
              </div>

              <ul className="space-y-3">
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-3">
                    <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Governing Law Section */}
      <div className="mb-8 rounded-xl border border-blue-100 bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center gap-3">
          <Scale className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Governing Law</h2>
        </div>
        <p className="text-gray-700">These terms are governed by UK law.</p>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Last updated: September 3, 2025 • TaxiLog UK</p>
      </div>
    </div>
  );
}
