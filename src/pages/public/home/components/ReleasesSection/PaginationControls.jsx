import React from "react";

const PaginationControls = ({
  page,
  totalPages,
  totalSongs,
  handlePrevPage,
  handleNextPage,
}) => {
  return (
    <div className="pagination flex justify-center gap-4 py-4">
      <button
        onClick={handlePrevPage}
        disabled={page === 1}
        className="rounded-md bg-neutral-700 px-4 py-2 text-white disabled:opacity-50"
      >
        Previous
      </button>
      <span className="text-lg text-white">
        Page {page} of {totalPages} (Total Songs: {totalSongs})
      </span>
      <button
        onClick={handleNextPage}
        disabled={page >= totalPages}
        className="rounded-md bg-neutral-700 px-4 py-2 text-white disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default PaginationControls;
