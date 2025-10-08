import React, { useState, useEffect, useRef } from "react";

const AudioWaveformPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playedBarsCount, setPlayedBarsCount] = useState(0);
  const animationFrameId = useRef(null);
  const barHeights = useRef([]);
  const totalBars = 75;

  useEffect(() => {
    if (barHeights.current.length === 0) {
      barHeights.current = Array.from({ length: totalBars }).map(() =>
        getRandomHeight(),
      );
    }
  }, []);

  const getRandomHeight = () => {
    return Math.floor(Math.random() * (24 - 8 + 1)) + 8;
  };

  useEffect(() => {
    let lastUpdateTime = 0;
    const updateInterval = 100;

    const animateBars = (currentTime) => {
      if (!lastUpdateTime) lastUpdateTime = currentTime;
      const deltaTime = currentTime - lastUpdateTime;

      if (deltaTime > updateInterval) {
        setPlayedBarsCount((prevCount) => {
          if (prevCount < totalBars) {
            barHeights.current = barHeights.current.map(() =>
              getRandomHeight(),
            );
            lastUpdateTime = currentTime;
            return prevCount + 1;
          } else {
            setIsPlaying(false);
            return 0;
          }
        });
      }
      animationFrameId.current = requestAnimationFrame(animateBars);
    };

    if (isPlaying) {
      animationFrameId.current = requestAnimationFrame(animateBars);
    } else {
      cancelAnimationFrame(animationFrameId.current);
    }

    // Cleanup function
    return () => cancelAnimationFrame(animationFrameId.current);
  }, [isPlaying, totalBars]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
    if (!isPlaying && playedBarsCount === totalBars) {
      setPlayedBarsCount(0);
      barHeights.current = Array.from({ length: totalBars }).map(() =>
        getRandomHeight(),
      );
    }
  };

  // Generate all bars dynamically based on playedBarsCount and animated heights
  const allBars = Array.from({ length: totalBars }).map((_, index) => {
    const isPlayed = index < playedBarsCount;
    const barColorClass = isPlayed ? "bg-[#E2B64E]" : "bg-gray-300";

    return (
      <div
        key={`bar-${index}`}
        className={`w-0.5 rounded-full ${barColorClass}`}
        style={{
          height: `${barHeights.current[index] || getRandomHeight()}px`,
        }}
      ></div>
    );
  });

  return (
    <div className="flex items-center space-x-1.5 rounded-lg bg-gray-900 p-4">
      {/* Play/Pause Button */}
      <div
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-700"
        onClick={togglePlay}
      >
        {isPlaying ? (
          // Pause icon
          <svg
            className="h-4 w-4 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        ) : (
          // Play icon
          <svg
            className="h-4 w-4 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </div>

      {/* Waveform Container */}
      <div className="flex items-center space-x-0.5">
        {allBars} {/* Render all bars here */}
      </div>
    </div>
  );
};

export default AudioWaveformPlayer;
