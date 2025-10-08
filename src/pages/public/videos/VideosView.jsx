import React, { useState, useEffect } from "react";
import { FaArrowRight, FaEraser, FaPlayCircle } from "react-icons/fa";

const videosData = [
  {
    id: 1,
    imageSrc: "/video/cart.jpg",
    title: "Mastering Music Composition: Tips for Creating Iconic Tracks 1",
    description:
      "Explore the core principles of music composition and learn how to craft melodies, harmonies, and rhythms that resonate with listeners.",
  },
  {
    id: 2,
    imageSrc: "public/video/cart2.jpg",
    title: "Mastering Music Composition: Tips for Creating Iconic Tracks 2",
    description:
      "Explore the core principles of music composition and learn how to craft melodies, harmonies, and rhythms that resonate with listeners.",
  },
  {
    id: 3,
    imageSrc: "/video/cart.jpg",
    title: "Mastering Music Composition: Tips for Creating Iconic Tracks 3",
    description:
      "Explore the core principles of music composition and learn how to craft melodies, harmonies, and rhythms that resonate with listeners.",
  },
  {
    id: 4,
    imageSrc: "/video/cart4.jpg",
    title: "Mastering Music Composition: Tips for Creating Iconic Tracks 4",
    description:
      "Explore the core principles of music composition and learn how to craft melodies, harmonies, and rhythms that resonate with listeners.",
  },
  {
    id: 5,
    imageSrc: "/video/cart6.jpg",
    title: "Mastering Music Composition: Tips for Creating Iconic Tracks 6",
    description:
      "Explore the core principles of music composition and learn how to craft melodies, harmonies, and rhythms that resonate with listeners.",
  },
  {
    id: 6,
    imageSrc: "/video/cart5.jpg",
    title: "Mastering Music Composition: Tips for Creating Iconic Tracks 5",
    description:
      "Explore the core principles of music composition and learn how to craft melodies, harmonies, and rhythms that resonate with listeners.",
  },
  {
    id: 4,
    imageSrc: "/video/cart4.jpg",
    title: "Mastering Music Composition: Tips for Creating Iconic Tracks 4",
    description:
      "Explore the core principles of music composition and learn how to craft melodies, harmonies, and rhythms that resonate with listeners.",
  },
  {
    id: 5,
    imageSrc: "/video/cart6.jpg",
    title: "Mastering Music Composition: Tips for Creating Iconic Tracks 6",
    description:
      "Explore the core principles of music composition and learn how to craft melodies, harmonies, and rhythms that resonate with listeners.",
  },
  {
    id: 6,
    imageSrc: "/video/cart5.jpg",
    title: "Mastering Music Composition: Tips for Creating Iconic Tracks 5",
    description:
      "Explore the core principles of music composition and learn how to craft melodies, harmonies, and rhythms that resonate with listeners.",
  },
];

// সর্বোচ্চ কতগুলো ভিডিও লোড হবে একবারে (প্রথম লোডের পরে)
const VIDEOS_PER_LOAD_AFTER_INITIAL = 6;

const VideosView = () => {
  const [displayedVideos, setDisplayedVideos] = useState([]);
  const [nextVideoIndex, setNextVideoIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Initial load logic
  useEffect(() => {
    // Determine how many videos to initially display
    // It will display either the total number of videos in JSON or a maximum of 6, whichever is smaller.
    const initialLoadCount = Math.min(videosData.length, 6); // Here's the key change

    const initialVideos = videosData.slice(0, initialLoadCount);
    setDisplayedVideos(initialVideos);
    setNextVideoIndex(initialLoadCount); // Set the index for the next load

    // Check if all available videos are already displayed
    if (initialLoadCount >= videosData.length) {
      setHasMore(false);
    }
  }, []); // Empty dependency array means this runs once on mount

  // Function to load more videos (for "Load More" button)
  const loadMoreVideos = () => {
    if (nextVideoIndex < videosData.length) {
      const newVideos = videosData.slice(
        nextVideoIndex,
        nextVideoIndex + VIDEOS_PER_LOAD_AFTER_INITIAL, // Use the constant for subsequent loads
      );
      setDisplayedVideos((prevVideos) => [...prevVideos, ...newVideos]);
      setNextVideoIndex((prevIndex) => prevIndex + newVideos.length);

      if (prevIndex + newVideos.length >= videosData.length) {
        setHasMore(false);
      }
    } else {
      setHasMore(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-neutral-900 px-4 py-14 sm:px-6 md:py-14 lg:px-8"
      style={{
        background: "linear-gradient(180deg, #050306 0%, #5D006D 100%)",
      }}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {displayedVideos.map((video) => (
          <div
            key={video.id}
            className="w-full gap-2.5 rounded-lg bg-neutral-700"
          >
            <img
              className="h-52 w-full self-stretch rounded object-cover"
              src={video.imageSrc}
              alt={video.title}
            />

            <div className="p-5">
              <div className="w-full text-center capitalize">
                <h6 className="text-base font-[500] text-[#DBA63E]">
                  {video.title}
                </h6>
              </div>

              <div className="w-ful pt-2">
                <p className="w-full text-center font-['Poppins'] text-sm font-[400] text-[#E0E0E0]">
                  {video.description}
                </p>
              </div>

              <div className="mx-auto flex justify-center pt-3">
                <button className="inline-flex h-11 w-48 cursor-pointer items-center justify-center gap-2.5 rounded-lg bg-gradient-to-b from-orange-200 to-yellow-500 p-2.5 transition-opacity duration-300 hover:opacity-90">
                  <div className="flex items-center">
                    <p className="font-[#600] text-[16px] text-[#282828] capitalize">
                      Watch the video
                    </p>
                  </div>
                  {/* Replaced the complex Figma icon with a simple React Icon */}
                  <img
                    src="/video/icon-park-twotone_video-two.svg"
                    alt=""
                    className="text-2xl text-zinc-800"
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto flex items-center justify-center py-0 pt-10 lg:py-8">
        {hasMore && (
          <div
            // This is the outer container for the border effect
            className="inline-flex items-center justify-center gap-1 rounded-md p-[1px] shadow-2xl transition-all duration-300 ease-in-out"
            style={{
              background: "linear-gradient(to bottom, #F5DEB3, #DAA520)", // Gradient for the "border"
              borderRadius: "8px", // Apply border-radius here
            }}
          >
            <div
              // This is the inner button content
              className="inline-flex items-center justify-center gap-1 rounded-[7px] bg-[#43024F] px-12 py-3 transition-all duration-300 ease-in-out hover:bg-gradient-to-t hover:from-[#DAA520] hover:to-[#F5DEB3]"
              onClick={loadMoreVideos}
            >
              <div className="cursor-pointer text-center font-['Plus_Jakarta_Sans'] text-base leading-normal font-semibold text-white capitalize shadow-2xl">
                Load more
              </div>
              <div data-size="48" className="h-6 w-6">
                <FaArrowRight className="rotate-[-60deg] font-bold text-white" />
              </div>
            </div>
          </div>
        )}
        {!hasMore && (
          <p className="mt-10 text-center font-['Poppins'] text-neutral-400">
            No more videos to load.
          </p>
        )}
      </div>
    </div>
  );
};

export default VideosView;
