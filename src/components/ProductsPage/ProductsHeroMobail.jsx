import { IoMdShare } from "react-icons/io";
import { MdEmojiFlags } from "react-icons/md";
import AudioWaveformPlayer from "./AudioWaveformPlayer";

const ProductsHeroMobail = () => {
  return (
    <div className="mx-auto flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-sm flex-col items-center justify-start gap-8 font-[Poppins] md:max-w-4xl md:flex-row md:gap-16">
        {/* Left Section: Image */}
        <div className="overflow-hidden rounded md:h-80 md:w-96">
          <img
            className="h-full w-full object-cover"
            src="/products/cart01.jpg"
            alt="Album Art"
          />
        </div>

        {/* Middle Section*/}
        <div className="inline-flex w-full flex-col items-center justify-start gap-8 md:w-[496px] md:items-start">
          <div className="flex flex-col items-center justify-start pt-3 md:items-start">
            <div className="self-stretch capitalize">
              <h3 className="text-2xl font-semibold text-white"> Soul Power</h3>
            </div>
            <div className="self-stretch font-normal text-white capitalize">
              <h2 className="text-center text-xl font-bold text-white">
                {"  "}
                By Edwin Bocage
              </h2>
            </div>
          </div>

          {/* Right Section */}
          <div className="grid grid-cols-3 gap-x-9 gap-y-4 md:inline-flex md:flex-col md:items-start md:justify-start md:gap-3">
            {/* YEAR */}
            <div className="flex flex-col items-center justify-start md:items-start">
              <div className="font-[Inter] text-xs font-[400] text-white">
                YEAR
              </div>
              <div className="py-2 text-base font-semibold text-white capitalize md:py-6 md:text-lg">
                2020
              </div>
            </div>
            {/* GENRES */}
            <div className="flex flex-col items-center justify-start md:items-start">
              <div className="font-[Inter] text-xs font-[400] text-white">
                GENRES
              </div>
              <div className="py-2 text-base font-semibold text-white capitalize md:py-6 md:text-lg">
                Funk
              </div>
            </div>
            {/* BPM */}
            <div className="flex flex-col items-center justify-start md:items-start">
              <div className="font-[Inter] text-xs font-[400] text-white">
                BPM
              </div>
              <div className="py-2 text-base font-semibold text-white capitalize md:py-6 md:text-lg">
                120
              </div>
            </div>
            {/* PLAYS */}
            <div className="flex flex-col items-center justify-start md:items-start">
              <div className="font-[Inter] text-xs font-[400] text-white">
                PLAYS
              </div>
              <div className="py-2 text-base font-semibold text-white capitalize md:py-6 md:text-lg">
                5.2k
              </div>
            </div>
            {/* KEY */}
            <div className="flex flex-col items-center justify-start md:items-start">
              <div className="font-[Inter] text-xs font-[400] text-white">
                KEY
              </div>
              <div className="py-2 text-base font-semibold text-white capitalize md:py-6 md:text-lg">
                AM
              </div>
            </div>
            {/* LABEL */}
            <div className="flex flex-col items-center justify-start md:items-start">
              <div className="font-[Inter] text-xs font-[400] text-white">
                LABEL
              </div>
              <div className="py-2 text-base font-semibold text-white capitalize md:py-6 md:text-lg">
                Hi-Tec
              </div>
            </div>
          </div>

          <AudioWaveformPlayer />
          <div className="inline-flex items-center justify-center gap-6 md:justify-start">
            <button className="flex h-11 w-32 cursor-pointer items-center justify-center rounded-[30px] bg-gradient-to-b from-orange-200 to-yellow-500 px-2.5 text-base font-normal text-zinc-800 capitalize">
              Buy now
            </button>
            <div className="text-lg font-semibold text-white capitalize">
              $30.00
            </div>
            {/* Share Icon */}
            <div className="flex h-7 w-7 items-center justify-center rounded-[30px] bg-white/60">
              <IoMdShare className="font-bold text-white" />
            </div>
            {/* Flag Icon */}
            <div className="flex h-7 w-7 items-center justify-center rounded-[30px] bg-white/60">
              <MdEmojiFlags className="font-bold text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsHeroMobail;
