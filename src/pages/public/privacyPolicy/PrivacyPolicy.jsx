import { Shield, Database, FileText, Clock, Users, Mail } from "lucide-react";

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "What We Collect",
      icon: Database,
      content: [
        "Driver info (name, email, vehicle reg, plate no., badge no.)",
        "Daily check records (with date/time)",
        "Uploaded documents (which may include your name, address, date of birth, and other details shown on your licence, insurance, or MOT)",
        "Subscription/payment details (via Stripe – we don't store card numbers)",
      ],
    },
    {
      title: "How We Use It",
      icon: FileText,
      content: [
        "To provide and improve the service",
        "To store records for compliance purposes",
        "To send reminders about expiring documents",
        "To manage subscriptions and payments",
      ],
    },
    {
      title: "How Long We Keep It",
      icon: Clock,
      content: [
        "Daily records: 1 year",
        "Documents: until user deletes/removes them",
        "Account data: deleted within 12 months of cancellation",
      ],
    },
  ];

  return (
    <div className="mx-auto min-h-screen max-w-7xl p-6">
      {/* Header */}
      <div className="mb-8 rounded-2xl border border-blue-100 bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-center gap-4">
          <div className="rounded-full bg-blue-600 p-3">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="font-medium text-blue-600">TaxiLog UK</p>
          </div>
        </div>

        <div className="mb-6 rounded-r-lg border-l-4 border-blue-400 bg-blue-100 p-4">
          <p className="text-sm text-blue-800">
            <strong>Effective Date:</strong> 03/09/2025
          </p>
        </div>

        <p className="mb-4 leading-relaxed text-gray-700">
          TaxiLog UK ("we", "our", "us") provides a platform to help licensed
          taxi drivers complete daily vehicle checks, store compliance records,
          and to store and self-manage important documents.
        </p>
        <p className="leading-relaxed text-gray-700">
          We respect your privacy and handle your data in line with UK GDPR.
        </p>
      </div>

      {/* Privacy Sections - No Dropdown */}
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

      {/* Your Rights Section */}
      <div className="mb-6 rounded-xl border border-blue-100 bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center gap-3">
          <Users className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Your Rights</h2>
        </div>

        <p className="text-gray-700">
          You may access, update, or request deletion of your data. Contact us
          at:{" "}
          <a
            href="mailto:support@taxiloguk.co.uk"
            className="text-indigo-600 hover:underline"
          >
            support@taxiloguk.co.uk
          </a>
        </p>
      </div>

      {/* Complaints Section */}
      <div className="mb-8 rounded-xl border border-orange-100 bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center gap-3">
          <Mail className="h-6 w-6 text-orange-600" />
          <h2 className="text-xl font-semibold text-gray-900">Complaints</h2>
        </div>
        <p className="text-gray-700">
          You may also complain to the Information Commissioner's Office:
          <a
            href="https://ico.org.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 font-medium text-blue-600 underline hover:text-blue-800"
          >
            ico.org.uk
          </a>
        </p>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Last updated: September 3, 2025 • TaxiLog UK</p>
      </div>
    </div>
  );
}
