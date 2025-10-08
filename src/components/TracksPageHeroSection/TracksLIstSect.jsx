import { FaShareAlt } from "react-icons/fa";
import { HiOutlineShoppingBag } from "react-icons/hi";

const TracksLIstSect = ({ tracks }) => {
  return (
    <section className="sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="overflow-x-auto border-b border-gray-500">
          <table className="min-w-full text-left text-xs text-white sm:text-sm md:text-base">
            <thead className="text-sm text-orange-300 sm:text-base md:text-xl">
              <tr>
                <th
                  className="px-2 py-3 text-center font-medium sm:px-4 sm:py-4"
                  colSpan={2}
                >
                  Title
                </th>
                <th className="px-2 py-3 font-medium sm:px-4 sm:py-4">Time</th>
                <th className="px-2 py-3 font-medium sm:px-4 sm:py-4">BPM</th>
                <th className="py-3 font-medium sm:py-4 md:px-4">Tags</th>
                <th className="py-3 font-medium md:px-4 md:py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-500">
              {tracks.length > 0 ? (
                tracks.map((track) => (
                  <tr key={track.id} className="transition hover:bg-white/5">
                    {/* Thumbnail + Title */}
                    <td className="py-2 sm:py-4" colSpan={2}>
                      <div className="flex items-center gap-2 sm:gap-4">
                        <img
                          src={track.thumbnail}
                          alt="Album"
                          className="h-8 w-8 rounded-sm object-cover sm:h-14 sm:w-14 md:h-20 md:w-20"
                        />
                        <span className="pr-3 text-[10px] text-neutral-300 sm:text-sm md:text-base">
                          {track.title}
                        </span>
                      </div>
                    </td>
                    {/* Time */}
                    <td className="px-4 py-2 text-xs text-neutral-400 sm:py-4 sm:text-sm md:px-2">
                      {track.time}
                    </td>
                    {/* BPM */}
                    <td className="py-2 text-xs text-neutral-400 sm:py-4 sm:text-sm md:px-4">
                      {track.bpm}
                    </td>
                    {/* Tags */}
                    <td className="py-2 sm:px-4 sm:py-4">
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {track.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="inline-block rounded-full bg-black/20 px-2 py-0.5 text-xs text-gray-400 capitalize sm:px-3 sm:py-1"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    {/* Actions */}
                    <td className="py-2 sm:py-4">
                      <div className="flex justify-end gap-1 md:gap-2">
                        <button className="rounded-md bg-zinc-800 p-1 transition hover:bg-zinc-700 sm:p-2">
                          <FaShareAlt className="text-xs text-white sm:text-sm md:text-base" />
                        </button>
                        <button className="flex items-center gap-1 rounded-md bg-gradient-to-b from-orange-200 to-yellow-500 px-2 py-1 text-xs font-semibold text-black md:px-3 md:py-2">
                          <HiOutlineShoppingBag className="text-xs sm:text-sm" />
                          <span>$30.00</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-4 text-center text-neutral-400">
                    No tracks found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default TracksLIstSect;
