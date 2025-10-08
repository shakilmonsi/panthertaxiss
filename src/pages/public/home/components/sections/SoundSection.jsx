import React from "react";

const SoundSection = () => {
  const kits = [
    {
      title: "Free Afrobeat Drum Kits",
      description:
        "Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry. Lorem Ipsum Has Been The Industry’s Standard Dummy Text Ever Since The 1500s.",
      imageUrl: "/image/sound.png",
    },
    {
      title: "Free Afrobeat Drum Kits",
      description:
        "Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry. Lorem Ipsum Has Been The Industry’s Standard Dummy Text Ever Since The 1500s.",
      imageUrl: "/image/sound.png",
    },
    {
      title: "Free Afrobeat Drum Kits",
      description:
        "Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry. Lorem Ipsum Has Been The Industry’s Standard Dummy Text Ever Since The 1500s.",
      imageUrl: "/image/sound.png",
    },
  ];
  return (
    <section className="bg-gradient-to-b from-[#150620] to-[#150630] text-center">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-4 text-4xl font-bold text-white">Sound Kits</h2>
        <p className="mx-auto mb-12 max-w-3xl text-lg text-white/80">
          Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting
          Industry. Lorem Ipsum Has Been The Industry’s Standard Dummy Text Ever
          Since The 1500s, When An Unknown Printer Took A Galley Of Type And
          Scrambled It To Make A Type Specimen Book.
        </p>

        <div className="grid grid-cols-1 justify-center gap-6 sm:grid-cols-2 md:grid-cols-3">
          {kits.map((kit, index) => (
            <div
              key={index}
              className="w-full overflow-hidden rounded-xl border border-neutral-200 bg-black shadow-md"
            >
              {/* Image Section */}
              <div className="relative">
                <img
                  src={kit.imageUrl}
                  alt={kit.title}
                  className="h-80 w-full object-cover"
                />
                <span className="absolute top-2 left-2 rounded bg-white px-3 py-1 text-sm font-medium text-black">
                  Free
                </span>
              </div>

              {/* Content Section */}
              <div className="flex flex-col gap-2 p-4">
                <h3 className="text-lg font-semibold text-white uppercase">
                  {kit.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/80">
                  {kit.description}
                </p>

                <button className="mt-4 w-40 rounded bg-gradient-to-b from-orange-200 to-yellow-500 px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90">
                  See Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SoundSection;
