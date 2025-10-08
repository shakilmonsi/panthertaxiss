import React from "react";

const SearchAndFilter = ({
  searchTerm,
  handleSearchChange,
  limit,
  handleLimitChange,
}) => {
  return (
    <div className="controls mb-4 flex gap-4">
      <input
        type="text"
        placeholder="Search songs..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input rounded-md bg-neutral-800 p-2 text-white"
      />
      <select
        value={limit}
        onChange={handleLimitChange}
        className="limit-select rounded-md bg-neutral-800 p-2 text-white"
      >
        <option value="3">3 per page</option>
        <option value="5">5 per page</option>
        <option value="10">10 per page</option>
        <option value="20">20 per page</option>
      </select>
    </div>
  );
};

export default SearchAndFilter;
