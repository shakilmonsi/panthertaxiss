// AdminPannel.js

import React, { useState, useEffect, useRef } from "react";

// --- ICONS ---
import {
  IoPlaySkipBack,
  IoPlaySkipForward,
  IoPlay,
  IoPause,
  IoVolumeMedium,
  IoShuffle,
  IoRepeat,
  IoNotifications,
  IoHeadsetSharp,
  IoFilterSharp,
} from "react-icons/io5";

import { FiEdit, FiFilter } from "react-icons/fi";

import {
  FaHeart,
  FaRegHeart,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaCrown,
  FaSlidersH,
} from "react-icons/fa";

import { RiPlayListFill } from "react-icons/ri";
import { MdFileUpload } from "react-icons/md";
import { SlPlaylist } from "react-icons/sl";
import { BsPersonBoundingBox } from "react-icons/bs";
import { TfiBarChart } from "react-icons/tfi";
import { IoMdTime } from "react-icons/io";
import { PiDotsThreeOutline, PiUploadSimpleBold } from "react-icons/pi";
import { RiBarChartBoxLine } from "react-icons/ri";
import { CiShoppingTag, CiCalendar } from "react-icons/ci";

// --- CHART.JS IMPORTS ---
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { differenceInDays, format } from "date-fns";
import { HiOutlinePhotograph } from "react-icons/hi";
// Registering Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

// =================================================================================
//  MOCK DATA & HELPERS
// =================================================================================

const navLinksData = [
  { name: "Total Songs Uploaded", icon: <SlPlaylist />, path: "/" },
  { name: "Total Sales (Amount)", icon: <TfiBarChart />, path: "/" },
  { name: "User Admin", icon: <BsPersonBoundingBox />, path: "/" },
];
const userRolesData = [
  { role: "Administrator", email: "roman@gmai.com", status: "active" },
  { role: "Editor", email: "jhon@gmai.com", status: "inactive" },
  { role: "Viewer", email: "rock@gmai.com", status: "inactive" },
];
const songsData = [
  {
    id: 1,
    title: "Shiver",
    artist: "Ed Sheeran",
    plays: "1,952,015,881",
    duration: "3:27",
    isLiked: false,
    likes: "8.9K",
    albumArt: "https://placehold.co/54x54/FFC107/000000?text=S",
  },
  {
    id: 2,
    title: "Perfect",
    artist: "Ed Sheeran",
    plays: "2,301,481,215",
    duration: "4:23",
    isLiked: true,
    likes: "12.1K",
    albumArt: "https://placehold.co/54x54/3498DB/FFFFFF?text=P",
  },
  {
    id: 3,
    title: "Shape of You",
    artist: "Ed Sheeran",
    plays: "3,562,012,817",
    duration: "3:53",
    isLiked: false,
    likes: "15.3K",
    albumArt: "https://placehold.co/54x54/2ECC71/FFFFFF?text=SOY",
  },
  {
    id: 4,
    title: "Roman Picisan",
    artist: "Hanin Dhiya",
    plays: "120,481,215",
    duration: "4:01",
    isLiked: false,
    likes: "4.2K",
    albumArt: "https://placehold.co/54x54/9B59B6/FFFFFF?text=RP",
  },
  {
    id: 5,
    title: "Tittle (Deluxe)",
    artist: "Meghan Trainor",
    plays: "890,115,312",
    duration: "2:54",
    isLiked: true,
    likes: "7.8K",
    albumArt: "https://placehold.co/54x54/E74C3C/FFFFFF?text=T",
  },
  {
    id: 6,
    title: "Bad Habits",
    artist: "Ed Sheeran",
    plays: "987,654,321",
    duration: "3:51",
    isLiked: false,
    likes: "9.1K",
    albumArt: "https://placehold.co/54x54/F1C40F/000000?text=BH",
  },
  {
    id: 7,
    title: "Blinding Lights",
    artist: "The Weeknd",
    plays: "2,800,000,000",
    duration: "3:20",
    isLiked: false,
    likes: "18.5K",
    albumArt: "https://placehold.co/54x54/E91E63/FFFFFF?text=BL",
  },
  {
    id: 8,
    title: "Feel Something",
    artist: "Ed Sheeran",
    plays: "1,000,000,000",
    duration: "3:10",
    isLiked: false,
    likes: "5.6K",
    albumArt: "https://placehold.co/54x54/FFC107/000000?text=FS",
  },
];
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

const generateSalesData = (filter) => {
  const randomValue = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
  let revenue = 0,
    purchases = 0,
    revenueChange = 0,
    purchaseChange = 0,
    periodLabel = "";
  const chartData = [];

  // Summary card logic
  if (filter.type === "predefined") {
    revenue = randomValue(1000, 50000);
    purchases = randomValue(20, 500);
    revenueChange = randomValue(-15, 25);
    purchaseChange = randomValue(-10, 30);
    periodLabel = `previous ${filter.value}`;
  } else if (filter.type === "month") {
    revenue = randomValue(10000, 80000);
    purchases = randomValue(100, 800);
    revenueChange = randomValue(-15, 25);
    purchaseChange = randomValue(-10, 30);
    periodLabel = `previous month`;
  }
  // HIGHLIGHT: Added summary logic for date range
  else if (filter.type === "date_range") {
    revenue = randomValue(5000, 150000);
    purchases = randomValue(50, 1500);
    revenueChange = randomValue(-15, 25);
    purchaseChange = randomValue(-10, 30);
    periodLabel = `previous period`;
  }

  // Chart data logic
  if (filter.type === "month") {
    const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
    for (const week of weeks) {
      chartData.push({
        label: week,
        revenue: randomValue(50, 200),
        purchase: randomValue(50, 200),
      });
    }
  }
  // HIGHLIGHT: Added chart logic for date range
  else if (filter.type === "date_range" && filter.value[0] && filter.value[1]) {
    const [start, end] = filter.value;
    const days = differenceInDays(end, start) + 1;
    // Show days if range is small, otherwise show weeks
    if (days <= 14) {
      for (let i = 0; i < days; i++) {
        const date = new Date(start.valueOf());
        date.setDate(date.getDate() + i);
        chartData.push({
          label: format(date, "MMM d"),
          revenue: randomValue(20, 220),
          purchase: randomValue(20, 220),
        });
      }
    } else {
      const weeks = Math.ceil(days / 7);
      for (let i = 1; i <= weeks; i++) {
        chartData.push({
          label: `Week ${i}`,
          revenue: randomValue(100, 500),
          purchase: randomValue(100, 500),
        });
      }
    }
  } else {
    switch (filter.value) {
      case "24 hours": {
        const hours = [
          "12am",
          "3am",
          "6am",
          "9am",
          "12pm",
          "3pm",
          "6pm",
          "9pm",
        ];
        for (const hour of hours) {
          chartData.push({
            label: hour,
            revenue: randomValue(10, 100),
            purchase: randomValue(10, 100),
          });
        }
        break;
      }
      case "30 days": {
        const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
        for (const week of weeks) {
          chartData.push({
            label: week,
            revenue: randomValue(50, 200),
            purchase: randomValue(50, 200),
          });
        }
        break;
      }
      case "12 months": {
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        for (const month of months) {
          chartData.push({
            label: month,
            revenue: randomValue(100, 250),
            purchase: randomValue(100, 250),
          });
        }
        break;
      }
      case "7 days":
      default: {
        const days = [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ];
        for (const day of days) {
          chartData.push({
            label: day,
            revenue: randomValue(20, 220),
            purchase: randomValue(20, 220),
          });
        }
        break;
      }
    }
  }

  return {
    summary: { revenue, purchases, revenueChange, purchaseChange, periodLabel },
    chartData,
  };
};
// =================================================================================
//  UI COMPONENTS
// =================================================================================
const Sidebar = ({ activeLink, setActiveLink }) => {
  return (
    <aside className="hidden w-70 flex-shrink-0 flex-col space-y-4 bg-neutral-800 p-4 text-white md:flex">
      <div className="mt-4 flex h-32 w-32 items-start">
        <img src="/image/ibracks_logo.png" alt="Logo" />
      </div>
      <nav className="flex flex-col space-y-2">
        {navLinksData.map((link) => (
          <a
            key={link.name}
            href="#"
            onClick={() => setActiveLink(link.name)}
            className={`relative flex items-center gap-4 rounded-lg px-4 py-3 text-base font-normal capitalize transition-colors duration-200 ${activeLink === link.name ? "text-white" : "text-neutral-400 hover:text-white"}`}
          >
            {activeLink === link.name && (
              <div className="absolute top-0 -right-4 h-full w-1 rounded-tl-sm rounded-bl-sm bg-white"></div>
            )}
            <span
              className={`rounded-lg p-2 transition-colors duration-200 ${activeLink === link.name ? "bg-gradient-to-b from-orange-200 to-yellow-500 text-black" : "bg-neutral-700 text-white"}`}
            >
              {link.icon}
            </span>
            <span className="whitespace-nowrap">{link.name}</span>
          </a>
        ))}
      </nav>

      <div className="flex flex-col gap-4 rounded-lg bg-white/10 p-4">
        {userRolesData.map((user) => (
          <div key={user.role} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`h-2 w-2 rounded-full ${user.status === "active" ? "bg-green-500" : "bg-amber-400"}`}
              ></div>
              <div>
                <p className="text-sm font-normal text-white capitalize">
                  {user.role}
                </p>
                <p className="text-xs text-green-500">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => alert(`Editing ${user.role}`)}
              className="text-amber-400 hover:text-amber-300"
            >
              <FiEdit />
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
};

const TopBar = ({ searchTerm, setSearchTerm }) => {
  /* ... Unchanged ... */ return (
    <header className="sticky top-0 z-10 flex flex-shrink-0 items-center justify-between gap-4 bg-black/30 p-2">
      <div className="ml-9 flex items-center gap-2">
        <button className="rounded-lg bg-neutral-800 p-4 text-white hover:bg-neutral-700">
          <FaChevronLeft />
        </button>
        <span className="text-neutral-400">Home</span>
        <FaChevronRight className="text-neutral-500" />
      </div>
      <div className="flex flex-1 justify-center px-4">
        <div className="relative w-full max-w-lg">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-400">
            <FaSearch />
          </span>
          <input
            type="search"
            placeholder="Search music, artist, albums..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl bg-neutral-800 py-4 pr-4 pl-10 text-white focus:ring-2 focus:ring-fuchsia-500 focus:outline-none"
          />
        </div>
      </div>
      <button className="mr-9 rounded-lg bg-neutral-800 p-4 text-xl text-white hover:bg-neutral-700">
        <IoNotifications />
      </button>
    </header>
  );
};

const SongList = ({
  songs,
  currentSong,
  isPlaying,
  onPlayPause,
  onLikeToggle,
}) => {
  /* ... Unchanged ... */ return (
    <div className="space-y-2 p-4">
      <h1 className="mb-4 ml-8 text-xl font-bold text-white">Total Songs</h1>
      {songs.map((song, index) => (
        <div
          key={song.id}
          className="group mr-6 ml-5 grid grid-cols-[30px_minmax(200px,_3fr)_2fr_2fr_auto] items-center gap-4 rounded-lg p-2 hover:bg-white/10"
        >
          <div className="relative flex h-full items-center justify-center text-center text-neutral-200">
            {currentSong?.id === song.id && isPlaying ? (
              <button
                onClick={() => onPlayPause(song)}
                className="text-xl text-white"
              >
                <IoPause />
              </button>
            ) : (
              <button
                onClick={() => onPlayPause(song)}
                className="absolute inset-0 flex items-center justify-center text-xl text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <IoPlay />
              </button>
            )}
            <span
              className={`transition-opacity ${currentSong?.id === song.id || "group-hover:opacity-0"}`}
            >
              {index + 1}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <img
              src={song.albumArt}
              alt={song.title}
              className="h-14 w-14 rounded-lg"
            />
            <p className="truncate font-bold text-white">{song.title}</p>
          </div>
          <div className="flex items-center gap-3 text-neutral-200">
            <IoHeadsetSharp className="text-xl" />
            <span>{song.plays}</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-200">
            <IoMdTime className="rounded-full text-xl" />
            <span>{song.duration}</span>
          </div>
          <div className="flex items-center justify-end gap-6 text-neutral-200">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onLikeToggle(song.id)}
                className={`${song.isLiked ? "text-red-500" : "text-white"} text-xl hover:text-red-500`}
              >
                {song.isLiked ? <FaHeart /> : <FaRegHeart />}
              </button>
              <span className="w-20 text-sm">{song.likes} Likes</span>
            </div>
            <button className="hover:text-white">
              <PiDotsThreeOutline className="text-2xl" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const RightSidebar = () => {
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
    <aside className="hidden w-72 flex-shrink-0 flex-col space-y-8 bg-neutral-800 p-4 text-white lg:flex">
      <div className="relative" ref={dropdownRef}>
        <div
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-white/5"
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
        <div className="space-y-3">
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

const Player = ({ currentSong, isPlaying, onPlayPause, onLikeToggle }) => {
  /* ... Unchanged ... */ if (!currentSong)
    return <div className="h-24 bg-neutral-900"></div>;
  return (
    <div className="grid h-full grid-cols-3 items-center bg-neutral-900/80 px-4 py-2 text-white backdrop-blur-md">
      <div className="ml-10 flex items-center gap-4">
        <img
          src={currentSong.albumArt}
          alt={currentSong.title}
          className="h-16 w-16 rounded-lg"
        />
        <div>
          <p className="font-semibold text-white">{currentSong.title}</p>
          <p className="text-sm text-neutral-400">{currentSong.artist}</p>
        </div>
        <button
          onClick={() => onLikeToggle(currentSong.id)}
          className={`${currentSong.isLiked ? "text-red-500" : "text-white"} transition-colors hover:text-red-500`}
        >
          {currentSong.isLiked ? (
            <FaHeart />
          ) : (
            <FaRegHeart className="text-xl" />
          )}
        </button>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center gap-6">
          <button className="text-neutral-400 hover:text-white">
            <IoShuffle className="text-xl" />
          </button>
          <button className="text-neutral-400 hover:text-white">
            <IoPlaySkipBack className="text-2xl" />
          </button>
          <button
            onClick={() => onPlayPause(currentSong)}
            className="rounded-full bg-white p-3 text-2xl text-black transition-transform hover:scale-105"
          >
            {isPlaying ? <IoPause /> : <IoPlay />}
          </button>
          <button className="text-neutral-400 hover:text-white">
            <IoPlaySkipForward className="text-2xl" />
          </button>
          <button className="text-neutral-400 hover:text-white">
            <IoRepeat className="text-xl" />
          </button>
        </div>
        <div className="mt-2 flex w-full items-center gap-2 text-xs">
          <span className="text-neutral-400">1:45</span>
          <input
            type="range"
            defaultValue="40"
            className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-neutral-600 accent-white"
          />
          <span className="text-neutral-400">{currentSong.duration}</span>
        </div>
      </div>
      <div className="mr-10 flex items-center justify-end gap-4">
        <IoVolumeMedium className="text-xl text-white" />
        <input
          type="range"
          defaultValue="80"
          className="h-1 w-24 cursor-pointer appearance-none rounded-lg bg-neutral-600 accent-white"
        />
        <RiPlayListFill className="text-xl text-white" />
      </div>
    </div>
  );
};

const SalesFilterBar = ({
  activeFilter,
  setFilter,
  dateRange,
  setDateRange,
}) => {
  const predefinedFilters = ["24 hours", "7 days", "30 days", "12 months"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const [startDate, endDate] = dateRange;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMonthDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-8">
        {predefinedFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => {
              setFilter({ type: "predefined", value: filter });
              setDateRange([null, null]);
            }}
            className={`text-base capitalize transition-colors ${activeFilter.type === "predefined" && activeFilter.value === filter ? "border-b border-white font-semibold text-white" : "font-normal text-neutral-300 hover:text-white"}`}
          >
            {filter}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-4">
        {/* --- NEW: DatePicker Component --- */}
        <DatePicker
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          onChange={(update) => {
            setDateRange(update);
          }}
          customInput={
            <button className="flex items-center gap-2 rounded border border-neutral-400 px-2 py-1.5 text-xs text-white hover:bg-white/10">
              <CiCalendar className="text-xl" />
              <span>Select Dates</span>
            </button>
          }
        />

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowMonthDropdown(!showMonthDropdown)}
            className="flex items-center gap-2 rounded border border-neutral-400 px-2 py-1.5 text-xs text-white hover:bg-white/10"
          >
            <IoFilterSharp className="text-xl" />
            <span>
              {activeFilter.type === "month" ? activeFilter.value : "Filters"}
            </span>
          </button>
          {showMonthDropdown && (
            <div className="absolute top-full right-0 z-20 mt-2 w-40 rounded-lg bg-neutral-700 shadow-lg">
              {months.map((month) => (
                <button
                  key={month}
                  onClick={() => {
                    setFilter({ type: "month", value: month });
                    setDateRange([null, null]);
                    setShowMonthDropdown(false);
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-white hover:bg-neutral-600"
                >
                  {month}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({
  icon,
  value,
  title,
  change,
  bgColor,
  textColor,
  periodLabel,
}) => {
  /* ... Unchanged ... */ const isPositive = change >= 0;
  return (
    <div
      className={`flex h-44 w-44 flex-col justify-between rounded-2xl p-5 ${bgColor} ${textColor}`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20">
        {icon}
      </div>
      <div>
        <h1 className="text-2xl font-semibold text-neutral-700">{value}</h1>
        <p className="text-base font-medium text-black">{title}</p>
        <p className="text-xs font-medium text-black">
          <span className={isPositive ? "text-green-800" : "text-red-800"}>
            {isPositive ? "+" : ""}
            {change}%
          </span>
          from {periodLabel}
        </p>
      </div>
    </div>
  );
};

const SalesChart = ({ data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#d1d5db",
          font: { size: 12 },
          usePointStyle: true,
          boxWidth: 8,
        },
      },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 250,
        ticks: {
          color: "#d1d5db",
          stepSize: 50,
          callback: function (value) {
            return value / 10 + "k";
          },
        },
        grid: { color: "rgba(255, 255, 255, 0.2)" },
      },
      x: { ticks: { color: "#d1d5db" }, grid: { display: false } },
    },
  };
  const chartData = {
    labels: data.map((d) => d.label), // Changed from d.day to d.label to support all filter types
    datasets: [
      {
        label: "Total revenue",
        data: data.map((d) => d.revenue),
        backgroundColor: "#f59e0b",
        borderRadius: 0,
        borderSkipped: false,
        barThickness: 10,
      },
      {
        label: "Total purchase",
        data: data.map((d) => d.purchase),
        backgroundColor: "#8b5cf6",
        borderRadius: 0,
        borderSkipped: false,
        barThickness: 10,
      },
    ],
  };
  return (
    <div className="rounded-lg bg-white/10 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white capitalize">
          Sales Statistic
        </h3>
      </div>
      <div className="h-64">
        <Bar options={options} data={chartData} />
      </div>
    </div>
  );
};

const SalesDashboard = ({
  salesData,
  activeFilter,
  setFilter,
  dateRange,
  setDateRange,
}) => {
  if (!salesData)
    return (
      <div className="flex h-full items-center justify-center text-white">
        Loading...
      </div>
    );

  return (
    <div className="mr-4 ml-4 space-y-6 p-8">
      <h1 className="mb-4 text-xl font-bold text-white">Sales Analysis</h1>
      {/* This now passes the date props down to the filter bar */}
      <SalesFilterBar
        activeFilter={activeFilter}
        setFilter={setFilter}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
      <div className="flex gap-6">
        <SummaryCard
          icon={<RiBarChartBoxLine className="text-xl" />}
          value={`$${salesData.summary.revenue.toLocaleString()}`}
          title="Revenue"
          change={salesData.summary.revenueChange}
          periodLabel={salesData.summary.periodLabel}
          bgColor="bg-amber-400"
          textColor="text-white"
        />
        <SummaryCard
          icon={<CiShoppingTag className="text-xl" />}
          value={salesData.summary.purchases.toLocaleString()}
          title="Purchases"
          change={salesData.summary.purchaseChange}
          periodLabel={salesData.summary.periodLabel}
          bgColor="bg-violet-500 "
          textColor="text-white"
        />
      </div>
      <SalesChart data={salesData.chartData} />
    </div>
  );
};
// =================================================================================
//  MAIN ADMIN PANNEL COMPONENT
// =================================================================================
const AdminPannel = () => {
  // ... Unchanged State and Functions
  const [songs, setSongs] = useState(songsData);
  const [currentSong, setCurrentSong] = useState(songsData[2]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeLink, setActiveLink] = useState("Total Songs Uploaded");
  const [salesFilter, setSalesFilter] = useState({
    type: "predefined",
    value: "7 days",
  });

  const [dateRange, setDateRange] = useState([null, null]);
  const [salesData, setSalesData] = useState(null);
  useEffect(() => {
    setSalesData(null);
    const timer = setTimeout(() => {
      setSalesData(generateSalesData(salesFilter));
    }, 300);
    return () => clearTimeout(timer);
  }, [salesFilter]);
  useEffect(() => {
    const [start, end] = dateRange;
    if (start && end) {
      setSalesFilter({ type: "date_range", value: dateRange });
    }
  }, [dateRange]);
  const handlePlayPause = (song) => {
    if (currentSong?.id === song.id) setIsPlaying(!isPlaying);
    else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };
  const handleLikeToggle = (songId) => {
    setSongs(
      songs.map((song) =>
        song.id === songId ? { ...song, isLiked: !song.isLiked } : song,
      ),
    );
  };
  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  useEffect(() => {
    if (currentSong) {
      const updatedCurrentSong = songs.find((s) => s.id === currentSong.id);
      if (
        updatedCurrentSong &&
        updatedCurrentSong.isLiked !== currentSong.isLiked
      ) {
        setCurrentSong(updatedCurrentSong);
      }
    }
  }, [songs, currentSong]);

  return (
    <div className="mx-auto h-screen max-w-screen overflow-hidden bg-gradient-to-b from-black to-fuchsia-900 font-sans text-white">
      <div
        className={`flex ${activeLink !== "Total Sales (Amount)" && activeLink !== "Upload Page" ? "h-[calc(100%-6rem)]" : "h-full"}`}
      >
        <Sidebar activeLink={activeLink} setActiveLink={setActiveLink} />
        <main className="flex-1 overflow-y-auto">
          <TopBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          {activeLink === "Total Songs Uploaded" && (
            <SongList
              songs={filteredSongs}
              currentSong={currentSong}
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onLikeToggle={handleLikeToggle}
            />
          )}
          {activeLink === "Total Sales (Amount)" && (
            <SalesDashboard
              salesData={salesData}
              activeFilter={salesFilter}
              setFilter={setSalesFilter}
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
          )}
          {activeLink === "Upload Page" && <UploadPage />}
          {activeLink === "User Admin" && (
            <div className="p-8 text-white">User Admin Page Coming Soon</div>
          )}
        </main>
        <RightSidebar setActiveLink={setActiveLink} />
      </div>
      {activeLink !== "Total Sales (Amount)" && (
        <div className="h-24">
          <Player
            currentSong={currentSong}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onLikeToggle={handleLikeToggle}
          />
        </div>
      )}
    </div>
  );
};

export default AdminPannel;
