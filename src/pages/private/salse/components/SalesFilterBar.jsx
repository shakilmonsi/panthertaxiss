import { useState } from "react";
import DatePicker from "react-datepicker";
import { FaCalendarAlt, FaFilter } from "react-icons/fa";
import { MdFilterList } from "react-icons/md";

const SalesFilterBar = ({
  activeFilter,
  setDateRange,
  setFilter,
  dateRange,
  filters,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="flex flex-wrap items-center justify-between rounded-lg text-white">
      {/* Time period selection */}
      <div className="flex flex-wrap gap-8">
        {filters.map((label) => (
          <div key={label} className="inline-flex w-fit flex-col items-center">
            <button
              className={`w-full capitalize ${
                activeFilter === label
                  ? "font-semibold text-white"
                  : "font-normal text-gray-300"
              }`}
              onClick={() => {
                setFilter(label);
                setShowPicker(false);
              }}
            >
              {label}
            </button>
            <div
              className={`mt-1 h-0.5 w-full transition-all duration-300 ${
                activeFilter === label ? "bg-white" : "bg-transparent"
              }`}
            />
          </div>
        ))}
      </div>

      {/* Right side actions */}
      <div className="mt-2 flex items-center gap-4 sm:mt-0">
        {/* Date Range Picker */}
        <div className="relative z-20">
          <button
            onClick={() => {
              setShowPicker(!showPicker);
              setFilter(""); // Clear quick filter
            }}
            className="flex items-center gap-2 rounded border border-gray-500 px-3 py-3 hover:bg-white/20"
          >
            <span className="font-poppins text-xs text-white">
              Select dates
            </span>
            <FaCalendarAlt className="text-[#979797]" size={16} />
          </button>

          {showPicker && (
            <div className="absolute right-0 mt-2 rounded-md p-0 shadow-lg">
              <DatePicker
                selectsRange
                startDate={dateRange.start}
                endDate={dateRange.end}
                onChange={(update) => {
                  const [start, end] = update;
                  setDateRange({ start, end });
                }}
                inline
              />
            </div>
          )}
        </div>

        {/* Filter Button */}
        <button className="flex items-center gap-2 rounded border border-gray-500 px-3 py-3 hover:bg-white/20">
          <MdFilterList className="text-[#979797]" />
          <span className="font-poppins text-xs text-white">Filters</span>
        </button>
      </div>
    </div>
  );
};

export default SalesFilterBar;
