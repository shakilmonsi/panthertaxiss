import { PiSubtitlesThin } from "react-icons/pi";
const Settings = () => {
  return (
    <div className="flex w-full flex-col items-center bg-white px-4 sm:px-6 md:px-8 lg:px-10 sm:mt-2 mb-4 lg:mt-0 md:mt-[64px] mt-[72px]">
      <div className="w-full px-4 py-2.5">
        <div className="flex flex-col gap-2 md:gap-3">
          <h1 className="font-['Roboto'] text-2xl font-bold text-neutral-800 md:text-3xl">
            Settings
          </h1>
          <p className="font-['Roboto'] text-sm font-normal text-neutral-600 md:text-base">
            Manage your subscription.
          </p>
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-4 rounded-2xl border border-zinc-300 bg-[#E8E9E9] p-4 md:gap-5 md:p-6 lg:p-8">
        <div className="flex w-full justify-start">
          <div className="flex w-full items-center justify-center gap-2 border-b-2 border-blue-600 bg-sky-100 px-4 py-2 md:w-80 md:gap-2.5 md:px-6 md:py-3">
            <PiSubtitlesThin className="h-6 w-6 text-neutral-800 md:h-7 md:w-7" />
            <p className="font-['Roboto'] text-sm font-[600] text-neutral-800 md:text-base">
              Subscription
            </p>
          </div>
        </div>
        <p className="font-['Roboto'] text-base font-[600] text-neutral-800 md:text-lg">
          Subscription & Payment
        </p>
        <div className="flex w-full flex-col items-start gap-4 rounded-xl border border-neutral-300 bg-white p-4 md:gap-6 md:p-6">
          <div className="flex w-full flex-col items-start gap-3 md:gap-4">
            <p className="w-full font-['Roboto'] text-sm font-normal text-neutral-600 md:text-base">
              Subscription & Payment
            </p>
            <div className="flex w-full flex-col items-start gap-2 rounded-lg border border-gray-200 bg-slate-50 px-3 py-2 md:flex-row md:items-center md:gap-1 md:px-4">
              <div className="flex flex-1 flex-col items-start gap-1">
                <p className="font-['Roboto'] text-base font-normal text-neutral-800">
                  Current Plan
                </p>
                <p className="font-['Roboto'] text-sm font-normal text-neutral-600">
                  Pro Plan
                </p>
              </div>
              <button className="flex h-10 w-full items-center justify-center rounded-lg border border-blue-600 bg-blue-200 p-2.5 md:h-12 md:w-40">
                <span className="font-['Roboto'] text-base font-[600] text-blue-600">
                  Upgrade
                </span>
              </button>
            </div>
          </div>
          <div className="flex w-full flex-col items-start gap-3 md:gap-4">
            <p className="w-full font-['Roboto'] text-sm font-normal text-neutral-600 md:text-base">
              Payment Method
            </p>
            <div className="flex w-full flex-col items-start gap-2 rounded-lg border border-gray-200 bg-slate-50 px-3 py-2 md:flex-row md:items-center md:gap-1 md:px-4">
              <div className="flex flex-1 flex-col items-start gap-1">
                <p className="font-['Roboto'] text-base font-normal text-neutral-600">
                  Visa ending in **** 4242
                </p>
              </div>
              <button className="flex h-10 w-full items-center justify-center rounded-lg p-2.5 md:h-12 md:w-40">
                <span className="font-['Roboto'] text-base font-[600] text-blue-600">
                  Update
                </span>
              </button>
            </div>
          </div>
          <div className="flex w-full flex-col items-start gap-3 md:gap-4">
            <p className="w-full font-['Roboto'] text-sm font-normal text-neutral-600 md:text-base">
              Billing History
            </p>
            <div className="flex w-full flex-col items-start gap-2 rounded-lg border border-gray-200 bg-slate-50 px-3 py-2 md:px-4">
              <div className="flex w-full flex-col items-start justify-between gap-2 md:flex-row md:items-center md:gap-1">
                <div className="flex flex-col items-start gap-1">
                  <p className="font-['Roboto'] text-sm font-normal text-neutral-600">
                    Invoice #1025
                  </p>
                  <p className="font-['Roboto'] text-sm font-normal text-neutral-600">
                    Invoice #1024
                  </p>
                </div>
                <div className="flex flex-col items-start gap-1 md:items-end md:gap-3">
                  <p className="font-['Roboto'] text-sm font-normal text-neutral-600">
                    $49.00 - Dec 1, 2023
                  </p>
                  <p className="font-['Roboto'] text-sm font-normal text-neutral-600">
                    $49.00 - Nov 1, 2023
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col items-start gap-3 md:gap-4">
            <div className="flex w-full flex-col items-start gap-2 rounded-lg border border-amber-400 bg-orange-100 px-3 py-2 md:flex-row md:items-center md:gap-1 md:px-4">
              <div className="flex flex-1 flex-col items-start justify-center gap-1">
                <p className="font-['Roboto'] text-sm font-normal text-amber-400 md:text-base">
                  Need a break? You can cancel your subscription at any time.
                </p>
              </div>
              <button className="flex h-8 w-full items-center justify-center rounded-lg border border-orange-200 bg-amber-100 p-2.5 md:h-10 md:w-40">
                <span className="font-['Roboto'] text-base font-[600] text-yellow-600">
                  Cancel
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
