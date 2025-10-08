export const CssAnimation = () => {
  return (
    <style>{`
      @keyframes slide-in {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      .animate-slide-in {
        animation: slide-in 0.3s ease-out;
      }

      /* Custom scrollbar for dropdown */
      .max-h-[300px]::-webkit-scrollbar {
        width: 6px;
      }
      .max-h-[300px]::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
      }
      .max-h-[300px]::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 3px;
      }
      .max-h-[300px]::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
      }
      `}</style>
  );
};
