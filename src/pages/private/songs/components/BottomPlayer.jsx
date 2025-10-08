import { BsMusicNoteList } from "react-icons/bs";
import {
  FaRandom,
  FaStepBackward,
  FaStepForward,
  FaRedoAlt,
  FaVolumeUp,
  FaFilter,
} from "react-icons/fa";
import { FaPause } from "react-icons/fa6";

const BottomPlayer = () => {
  return (
    <div className="flex h-28 w-full flex-col overflow-hidden bg-neutral-900/60 backdrop-blur-2xl">
      {/* Progress bar */}
      <div className="h-1 w-full bg-stone-500">
        <div className="h-full w-[581px] rounded-tr-[10px] rounded-br-[10px] bg-white" />
      </div>

      {/* Player content */}
      <div className="flex flex-1 items-center justify-between px-8">
        {/* Song info */}
        <div className="flex w-72 items-center gap-8">
          <div className="flex items-center gap-4">
            <img
              src="https://placehold.co/64x64"
              alt="Album cover"
              className="h-16 w-16 rounded-xl"
            />
            <div className="flex flex-col items-start gap-1">
              <h3 className="font-manrope text-lg leading-relaxed font-semibold text-white">
                Shape of You
              </h3>
              <p className="font-manrope text-sm leading-none font-normal text-neutral-300">
                Ed Sheeran
              </p>
            </div>
          </div>
          <button className="text-white transition-colors hover:text-red-500">
            <FaHeart size={24} />
          </button>
        </div>

        {/* Player controls */}
        <div className="flex items-center gap-6">
          <button className="text-white transition-colors hover:text-white/80">
            <FaRandom size={24} />
          </button>
          <button className="text-white transition-colors hover:text-white/80">
            <FaStepBackward size={24} />
          </button>
          <button className="text-white transition-transform hover:scale-110">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
              <FaPause size={24} className="text-black" />
            </div>
          </button>
          <button className="text-white transition-colors hover:text-white/80">
            <FaStepForward size={24} />
          </button>
          <button className="text-white transition-colors hover:text-white/80">
            <FaRedoAlt size={24} />
          </button>
        </div>

        {/* Time and volume controls */}
        <div className="flex items-center gap-6">
          <span className="font-manrope text-base font-normal text-neutral-400">
            1:45 / 4:42
          </span>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <button className="text-white transition-colors hover:text-white/80">
                <FaVolumeUp size={24} />
              </button>
              <div className="flex h-1 w-24 rounded-2xl bg-stone-500">
                <div className="h-full w-5/6 rounded-2xl bg-white" />
              </div>
            </div>
            <button className="text-white transition-colors hover:text-white/80">
              <BsMusicNoteList size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomPlayer;
