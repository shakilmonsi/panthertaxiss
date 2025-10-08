import { FiCheckCircle } from "react-icons/fi";

function PurchaseSuccessModal({ onClose }) {
  return (
    <div className="bg-opacity-50 fixed inset-0 flex items-center justify-center backdrop-blur-sm">
      <div className="z-50 flex h-[421.961px] w-[674px] flex-col items-center justify-center rounded-[27.596px] border-[0.167px] border-[#F5DEB3] bg-white p-6 shadow-lg">
        {/* Checkmark Icon */}
        <div className="mb-4 flex justify-center">
          <FiCheckCircle className="h-16 w-16 text-yellow-500" />
        </div>

        {/* Success Message */}
        <h2 className="mb-2 text-center font-['Poppins'] text-2xl font-[700] text-[#DAA520]">
          Your Purchase Was Successful!
        </h2>

        {/* Thank You Message */}
        <p className="mb-2 text-center font-['Poppins'] text-base font-[600] text-[#4A4A4A]">
          Thank You For Buying Track
        </p>
        <p className="mb-6 text-center font-['Poppins'] text-base font-[400] text-[#4A4A4A]">
          - We Hope You Enjoy The Vibes!
        </p>

        {/* Back To Home Button */}
        <div
          data-property-1="Default"
          data-show-arrow-up-right="false"
          data-show-button="true"
          className="inline-flex h-[50px] w-[300px] items-center justify-center gap-1 overflow-hidden rounded-lg bg-gradient-to-b from-orange-200 to-yellow-500 px-12 py-3"
          onClick={onClose}
        >
          <div className="text-center font-['Plus_Jakarta_Sans'] text-base leading-normal font-semibold text-gray-950 capitalize">
            Back to home
          </div>
        </div>
      </div>
    </div>
  );
}

export default PurchaseSuccessModal;
