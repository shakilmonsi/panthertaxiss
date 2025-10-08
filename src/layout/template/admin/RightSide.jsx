import React, { useEffect, useRef, useState } from "react";
import { FaChevronRight, FaCrown } from "react-icons/fa6";
import { MdFileUpload } from "react-icons/md";
const recentUploadsData = [
  {
    title: "Perfect",
    artist: "Ed Sheeran",
    time: "2min ago",
    albumArt: "https://placehold.co/44x44/3498DB/FFFFFF?text=P",
  },
  {
    title: "Roman Picisan",
    artist: "Hanin Dhiya",
    time: "8min ago",
    albumArt: "https://placehold.co/44x44/9B59B6/FFFFFF?text=RP",
  },
  {
    title: "Tittle (Deluxe)",
    artist: "Meghan Trainor",
    time: "2hr ago",
    albumArt: "https://placehold.co/44x44/E74C3C/FFFFFF?text=T",
  },
  {
    title: "Shiver",
    artist: "Ed Sheeran",
    time: "6hr ago",
    albumArt: "https://placehold.co/44x44/FFC107/000000?text=S",
  },
  {
    title: "Feel Something",
    artist: "Jaymes Young",
    time: "11hr ago",
    albumArt: "https://placehold.co/44x44/795548/FFFFFF?text=FS",
  },
  {
    title: "Shape of You",
    artist: "Ed Sheeran",
    time: "1day ago",
    albumArt: "https://placehold.co/44x44/2ECC71/FFFFFF?text=SOY",
  },
  {
    title: "Bad Habits",
    artist: "Ed Sheeran",
    time: "1day ago",
    albumArt: "https://placehold.co/44x44/F1C40F/000000?text=BH",
  },
];

const RightSide = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target))
        setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  return (
    <aside className="w-70 flex-shrink-0 flex-col space-y-6 p-4 text-white lg:flex">
      <div className="relative" ref={dropdownRef}>
        <div
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex cursor-pointer items-center justify-between rounded-lg hover:bg-white/5"
        >
          <div className="flex items-center gap-3">
            <img
              src="https://placehold.co/48x48/ffffff/000?text=JR"
              alt="User Avatar"
              className="h-12 w-12 rounded-full"
            />
            <div>
              <p className="font-semibold text-white">James Rodriguez</p>
              <div className="flex items-center gap-1 text-xs text-neutral-400">
                <span>Admin</span> <FaCrown className="text-amber-400" />
              </div>
            </div>
          </div>
          <FaChevronRight
            className={`transition-transform ${isDropdownOpen ? "rotate-90" : ""}`}
          />
        </div>

        {isDropdownOpen && (
          <div className="absolute top-full right-0 z-20 mt-2 w-48 rounded-lg bg-neutral-700 shadow-lg">
            <button
              onClick={() => alert("Logging out...")}
              className="block w-full px-4 py-2 text-left text-sm text-white hover:bg-neutral-600"
            >
              Log Out
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Upload Song</h2>
        <div className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-xl bg-gradient-to-b from-orange-200 to-yellow-500 text-neutral-700 hover:opacity-90">
          <MdFileUpload className="text-5xl" />
          <p className="font-bold">Upload Here</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Recent Uploads</h2>
          <a href="#" className="text-sm text-green-500 hover:underline">
            See All
          </a>
        </div>
        <div className="space-y-4">
          {recentUploadsData.map((song) => (
            <div key={song.title} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={song.albumArt}
                  alt={song.title}
                  className="h-11 w-11 rounded-lg"
                />
                <div>
                  <p className="text-sm font-bold text-white">{song.title}</p>
                  <p className="text-xs text-neutral-400">{song.artist}</p>
                </div>
              </div>
              <p className="text-xs text-neutral-400">{song.time}</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default RightSide;
