import { ChevronDown, Search, XCircle } from "lucide-react";

export const FilterDropdown = ({
  setIsOpen,
  isOpen,
  selected,
  typeSearchQuery,
  handleTypeSearchChange,
  clearTypeSearch,
  loading,
  filteredTypes,
  setSelected,
  setIsOpenStatus,
  isOpenStatus,
  selectedStatus,
  optionsStatus,
  setSelectedStatus,
  setIsOpenAllStatus,
  isOpenAllStatus,
  user,
}) => {
  return (
    <div className="grid w-full grid-cols-1 items-center gap-4 pb-10 sm:gap-5 md:grid-cols-2 md:gap-6">
      <div className="grid grid-cols-2 gap-4 sm:gap-5 md:gap-6">
        <div className="relative w-full">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex w-full appearance-none items-center justify-between rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 font-['Segoe_UI'] text-base font-[500] text-gray-500 shadow-sm"
          >
            {selected}
            <ChevronDown className="h-5 w-5 text-zinc-500" />
          </button>

          {isOpen && (
            <div className="absolute z-10 -mt-12 w-full rounded-[8px] bg-white shadow-[12px_12px_24px_0_rgba(18,118,249,0.16)]">
              {/* Search Input inside dropdown */}
              <div className="border-b border-gray-200 p-3">
                <div className="relative">
                  <Search className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search types..."
                    value={typeSearchQuery}
                    onChange={handleTypeSearchChange}
                    className="w-full rounded-md border border-gray-400 py-1.5 pr-8 pl-7 text-sm text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                  {typeSearchQuery && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearTypeSearch();
                      }}
                      className="absolute top-1/2 right-2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Dropdown list with scroll */}
              <div className="max-h-[300px] overflow-y-auto">
                {/* Loading state */}
                {loading ? (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    Loading types...
                  </div>
                ) : (
                  <ul>
                    {filteredTypes.length > 0 ? (
                      filteredTypes.map((type) => (
                        <li
                          key={type.id}
                          onClick={() => {
                            setSelected(type.name);
                            setIsOpen(false);
                            clearTypeSearch();
                          }}
                          className="cursor-pointer px-4 py-2 text-gray-700 transition-colors hover:bg-blue-50"
                        >
                          {type.name}
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2 text-sm text-gray-500">
                        No types found
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Status Dropdown */}
        <div className="relative w-full">
          <button
            onClick={() => setIsOpenStatus(!isOpenStatus)}
            className="flex w-full appearance-none items-center justify-between rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 font-['Segoe_UI'] text-base font-[500] text-gray-500 shadow-sm"
          >
            {selectedStatus}
            <ChevronDown className="h-5 w-5 text-zinc-500" />
          </button>

          {isOpenStatus && (
            <div className="absolute z-10 mt-2 max-h-[300px] w-full overflow-y-auto rounded-[8px] bg-white shadow-[12px_12px_24px_0_rgba(18,118,249,0.16)]">
              <ul>
                {optionsStatus.map((option) => (
                  <li
                    key={option}
                    onClick={() => {
                      setSelectedStatus(option);
                      setIsOpenStatus(false);
                    }}
                    className="cursor-pointer px-4 py-2 text-gray-700 hover:bg-blue-50"
                  >
                    {option}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      {/* Users Dropdown with Search - EXISTING */}
      <div className="relative w-full">
        <h2
          onClick={() => setIsOpenAllStatus(!isOpenAllStatus)}
          className="flex w-full appearance-none items-center rounded-lg border border-blue-100 bg-white px-3.5 py-2.5 font-['Segoe_UI'] text-lg font-bold text-blue-600 shadow-lg"
        >
          User By: <span className="pl-2 font-semibold">{user?.name || ""}</span>
        </h2>
      </div>
    </div>
  );
};
