import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  User,
  Users,
  FileText,
  Link,
  Settings,
} from "lucide-react";
import { HiOutlineChartBarSquare } from "react-icons/hi2";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { useAuth } from "../../../featured/auth/AuthContext";
import { getData } from "../../../utils/axiosInstance";

const navLinksData = [
  { name: "Dashboard", path: "/admin" },
  { name: "User Management", path: "user-management" },
  { name: "Records", path: "records" },
  { name: "Documents", path: "documents" },
  { name: "Links", path: "links" },
  { name: "Settings", path: "settings" },
];

const UserDashboard = () => {
  const [documents, setDocuments] = useState([]);
  // console.log(documents);

  const [stats, setStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) return; 
      setLoading(true);
      try {
        const [documentRes] = await Promise.all([
          getData("document/all-documents")
        ]);

        setDocuments(documentRes?.data || []);
      } catch (err) {
        setError("Failed to load dashboard data.");
        console.error("Dashboard data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);



  const handleStatClick = (title) => {
    let path = "";
    if (title === "Total Users") {
      path = navLinksData.find((link) => link.name === "User Management")?.path;
    } else if (title === "Active Records") {
      path = navLinksData.find((link) => link.name === "Records")?.path;
    } else if (title === "Documents") {
      path = navLinksData.find((link) => link.name === "Documents")?.path;
    } else if (title === "System Health") {
      path = navLinksData.find((link) => link.name === "Settings")?.path;
    }
    if (path) {
      navigate(path);
    } else {
      console.error(`Error: Path not found for title "${title}"`);
    }
  };

  const quickActions = [
    {
      label: "Add User",
      icon: <User className="h-5 w-5 sm:h-6 sm:w-6" />,
      borderColor: "border-blue-400",
      textColor: "text-blue-600",
      onClick: () => {
        const path = navLinksData.find(
          (link) => link.name === "User Management",
        )?.path;
        if (path) navigate(path);
      },
    },
    {
      label: "Upload Document",
      icon: <FileText className="h-5 w-5 sm:h-6 sm:w-6" />,
      borderColor: "border-green-400",
      textColor: "text-green-600",
      onClick: () => {
        const path = navLinksData.find(
          (link) => link.name === "Documents",
        )?.path;
        if (path) navigate(path);
      },
    },
    {
      label: "Add Link",
      icon: <Link className="h-5 w-5 sm:h-6 sm:w-6" />,
      borderColor: "border-yellow-400",
      textColor: "text-yellow-600",
      onClick: () => {
        const path = navLinksData.find((link) => link.name === "Links")?.path;
        if (path) navigate(path);
      },
    },
    {
      label: "System Settings",
      icon: <Settings className="h-5 w-5 sm:h-6 sm:w-6" />,
      borderColor: "border-pink-400",
      textColor: "text-pink-600",
      onClick: () => {
        const path = navLinksData.find(
          (link) => link.name === "Settings",
        )?.path;
        if (path) navigate(path);
      },
    },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const usersData = await getData("users");
        const activityData = await getData("activity");
        const documentsData = await getData("documents");
        const recordsData = await getData("records");

        const generatedStats = [
          {
            id: "1",
            title: "Total Users",
            value: usersData.length,
            growth: "+12.5% from last month",
          },
          {
            id: "2",
            title: "Active Records",
            value: recordsData.length, // এখানে recordsData.length ব্যবহার করা হয়েছে
            growth: "+8.2% from last month",
          },
          {
            id: "3",
            title: "Documents",
            value: documentsData.length, // এখানে documentsData.length ব্যবহার করা হয়েছে
            growth: "+3.1% from last month",
          },
          {
            id: "4",
            title: "System Health",
            value: "99.9%",
            growth: "+0.1% from last month",
          },
        ];

        setStats(generatedStats);
        setRecentActivity(activityData);
        setError(null);
      } catch (err) {
        setError(
          "Failed to fetch dashboard data. Please check if the JSON server is running and the endpoints are correct.",
        );
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const filterData = async () => {
      if (searchTerm.length > 0) {
        const usersData = await getData("users");
        const documentsData = await getData("documents");
        const recordsData = await getData("records");

        const combinedData = [
          ...usersData.map((item) => ({
            ...item,
            type: "User",
            path: "user-management",
          })),
          ...documentsData.map((item) => ({
            ...item,
            type: "Document",
            path: "documents",
          })),
          ...recordsData.map((item) => ({
            ...item,
            type: "Record",
            path: "records",
          })),
        ];

        const results = combinedData.filter(
          (item) =>
            (item.name &&
              item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.title &&
              item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.email &&
              item.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.description &&
              item.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase())),
        );
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    };
    filterData();
  }, [searchTerm]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-xl font-semibold text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center p-4 text-center">
        <p className="text-lg font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  const statIcons = [
    <Users className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6" />,
    <HiOutlineChartBarSquare className="h-5 w-5 text-pink-600 sm:h-6 sm:w-6" />,
    <FileText className="h-5 w-5 text-purple-600 sm:h-6 sm:w-6" />,
    <IoMdCheckmarkCircleOutline className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6" />,
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6 lg:p-8 xl:p-10">
      <div className="mx-auto max-w-full space-y-4 sm:space-y-6 md:space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl lg:text-4xl">
            Dashboard
          </h1>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            {/* Search Bar */}
            <div className="relative">
              <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm transition-all duration-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 sm:w-64 md:w-72">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {/* Search Results Dropdown */}
              {searchTerm && searchResults.length > 0 && (
                <div className="absolute top-full z-10 mt-2 max-h-64 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="cursor-pointer p-4 transition-colors hover:bg-gray-100"
                      onClick={() => {
                        navigate(result.path);
                        setSearchTerm("");
                      }}
                    >
                      <p className="font-semibold text-gray-800">
                        {result.name || result.title || "No Title"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {result.type} - {result.email || result.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* User Profile & Logout Section */}
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-gray-600 transition-colors hover:text-gray-800 sm:h-6 sm:w-6" />
              <div
                className="relative flex cursor-pointer items-center gap-2"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                ref={dropdownRef}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 sm:h-8 sm:w-8">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name || "Guest"}
                  </span>
                  <span className="text-xs text-gray-500 capitalize">
                    {user?.role || "Role"}
                  </span>
                </div>
                {/* Logout Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute top-full right-0 z-20 mt-2 w-40 rounded-md border border-gray-200 bg-white shadow-lg">
                    <button
                      onClick={() => {
                        logout();
                        navigate("/login");
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4 xl:gap-6">
          {stats?.map((stat, index) => (
            <div
              key={stat.id}
              onClick={() => handleStatClick(stat.title)}
              className="cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md sm:p-5 md:p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-1 sm:space-y-2">
                  <h3 className="text-sm font-medium text-gray-600 sm:text-base">
                    {stat.title}
                  </h3>
                  <p className="text-2xl font-[700] text-gray-900 sm:text-3xl md:text-4xl">
                    {stat.value}
                  </p>
                  <span className="text-xs text-[#15DF02] sm:text-base">
                    {stat.growth}
                  </span>
                </div>
                <div className="rounded-lg bg-blue-100 p-2 sm:p-3">
                  {statIcons[index]}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-lg font-[700] text-gray-900 sm:text-xl md:text-2xl">
            Recent Activity
          </h2>
          <div className="space-y-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {recentActivity?.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between border-b border-gray-100 p-4 transition-colors duration-200 last:border-b-0 hover:bg-gray-50 sm:p-5 md:p-6"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 sm:h-10 sm:w-10">
                    <User className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-[600] text-gray-900 sm:text-base">
                      {activity.description}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 sm:text-sm">
                  {activity.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-lg font-[600] text-gray-900 sm:text-xl md:text-2xl">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4 xl:gap-6">
            {quickActions.map((action, index) => (
              <div
                key={index}
                onClick={action.onClick}
                className={`cursor-pointer rounded-xl border-2 border-dashed p-4 text-center transition-all duration-200 hover:border-solid hover:bg-gray-50 hover:shadow-sm sm:p-5 md:p-6 ${action.borderColor}`}
              >
                <div className="flex flex-col items-center gap-2 sm:gap-1">
                  <div className={`rounded-lg p-2 ${action.textColor}`}>
                    {action.icon}
                  </div>
                  <span
                    className={`text-sm font-[600] sm:text-base ${action.textColor}`}
                  >
                    {action.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
