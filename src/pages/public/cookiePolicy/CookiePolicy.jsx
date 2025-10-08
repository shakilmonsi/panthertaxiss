import {
  Cookie,
  Shield,
  BarChart,
  Target,
  Settings,
  Info,
  Code,
} from "lucide-react";

const CookiePolicyPage = () => {
  return (
    <div className="mx-auto min-h-screen max-w-7xl p-6">
      {/* Header */}
      <div className="mb-8 rounded-2xl border border-blue-100 bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-center gap-4">
          <div className="rounded-lg bg-blue-600 p-3">
            <Cookie className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cookie Policy</h1>
            <p className="mt-1 text-gray-600">TaxiLog UK</p>
          </div>
        </div>
      </div>

      {/* What are cookies Section */}
      <div className="mb-8 rounded-2xl border border-blue-100 bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-2">
            <Info className="text-blue-600" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            What are cookies?
          </h2>
        </div>

        <p className="text-lg text-gray-700">
          Cookies are small text files stored on your device that help us
          improve your experience on our site.
        </p>
      </div>

      {/* Types of cookies Section */}
      <div className="mb-8">
        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
          <Cookie className="text-gray-700" size={28} />
          Types of cookies TaxiLog UK use:
        </h2>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Essential cookies */}
          <div className="rounded-lg border border-blue-100 bg-white p-8 shadow-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2">
                <Shield className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Essential cookies
              </h3>
            </div>

            <p className="mb-4 text-gray-700">
              Keep you logged in and allow the site to function properly. These
              are always active.
            </p>

            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="font-medium text-green-800">
                  Always Active
                </span>
              </div>
            </div>
          </div>

          {/* Analytics cookies */}
          <div className="rounded-lg border border-blue-100 bg-white p-8 shadow-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <BarChart className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Analytics cookies
              </h3>
            </div>

            <p className="mb-4 text-gray-700">
              Collect information about how you use TaxiLog UK, helping us
              improve our service. These require your consent.
            </p>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <span className="font-medium text-blue-800">
                  Requires Consent
                </span>
              </div>
            </div>
          </div>

          {/* Marketing cookies */}
          <div className="rounded-lg border border-blue-100 bg-white p-8 shadow-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2">
                <Target className="text-purple-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Marketing cookies
              </h3>
            </div>

            <p className="mb-4 text-gray-700">
              Used only if you opt in, to provide relevant offers or promotions.
            </p>

            <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                <span className="font-medium text-purple-800">Opt-in Only</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Sections */}
      <div className="space-y-8">
        {/* Managing cookies Section */}
        <div className="rounded-lg border border-blue-100 bg-white p-8 shadow-xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-orange-100 p-2">
              <Settings className="text-orange-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Managing cookies
            </h2>
          </div>

          <p className="text-lg text-gray-700">
            You can disable cookies in your browser at any time, but some
            features of the site may not work correctly without them. For
            detailed instructions on managing cookies, see your browser
            settings.
          </p>
        </div>

        {/* More information Section */}
        <div className="rounded-lg border border-blue-100 bg-white p-8 shadow-xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-gray-100 p-2">
              <Info className="text-gray-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              More information
            </h2>
          </div>

          <p className="text-lg text-gray-700">
            For more details on how we handle your personal data, see our{" "}
            <a
              href="#"
              className="font-medium text-blue-600 underline hover:text-blue-800"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>

        {/* Cookie Banner Text Section */}
        <div className="rounded-lg border border-blue-100 bg-white p-8 shadow-xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-indigo-100 p-2">
              <Code className="text-indigo-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-[#FA0711]">Banner Text:</h2>
          </div>

          <div className="rounded-r-lg border-l-4 border-indigo-500 bg-gray-50 p-6">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-[#FA0711] italic">
                "TaxiLog UK uses cookies to improve your experience. Some are
                essential for site functionality, and others help us improve our
                service. By continuing to use the site, you consent to our use
                of cookies."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicyPage;
