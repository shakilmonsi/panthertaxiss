import React from "react";
import {
  FaRandom,
  FaStepBackward,
  FaStepForward,
  FaVolumeUp,
} from "react-icons/fa";
import { FaPause } from "react-icons/fa6"; // For main player pause button
import { FiPlay } from "react-icons/fi"; // For main player play button
import { FaRedoAlt } from "react-icons/fa";
import { BsMusicNoteList } from "react-icons/bs";

const PlayerControls = ({
  currentPlayingSong,
  isPlaying,
  togglePlayPause,
  playPreviousSong,
  playNextSong,
  volume,
  handleVolumeChange,
  isShuffle,
  toggleShuffle,
  repeatMode,
  toggleRepeat,
}) => {
  if (!currentPlayingSong) return null; // গান না থাকলে প্লেয়ার কন্ট্রোল দেখানোর দরকার নেই

  return (
    <div className="flex items-center gap-4 sm:gap-6">
      {/* Shuffle Button */}
      <button
        onClick={toggleShuffle}
        className={`text-white transition-colors hover:text-white/80 ${
          isShuffle ? "text-green-400" : ""
        }`}
      >
        <FaRandom size={20} />
      </button>

      {/* Previous Song Button */}
      <button
        onClick={playPreviousSong}
        className="text-white transition-colors hover:text-white/80"
      >
        <FaStepBackward size={20} />
      </button>

      {/* Play/Pause Button (Main) */}
      <button
        onClick={togglePlayPause}
        className="text-white transition-transform hover:scale-110"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white sm:h-12 sm:w-12">
          {isPlaying ? (
            <FaPause size={20} className="text-black" />
          ) : (
            <FiPlay size={20} className="text-black" />
          )}
        </div>
      </button>

      {/* Next Song Button */}
      <button
        onClick={playNextSong}
        className="text-white transition-colors hover:text-white/80"
      >
        <FaStepForward size={20} />
      </button>

      {/* Repeat Button */}
      <button
        onClick={toggleRepeat}
        className={`relative text-white transition-colors hover:text-white/80 ${
          repeatMode !== "off" ? "text-green-400" : ""
        }`}
      >
        <FaRedoAlt size={20} />
        {repeatMode === "one" && (
          <span className="absolute -right-1 -bottom-1 text-xs font-bold">
            1
          </span>
        )}
      </button>

      {/* Volume Control */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button className="hidden text-white transition-colors hover:text-white/80 sm:block">
          <FaVolumeUp size={20} />
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="h-1 w-16 cursor-pointer appearance-none rounded-full bg-stone-500 sm:w-24"
          style={{
            background: `linear-gradient(to right, #ffffff ${
              volume * 100
            }%, #6b7280 ${volume * 100}%)`,
            WebkitAppearance: "none",
            appearance: "none",
            outline: "none",
          }}
        />
      </div>

      {/* Playlist Icon (no functionality yet) */}
      <button className="hidden text-white transition-colors hover:text-white/80 sm:block">
        <BsMusicNoteList size={20} />
      </button>
    </div>
  );
};

export default PlayerControls;
