import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";

// Sample JSON data for tracks
const tracksData = [
  {
    id: 1,
    image: "/products/cart1.jpg",
    title: "Vision",
    producer: "ProducerA",
    bpm: "130 BPM",
    price: "$30.00",
  },
  {
    id: 2,
    image: "/products/cart2.jpg",
    title: "Dreamscape",
    producer: "ProducerB",
    bpm: "120 BPM",
    price: "$25.00",
  },
  {
    id: 3,
    image: "/products/cart3.jpg",
    title: "Horizon",
    producer: "ProducerC",
    bpm: "140 BPM",
    price: "$35.00",
  },
  {
    id: 4,
    image: "/products/cart4.jpg",
    title: "Serenity",
    producer: "ProducerD",
    bpm: "115 BPM",
    price: "$28.00",
  },
  {
    id: 5,
    image: "/products/cart5.jpg",
    title: "Journey",
    producer: "ProducerE",
    bpm: "135 BPM",
    price: "$32.00",
  },
  {
    id: 6,
    image: "/products/cart6.jpg",
    title: "Echoes",
    producer: "ProducerF",
    bpm: "125 BPM",
    price: "$27.00",
  },
  {
    id: 7,
    image: "/products/cart7.jpg",
    title: "Vibration",
    producer: "ProducerG",
    bpm: "150 BPM",
    price: "$40.00",
  },
  {
    id: 8,
    image: "/products/cart8.jpg",
    title: "Rhythm",
    producer: "ProducerH",
    bpm: "100 BPM",
    price: "$22.00",
  },
  {
    id: 9,
    image: "/products/cart1.jpg", // Using existing images for dummy data
    title: "Pulse",
    producer: "ProducerI",
    bpm: "128 BPM",
    price: "$31.00",
  },
  {
    id: 10,
    image: "/products/cart2.jpg",
    title: "Groove",
    producer: "ProducerJ",
    bpm: "118 BPM",
    price: "$26.00",
  },
  {
    id: 11,
    image: "/products/cart3.jpg",
    title: "Beat",
    producer: "ProducerK",
    bpm: "132 BPM",
    price: "$33.00",
  },
  {
    id: 12,
    image: "/products/cart4.jpg",
    title: "Melody",
    producer: "ProducerL",
    bpm: "105 BPM",
    price: "$24.00",
  },
];

const tracksPerPage = 8;

const RelatedTracks = () => {
  const [displayedTracks, setDisplayedTracks] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setDisplayedTracks(tracksData.slice(0, tracksPerPage));
    setHasMore(tracksData.length > tracksPerPage);
  }, []);

  const loadMoreTracks = () => {
    const currentLength = displayedTracks.length;
    const nextTracks = tracksData.slice(
      currentLength,
      currentLength + tracksPerPage,
    );
    setDisplayedTracks((prevTracks) => [...prevTracks, ...nextTracks]);

    if (currentLength + nextTracks.length >= tracksData.length) {
      setHasMore(false);
    }
  };

  return (
    <div>
      <div>
        <div className="mx-auto flex max-w-7xl items-center justify-center">
          <div className="">
            <div className="flex items-center gap-20 px-3 pb-5 sm:mb-9">
              <h2 className="md:text-xxl font-['Poppins'] text-lg font-[600] text-white sm:text-2xl lg:text-2xl">
                Related Tracks
              </h2>
              <button className="rounded-lg border border-white px-4 py-1 font-['Poppins'] text-sm text-white transition-colors hover:bg-white hover:text-[#2d005d] sm:px-6 sm:py-2 sm:text-base md:text-xl">
                View All
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 px-3 md:grid-cols-2 lg:grid-cols-4">
              {displayedTracks.map((track) => (
                <div
                  key={track.id}
                  className="sm: flex w-full flex-col items-start justify-start gap-5"
                  style={{
                    background: "rgba(255, 255, 255, 0.10)",
                    borderRadius: "8px",
                    height: "24rem",
                  }}
                >
                  <img
                    className="h-60 self-stretch rounded object-cover"
                    src={track.image}
                    alt={track.title}
                  />
                  <div className="flex flex-col items-start justify-start gap-[5px] self-stretch px-6">
                    <div className="flex w-full items-center justify-between">
                      <div className="h-5 w-20 justify-center text-center font-['Poppins'] text-2xl font-[600] text-orange-200 capitalize">
                        {track.title}
                      </div>
                      <div className="font-['Poppins'] text-base font-[400] text-orange-200 capitalize">
                        {track.bpm}
                      </div>
                    </div>

                    <div className="h-5 w-20 justify-start pt-1 text-center font-['Poppins'] text-sm font-[400] text-neutral-200">
                      {track.producer}
                    </div>
                  </div>
                  <div className="mt-auto flex w-full items-center justify-between px-6 pb-2">
                    <div className="font-['Poppins'] text-lg font-[600] text-white capitalize">
                      {track.price}
                    </div>
                    <button className="flex h-11 w-28 items-center justify-center rounded-lg bg-gradient-to-b from-orange-200 to-yellow-500 p-2.5 font-['Poppins'] text-lg font-[600] text-zinc-800 capitalize">
                      Buy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Learn more button part */}
        <div className="mx-auto flex items-center justify-center py-0 pt-10 lg:py-8">
          {hasMore && (
            <div
              className="inline-flex items-center justify-center gap-1 rounded-md p-[1px] shadow-2xl transition-all duration-300 ease-in-out"
              style={{
                background: "linear-gradient(to bottom, #F5DEB3, #DAA520)",
                borderRadius: "8px",
              }}
            >
              <div
                className="inline-flex items-center justify-center gap-1 rounded-[7px] bg-[#43024F] px-12 py-3 transition-all duration-300 ease-in-out hover:bg-gradient-to-t hover:from-[#DAA520] hover:to-[#F5DEB3]"
                onClick={loadMoreTracks} // Call loadMoreTracks on click
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
              No more tracks to load.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RelatedTracks;
