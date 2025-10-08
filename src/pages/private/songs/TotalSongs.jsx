import { useState } from "react";
import { IoPlay, IoPause, IoHeadsetSharp } from "react-icons/io5";
import { IoMdTime } from "react-icons/io";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { PiDotsThreeOutline } from "react-icons/pi";
import BottomPlayer from "./components/BottomPlayer";

// Expanded dummy songs data (20+ items)
const dummySongs = [
  {
    id: 1,
    title: "Lost in the Echo",
    albumArt: "https://placehold.co/54x54/FFC107/000000?text=S",
    plays: 124567,
    duration: "3:25",
    likes: 203,
  },
  {
    id: 2,
    title: "Numb",
    albumArt: "https://placehold.co/54x54/FFC107/000000?text=S",
    plays: 298721,
    duration: "3:07",
    likes: 412,
  },
  {
    id: 3,
    title: "In the End",
    albumArt: "https://placehold.co/54x54/FFC107/000000?text=S",
    plays: 512398,
    duration: "3:45",
    likes: 613,
  },
  {
    id: 4,
    title: "Breaking the Habit",
    albumArt: "https://placehold.co/54x54/FFC107/000000?text=S",
    plays: 187654,
    duration: "3:16",
    likes: 321,
  },
  {
    id: 5,
    title: "Faint",
    albumArt: "https://placehold.co/54x54/FFC107/000000?text=S",
    plays: 245678,
    duration: "2:42",
    likes: 198,
  },
  {
    id: 6,
    title: "One Step Closer",
    albumArt: "https://placehold.co/54x54/FFC107/000000?text=S",
    plays: 312456,
    duration: "2:35",
    likes: 287,
  },
  {
    id: 7,
    title: "Crawling",
    albumArt: "https://placehold.co/54x54/FFC107/000000?text=S",
    plays: 298765,
    duration: "3:29",
    likes: 412,
  },
  {
    id: 8,
    title: "Papercut",
    albumArt: "https://placehold.co/54x54/FFC107/000000?text=S",
    plays: 187654,
    duration: "3:04",
    likes: 156,
  },
  {
    id: 9,
    title: "Somewhere I Belong",
    albumArt: "https://placehold.co/54x54/FFC107/000000?text=S",
    plays: 234567,
    duration: "3:33",
    likes: 298,
  },
  {
    id: 10,
    title: "Burn It Down",
    albumArt: "https://placehold.co/54x54/FFC107/000000?text=S",
    plays: 287654,
    duration: "3:51",
    likes: 345,
  },
  {
    id: 11,
    title: "What I've Done",
    albumArt: "https://placehold.co/54x54/FFC107/000000?text=S",
    plays: 345678,
    duration: "3:25",
    likes: 432,
  },
  {
    id: 12,
    title: "New Divide",
    albumArt: "https://placehold.co/54x54/FFC107/000000?text=S",
    plays: 412345,
    duration: "4:28",
    likes: 521,
  },
  {
    id: 13,
    title: "Leave Out All the Rest",
    albumArt: "https://placehold.co/54x54/FFC107/000000?text=S",
    plays: 187654,
    duration: "3:29",
    likes: 234,
  },
  {
    id: 14,
    title: "Bleed It Out",
    albumArt: "https://placehold.co/54x54/FFC107/000000?text=S",
    plays: 276543,
    duration: "2:44",
    likes: 345,
  },
  {
    id: 15,
    title: "Shadow of the Day",
    albumArt: "https://placehold.co/54x54/FFC107/000000?text=S",
    plays: 198765,
    duration: "4:16",
    likes: 287,
  },
  {
    id: 16,
    title: "Given Up",
    albumArt: "https://placehold.co/54x54/FFC107/000000?text=S",
    plays: 165432,
    duration: "3:09",
    likes: 176,
  },
  {
    id: 17,
    title: "Waiting for the End",
    albumArt: "https://placehold.co/54x54/FFC107/000000?text=S",
    plays: 234567,
    duration: "3:51",
    likes: 321,
  },
  {
    id: 18,
    title: "Castle of Glass",
    albumArt: "https://placehold.co/54x54/FFC107/000000?text=S",
    plays: 287654,
    duration: "3:25",
    likes: 398,
  },
  {
    id: 19,
    title: "Final Masquerade",
    albumArt: "https://placehold.co/54x54/FFC107/000000?text=S",
    plays: 176543,
    duration: "3:37",
    likes: 234,
  },
  {
    id: 20,
    title: "One More Light",
    albumArt: "https://placehold.co/54x54/FFC107/000000?text=S",
    plays: 198765,
    duration: "4:15",
    likes: 287,
  },
  {
    id: 21,
    title: "Talking to Myself",
    albumArt: "https://placehold.co/54x54/FFC107/000000?text=S",
    plays: 165432,
    duration: "3:51",
    likes: 198,
  },
  {
    id: 22,
    title: "Heavy",
    albumArt: "https://placehold.co/54x54/FFC107/000000?text=S",
    plays: 154321,
    duration: "2:49",
    likes: 176,
  },
];
const TotalSongs = () => {
  const [songs, setSongs] = useState(dummySongs);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = (song) => {
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  return (
    <section className="">
      <h1 className="px-10 py-4 text-xl font-bold text-white">Total Songs</h1>
      <div className="max-h-[650px] overflow-auto px-10">
        {songs.map((song, index) => (
          <div
            key={song.id}
            className="group grid grid-cols-[30px_minmax(200px,_3fr)_2fr_2fr_auto] items-center gap-4 rounded-lg p-2 hover:bg-white/10"
          >
            <div className="relative flex h-full items-center justify-center text-center text-neutral-200">
              {currentSong?.id === song.id && isPlaying ? (
                <button
                  onClick={() => handlePlayPause(song)}
                  className="text-xl text-white"
                >
                  <IoPause />
                </button>
              ) : (
                <button
                  onClick={() => handlePlayPause(song)}
                  className="absolute inset-0 flex items-center justify-center text-xl text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <IoPlay />
                </button>
              )}
              <span
                className={`transition-opacity ${
                  currentSong?.id === song.id || "group-hover:opacity-0"
                }`}
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
              <span>{song.plays.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-200">
              <IoMdTime className="rounded-full text-xl" />
              <span>{song.duration}</span>
            </div>
            <div className="flex items-center justify-end gap-6 text-neutral-200">
              <div className="flex items-center gap-2">
                <p className="text-white">
                  <FaRegHeart />
                </p>
                <span className="w-20 text-sm">{song.likes} Likes</span>
              </div>
              <button className="hover:text-white">
                <PiDotsThreeOutline className="text-2xl" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="">
        <BottomPlayer />
      </div>
    </section>
  );
};

export default TotalSongs;
