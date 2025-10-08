import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";
import { IoMdArrowDroprightCircle } from "react-icons/io";

const DEFAULT_COVER_IMAGE = "/treacks/cart2.png";
// const DEFAULT_COVER_IMAGE = "/treacks/cart2.png";
// Ensure cart2.png is inside public/treacks/

const TracksPageHeroSection = () => {
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewReleases = async () => {
      try {
        const url =
          "https://backend-ibracks.mtscorporate.com/api/songs/new-releases";
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const formattedReleases = data.data.map((item) => {
          // --- IMPROVED DEFAULT IMAGE LOGIC ---
          let imageUrl = item.coverImage;
          // Check if coverImage is null, undefined, or an empty string
          if (!imageUrl || imageUrl.trim() === "") {
            imageUrl = DEFAULT_COVER_IMAGE;
          }
          // --- END IMPROVED LOGIC ---

          return {
            id: item.id,
            title: item.title,
            artist: item.user ? item.user.name : "Unknown Artist",
            image: imageUrl,
          };
        });
        setNewReleases(formattedReleases);
      } catch (err) {
        console.error("Failed to fetch new releases:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNewReleases();
  }, []);

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="text-lg text-white">Loading new releases...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="text-lg text-red-500">
          Error loading releases: {error}
        </div>
      </div>
    );
  }

  if (newReleases.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="text-lg text-white">No new releases found.</div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl items-center justify-center md:px-6 lg:px-8">
      {/* Left Navigation */}
      <div className="hidden lg:block">
        <div className="swiper-button-prev-custom cursor-pointer rounded-full bg-black/50 p-2 transition-colors hover:bg-black/70">
          <FiArrowLeftCircle className="h-6 w-6 font-bold text-white" />
        </div>
      </div>

      {/* Main Area */}
      <div className="w-full lg:w-[1200px]">
        <div className="mx-auto flex h-auto min-h-[288px] flex-col items-start justify-start gap-5 overflow-hidden rounded-lg bg-white/10 py-4 pr-2 font-sans md:min-h-[300px] md:pl-6 lg:min-h-72">
          <div className="inline-flex items-center justify-start gap-3 self-stretch px-3 md:px-0">
            <div className="-mt-2 text-xl font-semibold text-white md:text-2xl">
              New Releases
            </div>
            <IoMdArrowDroprightCircle className="h-6 w-6 text-white" />
          </div>

          {/* Swiper Carousel */}
          <Swiper
            modules={[Navigation, Pagination]}
            breakpoints={{
              320: { slidesPerView: 2, spaceBetween: 10 },
              768: { slidesPerView: 3, spaceBetween: 15 },
              1024: {
                slidesPerView: Math.min(newReleases.length, 6),
                spaceBetween: 20,
              },
              1280: {
                slidesPerView: Math.min(newReleases.length, 6),
                spaceBetween: 20,
              },
            }}
            loop={false}
            watchOverflow={true}
            centeredSlides={false}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            pagination={{
              clickable: true,
              el: ".swiper-pagination-custom",
            }}
            className="relative w-full flex-1"
          >
            {newReleases.map((release) => (
              <SwiperSlide
                key={release.id}
                className="flex !h-auto !w-auto flex-col items-start justify-start gap-2.5"
              >
                <div className="h-[176px] w-[176px] overflow-hidden rounded">
                  <img
                    className="h-full w-full object-cover object-center"
                    src={release.image}
                    alt={release.title}
                    // Add onError to catch broken image links from API and fall back to default
                    onError={(e) => {
                      e.target.src = DEFAULT_COVER_IMAGE;
                    }}
                  />
                </div>
                <div className="flex w-full flex-col items-start justify-start gap-0.5 py-1">
                  <div className="self-stretch truncate text-sm font-semibold text-neutral-200 sm:text-base">
                    {release.title}
                  </div>
                  <div className="self-stretch truncate text-xs font-normal text-zinc-400 sm:text-sm">
                    {release.artist}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="swiper-pagination-custom mt-4 flex justify-center pb-2"></div>
      </div>

      <div className="hidden lg:block">
        <div className="swiper-button-next-custom cursor-pointer rounded-full bg-black/50 p-2 transition-colors hover:bg-black/70">
          <FiArrowRightCircle className="h-6 w-6 font-bold text-white" />
        </div>
      </div>

      <style jsx="true">{`
        .swiper-pagination-bullet {
          width: 10px !important;
          height: 10px !important;
          background-color: rgba(255, 255, 255, 0.4) !important;
          border-radius: 50% !important;
          opacity: 1 !important;
          margin: 0 4px !important;
        }

        .swiper-pagination-bullet-active {
          background-color: white !important;
        }

        .swiper-button-prev,
        .swiper-button-next {
          display: none !important;
        }

        .swiper-button-prev-custom.swiper-button-disabled,
        .swiper-button-next-custom.swiper-button-disabled {
          opacity: 0.3;
          cursor: not-allowed;
          pointer-events: none;
        }

        @media (max-width: 1023px) {
          .swiper-button-prev-custom,
          .swiper-button-next-custom {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TracksPageHeroSection;
