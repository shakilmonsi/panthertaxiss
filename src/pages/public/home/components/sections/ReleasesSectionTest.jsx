import { useEffect, useState, useRef, useCallback } from "react";
import { FiPlay } from "react-icons/fi"; // Only FiPlay needed for header icon

// Import the new components
import SongCard from "./SongCard";
import PlayerControls from "./PlayerControls";
import ProgressBar from "./ProgressBar";
import PaginationControls from "./PaginationControls";
import SearchAndFilter from "./SearchAndFilter";
import { FaHeart } from "react-icons/fa";

const ReleasesSection = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [totalSongs, setTotalSongs] = useState(0);

  const [currentPlayingSong, setCurrentPlayingSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off"); // 'off', 'one', 'all'

  // Initialize Audio object once and store its reference
  const audioRef = useRef(new Audio());

  // Refs for functions for event listeners to avoid stale closures (still useful for native events)
  const playNextSongRef = useRef();
  const playPreviousSongRef = useRef();
  const handlePlaySongRef = useRef();

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      secs < 10 ? "0" : ""
    }${secs}`;
  };

  // Function to play the next song in the list
  const playNextSong = useCallback(() => {
    console.log(
      "playNextSong called. Current song:",
      currentPlayingSong?.title,
    );
    if (!currentPlayingSong || songs.length === 0) {
      console.log("No current song or no songs in list to play next.");
      return;
    }

    let nextSongIndex;
    const currentIndex = songs.findIndex((s) => s.id === currentPlayingSong.id);

    if (isShuffle) {
      if (songs.length <= 1) {
        nextSongIndex = currentIndex;
      } else {
        do {
          nextSongIndex = Math.floor(Math.random() * songs.length);
        } while (nextSongIndex === currentIndex);
      }
    } else {
      nextSongIndex = (currentIndex + 1) % songs.length;
    }

    if (
      repeatMode === "off" &&
      nextSongIndex === 0 &&
      currentIndex === songs.length - 1
    ) {
      console.log(
        "End of playlist reached (no repeat all). Stopping playback.",
      );
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentPlayingSong(null);
      setDuration(0);
      setCurrentTime(0);
    } else {
      console.log(
        "Playing next song at index:",
        nextSongIndex,
        "Title:",
        songs[nextSongIndex]?.title,
      );
      // Use the ref for handlePlaySong, as this function is called from within an event listener
      if (handlePlaySongRef.current) {
        handlePlaySongRef.current(songs[nextSongIndex]);
      }
    }
  }, [currentPlayingSong, songs, isShuffle, repeatMode]);

  // Function to play the previous song in the list
  const playPreviousSong = useCallback(() => {
    console.log(
      "playPreviousSong called. Current song:",
      currentPlayingSong?.title,
    );
    if (!currentPlayingSong || songs.length === 0) {
      console.log("No current song or no songs in list to play previous.");
      return;
    }

    let prevSongIndex;
    const currentIndex = songs.findIndex((s) => s.id === currentPlayingSong.id);

    if (isShuffle) {
      if (songs.length <= 1) {
        prevSongIndex = currentIndex;
      } else {
        do {
          prevSongIndex = Math.floor(Math.random() * songs.length);
        } while (prevSongIndex === currentIndex);
      }
    } else {
      prevSongIndex = (currentIndex - 1 + songs.length) % songs.length;
    }
    // Use the ref for handlePlaySong
    if (handlePlaySongRef.current) {
      console.log(
        "Playing previous song at index:",
        prevSongIndex,
        "Title:",
        songs[prevSongIndex]?.title,
      );
      handlePlaySongRef.current(songs[prevSongIndex]);
    }
  }, [currentPlayingSong, songs, isShuffle]);

  // Function to handle playing a specific song or toggling play/pause for the current song.
  const handlePlaySong = useCallback(
    (song) => {
      console.log("handlePlaySong called for:", song.title);
      if (!song.audioUrl) {
        console.warn(`Song "${song.title}" has no audio URL available.`);
        return;
      }

      if (currentPlayingSong?.id === song.id) {
        console.log("Clicked current playing song. Toggling play/pause.");
        setIsPlaying((prev) => !prev);
        return;
      }

      // If a different song is clicked or no song is currently playing, load the new song.
      console.log("Loading new song:", song.title, "URL:", song.audioUrl);
      audioRef.current.src = song.audioUrl;
      audioRef.current.load(); // Load the new source
      setCurrentPlayingSong(song);
      setIsPlaying(true); // Attempt to play the new song
      audioRef.current.volume = volume; // Set the initial volume.
    },
    [currentPlayingSong, volume],
  );

  // This useEffect attaches and cleans up audio event listeners ONCE.
  // It handles the core audio events, not just play/pause.
  useEffect(() => {
    const audio = audioRef.current;
    console.log("Setting up audio event listeners...");

    const handleCanPlayThrough = () => {
      console.log(
        "Audio 'canplaythrough' event. Current isPlaying state:",
        isPlaying,
      );
      if (isPlaying && audio.paused) {
        // Only attempt to play if the component state expects it to be playing AND audio is actually paused
        audio.play().catch((e) => {
          console.error("Autoplay failed (from canplaythrough listener):", e);
          // Check if error is due to user interaction requirement
          if (e.name === "NotAllowedError" || e.name === "AbortError") {
            console.warn(
              "Autoplay blocked by browser. User interaction required.",
            );
          }
          setIsPlaying(false); // Fallback to paused if autoplay fails
        });
      }
    };

    const handleLoadedMetadata = () => {
      console.log("Audio 'loadedmetadata' event. Duration:", audio.duration);
      setDuration(audio.duration);
      setCurrentTime(0);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleSongEnded = () => {
      console.log("Audio 'ended' event. Repeat Mode:", repeatMode);
      if (repeatMode === "one") {
        audio.currentTime = 0;
        audio.play().catch((e) => console.error("Error repeating song:", e));
      } else {
        // Use the ref for `playNextSong` to ensure the latest version is called
        if (playNextSongRef.current) {
          playNextSongRef.current();
        }
      }
    };

    const handleError = (e) => {
      console.error("Audio 'error' event:", e);
      setCurrentPlayingSong(null);
      setIsPlaying(false);
      setDuration(0);
      setCurrentTime(0);
    };

    // Attach event listeners
    audio.addEventListener("canplaythrough", handleCanPlayThrough);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleSongEnded);
    audio.addEventListener("error", handleError);

    // Cleanup function: runs when component unmounts or dependencies change
    return () => {
      console.log("Cleaning up audio event listeners...");
      audio.removeEventListener("canplaythrough", handleCanPlayThrough);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleSongEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [playNextSong, repeatMode, isPlaying]); // Dependencies for event listener (important!)

  // This useEffect handles the actual play/pause commands based on state.
  useEffect(() => {
    const audio = audioRef.current;
    console.log(
      "useEffect [isPlaying, currentPlayingSong] - isPlaying:",
      isPlaying,
      "currentSong:",
      currentPlayingSong?.title,
      "audio.src:",
      audio.src,
    );

    if (currentPlayingSong && audio.src) {
      if (isPlaying) {
        // Attempt to play if currently paused.
        if (audio.paused) {
          // Check if it's actually paused before trying to play
          console.log("Attempting to play audio...");
          audio.play().catch((e) => {
            console.error("Autoplay failed from isPlaying effect:", e);
            if (e.name === "NotAllowedError" || e.name === "AbortError") {
              console.warn(
                "Autoplay blocked by browser. User interaction required.",
              );
            }
            setIsPlaying(false); // Revert to paused if autoplay fails.
          });
        } else {
          console.log("Audio is already playing.");
        }
      } else {
        // Pause if `isPlaying` is false.
        if (!audio.paused) {
          // Only pause if it's not already paused
          console.log("Attempting to pause audio...");
          audio.pause();
        } else {
          console.log("Audio is already paused.");
        }
      }
    } else if (!currentPlayingSong) {
      console.log("No current song. Ensuring audio is paused and cleared.");
      audio.pause();
      audio.src = ""; // Clear source
      audio.load(); // Release resources
    }
  }, [isPlaying, currentPlayingSong]);

  // This useEffect ensures that the refs always hold the *latest* version of their functions.
  // This is critical for event listeners like `onended` that capture the function at attachment time.
  useEffect(() => {
    playNextSongRef.current = playNextSong;
    playPreviousSongRef.current = playPreviousSong;
    handlePlaySongRef.current = handlePlaySong;
  }, [playNextSong, playPreviousSong, handlePlaySong]);

  // Data Fetching useEffect
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const url = `https://backend-ibracks.mtscorporate.com/api/songs/published?page=${page}&limit=${limit}&search=${encodeURIComponent(searchTerm)}`;
      console.log("Fetching URL:", url);

      try {
        const response = await fetch(url);
        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error Response Text:", errorText);
          throw new Error(
            `HTTP error! status: ${response.status} - ${errorText}`,
          );
        }
        const responseData = await response.json();
        console.log("Parsed API Data (Full Object):", responseData);

        if (responseData && Array.isArray(responseData.data)) {
          const processedSongs = responseData.data.map((song) => ({
            ...song,
            id: song.id || song._id,
            image: song.coverImage || "/products/cart1.jpg",
            artist: song.user?.name || "Unknown Artist",
            audioUrl: song.audioFile || null,
          }));
          setSongs(processedSongs);

          if (responseData.pagination) {
            setTotalPages(responseData.pagination.totalPages || 0);
            setTotalSongs(responseData.pagination.totalSongs || 0);
          } else {
            setTotalPages(1);
            setTotalSongs(processedSongs.length);
          }
        } else {
          console.error(
            "API response structure is not as expected or responseData.data is not an array:",
            responseData,
          );
          setError("Failed to load songs: Data format unexpected.");
          setSongs([]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(`Error fetching data: ${err.message}`);
        setSongs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, limit, searchTerm]);

  const togglePlayPause = () => {
    console.log("togglePlayPause clicked. Current state isPlaying:", isPlaying);
    if (!currentPlayingSong) {
      console.log("No song selected to play/pause. Cannot toggle.");
      return;
    }
    setIsPlaying((prev) => !prev);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      // If the user seeks while the song is paused, start playing from the new position.
      if (audioRef.current.paused && newTime > 0 && !isPlaying) {
        console.log(
          "Seeking while paused. Attempting to play from new position.",
        );
        audioRef.current.play().catch((e) => {
          console.error("Autoplay after seek failed:", e);
          if (e.name === "NotAllowedError" || e.name === "AbortError") {
            console.warn(
              "Autoplay blocked by browser. User interaction required.",
            );
          }
        });
        setIsPlaying(true);
      }
    }
  };

  const toggleShuffle = () => {
    setIsShuffle((prev) => !prev);
    if (!isShuffle && repeatMode === "one") {
      setRepeatMode("off");
    }
  };

  const toggleRepeat = () => {
    setRepeatMode((prevMode) => {
      if (prevMode === "off") return "one";
      if (prevMode === "one") return "all";
      return "off";
    });
    if (repeatMode === "off" && isShuffle) {
      setIsShuffle(false);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
      setCurrentPlayingSong(null); // Stop playback on page change
      setIsPlaying(false);
      console.log("Navigating to next page:", page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prevPage) => Math.max(1, prevPage - 1));
      setCurrentPlayingSong(null); // Stop playback on page change
      setIsPlaying(false);
      console.log("Navigating to previous page:", page - 1);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset page to 1 on new search
    setCurrentPlayingSong(null); // Stop playback on new search
    setIsPlaying(false);
    console.log("Search term changed to:", event.target.value);
  };

  const handleLimitChange = (event) => {
    setLimit(Number(event.target.value));
    setPage(1); // Reset page to 1 on limit change
    setCurrentPlayingSong(null); // Stop playback on limit change
    setIsPlaying(false);
    console.log("Limit changed to:", Number(event.target.value));
  };

  return (
    <section className="relative min-h-screen w-full px-4 pb-36 sm:px-8">
      <div className="mb-8 flex items-center gap-4">
        <h2 className="text-xl font-semibold text-white sm:text-2xl">
          New Releases
        </h2>
        <FiPlay className="h-6 w-6 rounded-full bg-white p-1 text-black" />
      </div>

      <SearchAndFilter
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        limit={limit}
        handleLimitChange={handleLimitChange}
      />

      <div className="flex flex-wrap justify-center gap-6 py-10">
        {loading ? (
          <p className="text-lg text-white">Loading new releases...</p>
        ) : error ? (
          <p className="text-lg text-red-500">{error}</p>
        ) : Array.isArray(songs) && songs.length > 0 ? (
          songs.map((song) => (
            <SongCard
              key={song.id || `${song.title}-${song.artist}`}
              song={song}
              currentPlayingSong={currentPlayingSong}
              isPlaying={isPlaying}
              handlePlaySong={handlePlaySong}
            />
          ))
        ) : (
          <p className="text-lg text-white">No new releases found.</p>
        )}
      </div>

      <PaginationControls
        page={page}
        totalPages={totalPages}
        totalSongs={totalSongs}
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
      />

      {currentPlayingSong && (
        <div className="fixed right-0 bottom-0 left-0 z-50 flex h-28 flex-col overflow-hidden bg-neutral-900/80 shadow-2xl backdrop-blur-2xl">
          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            handleProgressChange={handleProgressChange}
            formatTime={formatTime}
          />

          <div className="flex flex-1 items-center justify-between px-4 sm:px-8">
            <div className="flex w-fit items-center gap-4 sm:w-72 sm:gap-8">
              <div className="flex items-center gap-2 sm:gap-4">
                <img
                  src={currentPlayingSong.image || "/products/cart1.jpg"}
                  alt="Album cover"
                  className="h-14 w-14 rounded-lg object-cover sm:h-16 sm:w-16 sm:rounded-xl"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/products/cart1.jpg";
                  }}
                />
                <div className="flex flex-col items-start gap-0.5 sm:gap-1">
                  <h3 className="font-manrope max-w-[120px] truncate text-base leading-tight font-semibold text-white sm:max-w-full sm:text-lg sm:leading-relaxed">
                    {currentPlayingSong.title}
                  </h3>
                  <p className="font-manrope max-w-[120px] truncate text-xs leading-none font-normal text-neutral-300 sm:max-w-full sm:text-sm">
                    {currentPlayingSong.artist}
                  </p>
                </div>
              </div>
              {/* This Heart button still needs functionality */}
              <button className="hidden text-white transition-colors hover:text-red-500 sm:block">
                <FaHeart size={20} />
              </button>
            </div>

            <PlayerControls
              currentPlayingSong={currentPlayingSong}
              isPlaying={isPlaying}
              togglePlayPause={togglePlayPause}
              playPreviousSong={playPreviousSong}
              playNextSong={playNextSong}
              volume={volume}
              handleVolumeChange={handleVolumeChange}
              isShuffle={isShuffle}
              toggleShuffle={toggleShuffle}
              repeatMode={repeatMode}
              toggleRepeat={toggleRepeat}
            />

            {/* Time display (already handled by ProgressBar, this can be removed or kept for larger screens) */}
            <span className="font-manrope hidden text-sm font-normal text-neutral-400 sm:block sm:text-base">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
        </div>
      )}
    </section>
  );
};

export default ReleasesSection;
