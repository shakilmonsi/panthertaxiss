import { FiPlay, FiPause } from "react-icons/fi";

const SongCard = ({ song, currentPlayingSong, isPlaying, handlePlaySong }) => {
  const isCurrentPlaying = currentPlayingSong?.id === song.id;

  return (
    <div
      key={song.id || `${song.title}-${song.artist}`}
      className="group relative w-48 max-w-[calc(50%-1rem)] sm:max-w-none"
    >
      <img
        src={song.image}
        alt={song.title}
        className="h-48 w-full rounded object-cover shadow-lg"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/products/cart1.jpg";
        }}
      />
      {song.audioUrl ? (
        <div
          className="bg-opacity-50 absolute inset-0 flex cursor-pointer items-center justify-center rounded opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          onClick={() => handlePlaySong(song)}
        >
          {isCurrentPlaying && isPlaying ? (
            <FiPause className="h-12 w-12 p-1 text-white" />
          ) : (
            <FiPlay className="h-12 w-12 p-1 text-white" />
          )}
        </div>
      ) : (
        <div className="bg-opacity-70 absolute inset-0 flex items-center justify-center rounded bg-black text-sm text-white/70">
          No Audio
        </div>
      )}

      <div className="mt-2 text-center">
        <p className="font-manrope max-w-[120px] truncate text-base leading-tight font-semibold text-neutral-200 sm:max-w-full sm:text-lg sm:leading-relaxed">
          {song.title}
        </p>
        <p className="font-manrope max-w-[120px] truncate text-xs leading-none font-normal text-neutral-300 sm:max-w-full sm:text-sm">
          {song.artist}
        </p>
        {isCurrentPlaying && isPlaying && (
          <p className="mt-1 animate-pulse text-xs text-green-400">
            Playing...
          </p>
        )}
      </div>
    </div>
  );
};

export default SongCard;
