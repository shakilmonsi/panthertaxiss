import React from "react";

const ProgressBar = ({
  currentTime,
  duration,
  handleProgressChange,
  formatTime,
}) => {
  return (
    <div className="absolute inset-x-0 top-0">
      <input
        type="range"
        min="0"
        max={duration || 0}
        value={currentTime}
        onChange={handleProgressChange}
        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-stone-500"
        style={{
          background: `linear-gradient(to right, #ffffff ${
            (currentTime / duration) * 100
          }%, #6b7280 ${(currentTime / duration) * 100}%)`,
          WebkitAppearance: "none",
          appearance: "none",
          outline: "none",
        }}
      />
      {/* Optional: Show time below the progress bar for better UX */}
      <div className="flex justify-between px-4 text-xs text-neutral-400">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
