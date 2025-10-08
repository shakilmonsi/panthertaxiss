import { IoMdShare } from "react-icons/io";
import { MdEmojiFlags } from "react-icons/md";
import AudioWaveformPlayer from "./AudioWaveformPlayer";

const ProductsHero = () => {
  return (
    <div className="mx-auto flex items-center justify-center">
      <div className="inline-flex min-w-[1200px] items-end justify-start gap-16 px-5 py-5 font-[Poppins]">
        {/* Left Section: Image */}
        <div className="h-80 w-96 overflow-hidden rounded">
          <img
            className="h-full w-full object-cover"
            src="/products/cart01.jpg"
            alt="Album Art"
          />
        </div>
        {/* Middle Section: Song Details */}
        <div className="inline-flex w-[496px] flex-col items-start justify-start gap-12">
          <div className="flex w-56 flex-col items-start justify-start">
            <div className="self-stretch text-4xl font-semibold text-white capitalize">
              Soul Power
            </div>
            <div className="self-stretch text-2xl font-normal text-white capitalize">
              By Edwin Bocage
            </div>
          </div>

          <AudioWaveformPlayer></AudioWaveformPlayer>

          <div className="inline-flex items-center justify-start gap-6">
            <button className="flex h-11 w-32 cursor-pointer items-center justify-center rounded-[30px] bg-gradient-to-b from-orange-200 to-yellow-500 px-2.5 text-base font-normal text-zinc-800 capitalize">
              Buy now
            </button>
            <div className="w-24 text-lg font-semibold text-white capitalize">
              $30.00
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded-[30px] bg-white/60">
              <IoMdShare className="font-bold text-white" />
            </div>
            {/* flag Icon */}
            <div className="flex h-7 w-7 items-center justify-center rounded-[30px] bg-white/60">
              <MdEmojiFlags className="font-bold text-white" />
            </div>
          </div>
        </div>

        {/* Grouping these to control their layout more effectively using flex-col */}
        <div className="inline-flex flex-col items-start justify-start gap-3">
          <div className="mx-auto flex items-center justify-center gap-9">
            <div className="flex flex-col items-start justify-start">
              <div className="font-[Inter] text-xs font-[400] text-white">
                YEAR
              </div>
              <div className="py-6 text-lg font-semibold text-white capitalize">
                2020
              </div>
            </div>
            {/* GENRES */}
            <div className="flex flex-col items-start justify-start">
              <div className="font-[Inter] text-xs font-[400] text-white">
                GENRES
              </div>
              <div className="py-6 text-lg font-semibold text-white capitalize">
                Funk
              </div>
            </div>
          </div>

          <div className="mx-auto flex items-center justify-center gap-9">
            <div className="flex flex-col items-start justify-start">
              <div className="font-[Inter] text-xs font-[400] text-white">
                BPM
              </div>
              <div className="py-6 text-lg font-semibold text-white capitalize">
                120
              </div>
            </div>
            {/* GENRES */}
            <div className="flex flex-col items-start justify-start">
              <div className="font-[Inter] text-xs font-[400] text-white">
                PLAYS
              </div>
              <div className="py-6 text-lg font-semibold text-white capitalize">
                5.2k
              </div>
            </div>
          </div>

          <div className="mx-auto flex items-center justify-center gap-9">
            <div className="flex flex-col items-start justify-start">
              <div className="font-[Inter] text-xs font-[400] text-white">
                KEY
              </div>
              <div className="py-6 text-lg font-semibold text-white capitalize">
                AM
              </div>
            </div>
            {/* GENRES */}
            <div className="flex flex-col items-start justify-start">
              <div className="font-[Inter] text-xs font-[400] text-white">
                LABEL
              </div>
              <div className="py-6 text-lg font-semibold text-white capitalize">
                Hi-Tec
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsHero;
