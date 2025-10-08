import { useState, useEffect, useRef, useMemo } from "react";
import { FaFilter, FaSearch } from "react-icons/fa";
import {
  MdDocumentScanner,
  MdWarning,
  MdCheckCircle,
  MdCancel,
} from "react-icons/md";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { IoWarningSharp } from "react-icons/io5";
import toast, { Toaster } from "react-hot-toast";

import { useAuth } from "../../../featured/auth/AuthContext";
import { RecordsCard } from "./components/RecordsCard";
import { StatusCard } from "./components/StatusCard";
import { HeaderSection } from "./components/HeaderSection";
import { getData } from "./../../../utils/axiosInstance";

// -------------------- Filter Dropdown --------------------
const FilterDropdown = ({ value, options, filterType, handleFilterChange }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setOpen(!open);
  };

  const handleSelect = (option) => {
    handleFilterChange(filterType, option);
    setOpen(false);
    // Only clear search for user and vehicle dropdowns
    if (filterType === "user" || filterType === "vehicle") {
      setSearch("");
    }
  };

  const filteredOptions = useMemo(() => {
    // For status and dateRange dropdown, don't apply search filtering
    if (filterType === "status" || filterType === "dateRange") {
      return options;
    }

    // Don't filter "All Users", "All Vehicles" from search
    const isDefaultOption = (opt) =>
      opt === "All Users" || opt === "All Vehicles";

    return options.filter((opt) => {
      // Always show default "All" options
      if (isDefaultOption(opt)) return true;
      // Filter other options by search term
      return opt.toLowerCase().includes(search.toLowerCase().trim());
    });
  }, [options, search, filterType]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
        // Only clear search for user and vehicle dropdowns
        if (filterType === "user" || filterType === "vehicle") {
          setSearch("");
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterType]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={toggleDropdown}
        className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-black shadow-sm hover:border-gray-400 focus:ring-2 focus:ring-blue-200 focus:outline-none"
      >
        <span className="text-black">{value}</span>
        <div className="flex items-center gap-2">
          {/* Only show search icon for user and vehicle dropdowns */}
          {(filterType === "user" || filterType === "vehicle") && (
            <FaSearch className="h-3 w-3 text-gray-500" />
          )}
          {open ? (
            <BsChevronUp className="h-4 w-4 text-gray-600" />
          ) : (
            <BsChevronDown className="h-4 w-4 text-gray-600" />
          )}
        </div>
      </div>

      {open && (
        <div className="absolute z-[9999] mt-1 max-h-[300px] w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
          {/* Only show search input for user and vehicle dropdowns */}
          {(filterType === "user" || filterType === "vehicle") && (
            <div className="sticky top-0 border-b border-gray-200 bg-white">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 text-sm text-black placeholder-gray-500 focus:outline-none"
                autoFocus
              />
            </div>
          )}
          <ul className="max-h-[250px] overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, idx) => (
                <li
                  key={`${filterType}-${idx}-${option}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(option);
                  }}
                  className="cursor-pointer px-4 py-2 text-sm text-black transition-colors duration-150 hover:bg-blue-100 hover:text-blue-700"
                >
                  {option}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-sm text-black">No options found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

// -------------------- Records Component --------------------
const Records = () => {
  const { user } = useAuth();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    user: "All Users",
    vehicle: "All Vehicles",
    status: "All Status",
    dateRange: "All Date Range",
  });

  const [allChecks, setAllChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const initialFetchRef = useRef(true);

  const toggleFilterSection = (e) => {
    e.stopPropagation();
    setIsFilterOpen((prev) => !prev);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  // -------------------- Get Overall Status --------------------
  const getOverallStatus = (check) => {
    if (!check.itemResponses || check.itemResponses.length === 0)
      return "no-items";
    const statuses = check.itemResponses.map((i) => i.status.toUpperCase());
    if (statuses.includes("FAULTY")) return "faulty";
    if (statuses.every((s) => s === "CORRECT")) return "correct";
    return "unknown";
  };

  const getStatusBadge = (check) => {
    const overallStatus = getOverallStatus(check);
    const statusMap = {
      correct: { icon: <MdWarning />, color: "amber", text: "Warning" },
      faulty: { icon: <MdCancel />, color: "red", text: "Failed" },
      "no-items": { icon: <MdWarning />, color: "amber", text: "No Items" },
      unknown: { icon: <MdWarning />, color: "amber", text: "Unknown" },
    };

    if (check.status?.toLowerCase() === "completed") {
      return (
        <div className="inline-flex items-center gap-1 rounded-full bg-green-200 px-2 py-1 text-xs font-medium text-green-700 sm:text-sm">
          <MdCheckCircle />
          <span>Passed</span>
        </div>
      );
    }

    const { icon, color, text } = statusMap[overallStatus] || statusMap.unknown;
    const colorClasses = {
      green: "bg-green-200 text-green-700",
      amber: "bg-amber-100 text-amber-700",
      red: "bg-red-200 text-red-600",
    };
    return (
      <div
        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium sm:text-sm ${colorClasses[color]}`}
      >
        {icon}
        <span>{text}</span>
      </div>
    );
  };

  // -------------------- Fetch Data --------------------
  const fetchChecks = async () => {
    setLoading(true);
    setError(null);
    try {
      let page = 1;
      const limit = 100;
      let tempChecks = [];
      let hasMore = true;

      while (hasMore) {
        const queryParams = { page, limit };
        const response = await getData("checks/all-checks", null, queryParams);
        const pageChecks =
          response?.checks || response?.data?.checks || response?.data || [];
        tempChecks = [...tempChecks, ...pageChecks];
        if (pageChecks.length < limit) hasMore = false;
        else page++;
      }

      setAllChecks(tempChecks);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch record. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------- Helper function to extract user names --------------------
  const getUserName = (check) => {
    // Try different possible paths for user name
    if (check.completedBy?.name) return check.completedBy.name;
    if (check.completedBy?.username) return check.completedBy.username;
    if (check.completedBy?.email) return check.completedBy.email;
    if (check.user?.name) return check.user.name;
    if (check.user?.username) return check.user.username;
    if (check.userName) return check.userName;
    if (check.userEmail) return check.userEmail;
    return null;
  };

  // -------------------- Helper function to extract vehicle registration --------------------
  const getVehicleReg = (check) => {
    if (check.vehicleRegNo) return check.vehicleRegNo;
    if (check.vehicle?.regNo) return check.vehicle.regNo;
    if (check.vehicle?.registrationNo) return check.vehicle.registrationNo;
    if (check.vehicleReg) return check.vehicleReg;
    return null;
  };

  // -------------------- Helper function to check if a date falls within the selected range --------------------
  const isDateInRange = (checkDate, dateRange) => {
    if (!checkDate || dateRange === "All Date Range") return true;

    const today = new Date();
    const checkDateObj = new Date(checkDate);

    // Set time to start of day for accurate comparison
    today.setHours(0, 0, 0, 0);
    checkDateObj.setHours(0, 0, 0, 0);

    switch (dateRange) {
      case "Today": {
        return checkDateObj.getTime() === today.getTime();
      }

      case "Yesterday": {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return checkDateObj.getTime() === yesterday.getTime();
      }

      case "Last 7 Days": {
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return checkDateObj >= sevenDaysAgo && checkDateObj <= today;
      }

      case "Last 30 Days": {
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return checkDateObj >= thirtyDaysAgo && checkDateObj <= today;
      }

      case "This Month": {
        const thisMonthStart = new Date(
          today.getFullYear(),
          today.getMonth(),
          1,
        );
        const thisMonthEnd = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0,
        );
        return checkDateObj >= thisMonthStart && checkDateObj <= thisMonthEnd;
      }

      case "Last Month": {
        const lastMonthStart = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1,
        );
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        return checkDateObj >= lastMonthStart && checkDateObj <= lastMonthEnd;
      }

      case "Last 3 Months": {
        const threeMonthsAgo = new Date(today);
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        return checkDateObj >= threeMonthsAgo && checkDateObj <= today;
      }

      case "This Year": {
        const thisYearStart = new Date(today.getFullYear(), 0, 1);
        const thisYearEnd = new Date(today.getFullYear(), 11, 31);
        return checkDateObj >= thisYearStart && checkDateObj <= thisYearEnd;
      }

      default: {
        return true;
      }
    }
  };

  // -------------------- Filter Options --------------------
  const filterOptions = useMemo(() => {
    // Extract unique users - excluding "All Users" from search
    const users = allChecks
      .map((check) => getUserName(check))
      .filter((name) => name && name.trim() !== "" && name !== "All Users")
      .filter((name, index, arr) => arr.indexOf(name) === index) // Remove duplicates
      .sort(); // Sort alphabetically

    // Extract unique vehicles - excluding "All Vehicles" from search
    const vehicles = allChecks
      .map((check) => getVehicleReg(check))
      .filter((reg) => reg && reg.trim() !== "" && reg !== "All Vehicles")
      .filter((reg, index, arr) => arr.indexOf(reg) === index) // Remove duplicates
      .sort(); // Sort alphabetically

    return {
      user: ["All Users", ...users],
      vehicle: ["All Vehicles", ...vehicles],
      status: ["All Status", "Passed", "Warning", "Failed"],
      dateRange: [
        "All Date Range",
        "Today",
        "Last 7 Days",
        "Last 30 Days",
        "This Month",
        "Last Month",
        "Last 3 Months",
        "This Year",
      ],
    };
  }, [allChecks]);

  // -------------------- Filtered Checks for Table (FIXED) --------------------
  const filteredChecks = useMemo(() => {
    let result = allChecks;

    if (filters.user !== "All Users") {
      result = result.filter((c) => getUserName(c) === filters.user);
    }

    if (filters.vehicle !== "All Vehicles") {
      result = result.filter((c) => getVehicleReg(c) === filters.vehicle);
    }

    if (filters.status !== "All Status") {
      const statusFilter = filters.status.toLowerCase();
      result = result.filter((c) => {
        // Handle "Passed" status
        if (statusFilter === "passed") {
          return c.status?.toLowerCase() === "completed";
        }
        // Handle "Warning" status
        if (statusFilter === "warning") {
          return getOverallStatus(c) === "correct";
        }
        // Handle "Failed" status
        if (statusFilter === "failed") {
          return getOverallStatus(c) === "faulty";
        }
        return true;
      });
    }

    // Add date range filtering
    if (filters.dateRange !== "All Date Range") {
      result = result.filter((c) =>
        isDateInRange(c.createdAt || c.date || c.checkDate, filters.dateRange),
      );
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.id?.toLowerCase().includes(term) ||
          getVehicleReg(c)?.toLowerCase().includes(term) ||
          getUserName(c)?.toLowerCase().includes(term),
      );
    }

    return result;
  }, [allChecks, filters, searchTerm]);

  useEffect(() => {
    if (initialFetchRef.current) {
      fetchChecks();
      initialFetchRef.current = false;
    }
  }, []);

  const handleRefresh = () => {
    setSearchTerm("");
    setFilters({
      user: "All Users",
      vehicle: "All Vehicles",
      status: "All Status",
      dateRange: "All Date Range",
    });
    fetchChecks();
    toast.success("Data refreshed successfully");
  };

  // -------------------- Stats (FIXED onClick handlers) --------------------
  const stats = [
    {
      title: "Total Checks",
      value: allChecks.length,
      icon: <MdDocumentScanner className="h-6 w-6 text-blue-600" />,
      bgColor: "bg-blue-100",
      onClick: () => {
        setFilters((prev) => ({
          ...prev,
          status: "All Status",
        }));
      },
    },
    {
      title: "Passed",
      value: allChecks.filter((c) => c.status?.toLowerCase() === "completed")
        .length,
      icon: <MdCheckCircle className="h-6 w-6 text-green-600" />,
      bgColor: "bg-green-100",
      onClick: () => {
        setFilters((prev) => ({
          ...prev,
          status: "Passed",
        }));
      },
    },
    {
      title: "Warnings",
      value: allChecks.filter((c) => getOverallStatus(c) === "correct").length,
      icon: <IoWarningSharp className="h-6 w-6 text-yellow-600" />,
      bgColor: "bg-yellow-100",
      onClick: () => {
        setFilters((prev) => ({
          ...prev,
          status: "Warning",
        }));
      },
    },
    {
      title: "Failed",
      value: allChecks.filter((c) => getOverallStatus(c) === "faulty").length,
      icon: <MdCancel className="h-6 w-6 text-red-600" />,
      bgColor: "bg-red-100",
      onClick: () => {
        setFilters((prev) => ({
          ...prev,
          status: "Failed",
        }));
      },
    },
    {
      title: "Total Issues",
      value: allChecks.filter((c) => !c.status).length,
      icon: <IoWarningSharp className="h-6 w-6 text-yellow-600" />,
      bgColor: "bg-yellow-100",
      onClick: () => {
        setFilters((prev) => ({
          ...prev,
          status: "All Status",
        }));
      },
    },
  ];

  // -------------------- Render --------------------
  return (
    <div className="mt-[64px] min-h-screen bg-gray-50 px-5 py-5 md:mt-[64px] md:px-10 lg:mt-0">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="mx-auto max-w-full space-y-4 sm:space-y-6 md:space-y-8">
        <HeaderSection
          user={user}
          handleRefresh={handleRefresh}
          loading={loading}
          checks={filteredChecks}
        />
        <StatusCard stats={stats} />

        {/* Search + Filter Section */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2.5 transition-all duration-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 lg:max-w-2xl lg:flex-1">
              <FaSearch className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID, user, vehicle..."
                className="flex-1 bg-transparent text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={toggleFilterSection}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 focus:ring-2 focus:ring-blue-200 focus:outline-none lg:min-w-32"
            >
              <FaFilter className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">Filter</span>
              {isFilterOpen ? (
                <BsChevronUp className="h-4 w-4 text-gray-600" />
              ) : (
                <BsChevronDown className="h-4 w-4 text-gray-600" />
              )}
            </button>
          </div>

          {isFilterOpen && (
            <div className="border-t border-gray-200 bg-gray-50 p-4 sm:p-6">
              <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:gap-6">
                  <div className="">
                    <h4 className="mb-1 ml-1 text-black">User</h4>
                    <FilterDropdown
                      value={filters.user}
                      options={filterOptions.user}
                      filterType="user"
                      handleFilterChange={handleFilterChange}
                    />
                  </div>
                  <div className="">
                    <h4 className="mb-1 ml-1 text-black">Vehicle</h4>
                    <FilterDropdown
                      value={filters.vehicle}
                      options={filterOptions.vehicle}
                      filterType="vehicle"
                      handleFilterChange={handleFilterChange}
                    />
                  </div>
                  <div className="">
                    <h4 className="mb-1 ml-1 text-black">Date Range</h4>
                    <FilterDropdown
                      value={filters.dateRange}
                      options={filterOptions.dateRange}
                      filterType="dateRange"
                      handleFilterChange={handleFilterChange}
                    />
                  </div>
                  <div className="">
                    <h4 className="mb-1 ml-1 text-black">Status</h4>
                    <FilterDropdown
                      value={filters.status}
                      options={filterOptions.status}
                      filterType="status"
                      handleFilterChange={handleFilterChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Records Table */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="p-4 sm:p-6">
            <div className="mb-4 text-sm text-gray-600 sm:mb-6 sm:text-base">
              Daily Check Records ({filteredChecks.length})
              {searchTerm && (
                <span className="ml-2 text-blue-600">
                  - Search results for "{searchTerm}"
                </span>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="py-8 text-center text-red-500">{error}</div>
            ) : filteredChecks.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                {searchTerm
                  ? `No results found for "${searchTerm}"`
                  : "No records found"}
              </div>
            ) : (
              <RecordsCard
                checks={filteredChecks}
                getStatusBadge={getStatusBadge}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Records;
