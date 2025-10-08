import { FaShareAlt } from "react-icons/fa";

const Availabestems = () => {
  const tracks = [
    {
      id: 1,
      title: "NOLSTAGIA",
      time: "02:59",
      bpm: "103",
      tags: ["Afrobeat", "Inspiring"],
      thumbnail: "/products/cart9.png",
    },
    {
      id: 2,
      title: "NOLSTAGIA",
      time: "02:59",
      bpm: "103",
      tags: ["Afrobeat", "Inspiring"],
      thumbnail: "/products/cart9.png",
    },
    {
      id: 2,
      title: "NOLSTAGIA",
      time: "02:59",
      bpm: "103",
      tags: ["Afrobeat", "Inspiring"],
      thumbnail: "/products/cart9.png",
    },
    {
      id: 2,
      title: "NOLSTAGIA",
      time: "02:59",
      bpm: "103",
      tags: ["Afrobeat", "Inspiring"],
      thumbnail: "/products/cart9.png",
    },
    {
      id: 2,
      title: "NOLSTAGIA",
      time: "02:59",
      bpm: "103",
      tags: ["Afrobeat", "Inspiring"],
      thumbnail: "/products/cart9.png",
    },
    {
      id: 2,
      title: "NOLSTAGIA",
      time: "02:59",
      bpm: "103",
      tags: ["Afrobeat", "Inspiring"],
      thumbnail: "/products/cart9.png",
    },
    {
      id: 2,
      title: "NOLSTAGIA",
      time: "02:59",
      bpm: "103",
      tags: ["Afrobeat", "Inspiring"],
      thumbnail: "/products/cart9.png",
    },
    {
      id: 2,
      title: "NOLSTAGIA",
      time: "02:59",
      bpm: "103",
      tags: ["Afrobeat", "Inspiring"],
      thumbnail: "/products/cart9.png",
    },
  ];

  return (
    <section className="">
      <div className="mx-auto w-full max-w-7xl py-16">
        <div className="mb-9 flex items-center">
          <h2 className="gap-12 font-['Poppins'] text-lg font-[600] text-white md:text-4xl lg:pr-13 lg:text-3xl">
            Availabe stems
          </h2>
          <button className="rounded-lg border border-white px-6 py-2 font-['Poppins'] text-[24px] text-white transition-colors hover:bg-white hover:text-[#2d005d]">
            View All
          </button>
        </div>

        {/* Table Header */}
        <div className="mb-6 grid grid-cols-6 items-center gap-6 px-4 text-xl font-medium text-orange-200">
          <div className="col-span-2">
            <p className="text-center text-xl font-medium text-orange-200">
              Title
            </p>
          </div>
          <div>Time</div>
          <div>BPM</div>
          <div>Tags</div>
        </div>

        {/* Track List */}
        <div className="space-y-4">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="grid grid-cols-6 items-center gap-6 border-b border-gray-600 p-4"
            >
              {/* Cover + Title */}
              <div className="col-span-2 flex items-center gap-4">
                <img
                  src={track.thumbnail}
                  alt="Album"
                  className="h-20 w-20 rounded-sm"
                />
                <p className="text-lg text-neutral-500">{track.title}</p>
              </div>

              {/* Time */}
              <p className="text-lg text-neutral-400">{track.time}</p>
              {/* BPM */}
              <p className="text-lg text-neutral-400">{track.bpm}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {track.tags.map((tag, i) => (
                  <div
                    key={i}
                    className="inline-flex items-center justify-center gap-2.5 rounded-[50px] bg-black/20 px-3 py-2.5"
                  >
                    <p className="justify-center text-base font-normal text-gray-400 capitalize">
                      {tag}
                    </p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <button className="rounded-lg bg-zinc-900 px-4">
                  <FaShareAlt className="text-white" />
                </button>

                <button className="flex items-center gap-2 rounded-lg bg-gradient-to-b from-orange-200 to-yellow-500 px-4 py-2 font-semibold text-black">
                  <span>$30.00</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Availabestems;
