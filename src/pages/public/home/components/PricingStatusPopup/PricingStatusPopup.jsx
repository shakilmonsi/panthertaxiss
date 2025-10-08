// ./components/PricingStatusPopup.jsx

import React from "react";

const PricingStatusPopup = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null;

  return (
    // Modal Backdrop
    <div
      className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center px-4 py-5 backdrop-blur-sm sm:px-6 md:px-8 lg:px-10"
      onClick={onClose}
    >
      {/* Modal Content */}
      <div
        className="mx-4 w-full max-w-md scale-100 transform rounded-xl border border-blue-400 bg-white p-6 shadow-2xl transition-all duration-300"
        onClick={(e) => e.stopPropagation()} // Stop propagation to prevent closing when clicking inside
      >
        <div className="flex flex-col items-center text-center">
          {/* Icon/Emoji */}
          <div className="mb-4 text-5xl font-bold text-red-500">⚠️</div>

          {/* Title */}
          <h3 className="mb-2 text-2xl font-bold text-gray-900">
            {content.title || "Process could not be completed"}
          </h3>

          {/* Message */}
          <p className="mb-6 text-base text-gray-600">
            {content.message || "An unexpected issue occurred."}
          </p>

          {/* Action Button */}
          {content.action && (
            <button
              onClick={content.action}
              className="mb-3 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              {content.actionText || "OK"}
            </button>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-sm text-gray-500 transition-colors hover:text-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingStatusPopup;
