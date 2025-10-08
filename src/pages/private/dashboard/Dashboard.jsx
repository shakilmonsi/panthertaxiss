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
import { useAuth } from "../../../featured/auth/AuthContext";
import { getData } from "../../../utils/axiosInstance";
import { formatDistanceToNow } from "date-fns";

const navLinksData = [
  { name: "Dashboard", path: "/admin" },
  { name: "User Management", path: "user-management" },
  { name: "Records", path: "records" },
  { name: "Documents", path: "documents" },
  { name: "Links", path: "links" },
  { name: "Settings", path: "settings" },
];

// Utility function to get first and last date of previous month
const getPreviousMonthDateRange = () => {
  const now = new Date();
  const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0); // last day of previous month
  return { firstDayLastMonth, lastDayLastMonth };
};

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [checks, setChecks] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [links, setLinks] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [stats, setStats] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isAuthenticated) return;
      setLoading(true);
      setError("");

      try {
        // Fetch current month data
        const [usersRes, documentsRes, checksRes, linksRes] = await Promise.all([
          getData("user"),
          getData("document/all-documents"),
          getData("checks/all-checks"),
          getData("links")
        ]);

        // Fetch last month totals
        const { firstDayLastMonth, lastDayLastMonth } = getPreviousMonthDateRange();
        const [prevUsersRes, prevDocumentsRes, prevChecksRes] = await Promise.all([
          getData(`user?start=${firstDayLastMonth.toISOString()}&end=${lastDayLastMonth.toISOString()}`),
          getData(`document/all-documents?start=${firstDayLastMonth.toISOString()}&end=${lastDayLastMonth.toISOString()}`),
          getData(`checks/all-checks?start=${firstDayLastMonth.toISOString()}&end=${lastDayLastMonth.toISOString()}`)
        ]);

        // Current totals
        const totalUsersCurrent = usersRes.data?.pagination?.total || 0;
        const totalDocumentsCurrent = documentsRes.data?.results?.length || 0;
        const totalChecksCurrent = checksRes.data?.checks?.filter(
          (check) => check.status?.toLowerCase() === "completed"
        ).length;

        // Previous month totals
        const totalUsersPrev = prevUsersRes.data?.pagination?.total || 0;
        const totalDocumentsPrev = prevDocumentsRes.data?.results?.length || 0;
        const totalChecksPrev = prevChecksRes.data?.checks?.filter(
          (check) => check.status?.toLowerCase() === "completed"
        ).length;

        // Function to calculate growth percentage
        const calcGrowth = (current, previous) => {
          if (previous === 0) return "N/A";
          const percent = ((current - previous) / previous) * 100;
          return `${percent.toFixed(1)}% from last month`;
        };

        // Update stats
        const updatedStats = [
          {
            id: "1",
            title: "Total Users",
            value: totalUsersCurrent,
            growth: calcGrowth(totalUsersCurrent, totalUsersPrev),
          },
          {
            id: "2",
            title: "Active Records",
            value: totalChecksCurrent,
            growth: calcGrowth(totalChecksCurrent, totalChecksPrev),
          },
          {
            id: "3",
            title: "Documents",
            value: totalDocumentsCurrent,
            growth: calcGrowth(totalDocumentsCurrent, totalDocumentsPrev),
          },
        ];

        setStats(updatedStats);
        setTotalUsers(totalUsersCurrent);
        setChecks(checksRes.data?.checks?.filter(
          (check) => check.status?.toLowerCase() === "completed"
        ));
        setDocuments(documentsRes.data?.results || []);
        setLinks(linksRes.data || []);

        // Recent Activities
        const fetchedActivities = [];
        const lastUser = usersRes.data?.users?.[0];
        if (lastUser) fetchedActivities.push({
          type: "New user registration",
          description: `New user registration by: ${lastUser.name}`,
          timestamp: lastUser.createdAt,
          icon: "user",
        });

        const lastDocument = documentsRes.data?.results?.[0];
        if (lastDocument) {
          const uploader = usersRes.data.users.find(u => u.id === lastDocument.userId);
          fetchedActivities.push({
            type: "Document uploaded",
            description: `Document uploaded by: ${uploader ? uploader.name : "Unknown User"}`,
            timestamp: lastDocument.createdAt,
            icon: "file",
          });
        }

        const lastLink = linksRes.data?.[0];
        if (lastLink) fetchedActivities.push({
          type: "Link verified",
          description: `Link verified: ${lastLink.title || lastLink.url}`,
          timestamp: lastLink.updatedAt,
          icon: "link",
        });

        setRecentActivities(fetchedActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));

      } catch (err) {
        setError("Failed to load dashboard data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated]);

  // Search logic remains unchanged
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length > 0 && isAuthenticated) {
        setSearchLoading(true);
        setSearchError(null);
        try {
          const usersRes = await getData(`user/user-search/${searchTerm}`);
          const documentsRes = await getData(`document/document-search/${searchTerm}`);
          const checksRes = await getData(`checks/checks-search/${searchTerm}`);
          const linksRes = await getData(`links/search/${searchTerm}`);

          const users = usersRes?.data?.users || [];
          const documents = documentsRes?.data?.documents || [];
          const checks = checksRes?.data?.checks || [];
          const links = linksRes?.data?.results || [];

          const combinedData = [
            ...users.map(item => ({ ...item, type: "User", path: navLinksData.find(l => l.name === "User Management")?.path || "/admin/user-management" })),
            ...documents.map(item => ({ ...item, type: "Document", path: navLinksData.find(l => l.name === "Documents")?.path || "/admin/documents" })),
            ...checks.map(item => ({ ...item, type: "Record", path: navLinksData.find(l => l.name === "Records")?.path || "/admin/records" })),
            ...links.map(item => ({ ...item, type: "Link", title: item.title || item.url, path: navLinksData.find(l => l.name === "Links")?.path || "/admin/links" }))
          ];

          setSearchResults(combinedData);
        } catch (err) {
          console.error(err);
          setSearchError("Failed to fetch search results.");
          setSearchResults([]);
        } finally {
          setSearchLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, isAuthenticated]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center"><p className="text-xl font-semibold text-gray-600">Loading...</p></div>;
  if (error) return <div className="flex h-screen items-center justify-center p-4 text-center"><p className="text-lg font-semibold text-red-500">{error}</p></div>;

  const statIcons = [
    <Users className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6" />,
    <HiOutlineChartBarSquare className="h-5 w-5 text-pink-600 sm:h-6 sm:w-6" />,
    <FileText className="h-5 w-5 text-purple-600 sm:h-6 sm:w-6" />,
  ];

  const handleStatClick = (title) => {
    const path = navLinksData.find(link => 
      (title === "Total Users" && link.name === "User Management") ||
      (title === "Active Records" && link.name === "Records") ||
      (title === "Documents" && link.name === "Documents")
    )?.path;
    if (path) navigate(path);
  };

  const quickActions = [
    {
      label: "Add User",
      icon: <User className="h-5 w-5 sm:h-6 sm:w-6" />,
      borderColor: "border-blue-400",
      textColor: "text-blue-600",
      onClick: () => navigate(navLinksData.find(link => link.name === "User Management")?.path)
    },
    {
      label: "Upload Document",
      icon: <FileText className="h-5 w-5 sm:h-6 sm:w-6" />,
      borderColor: "border-green-400",
      textColor: "text-green-600",
      onClick: () => navigate(navLinksData.find(link => link.name === "Documents")?.path)
    },
    {
      label: "Add Link",
      icon: <Link className="h-5 w-5 sm:h-6 sm:w-6" />,
      borderColor: "border-yellow-400",
      textColor: "text-yellow-600",
      onClick: () => navigate(navLinksData.find(link => link.name === "Links")?.path)
    },
    {
      label: "System Settings",
      icon: <Settings className="h-5 w-5 sm:h-6 sm:w-6" />,
      borderColor: "border-pink-400",
      textColor: "text-pink-600",
      onClick: () => navigate(navLinksData.find(link => link.name === "Settings")?.path)
    }
  ];

  return (
    <div className="mt-[60px] min-h-screen bg-gray-50 px-4 py-5 sm:px-4 md:mt-[64px] md:px-6 lg:mt-0 lg:px-8 xl:px-10">
      <div className="mx-auto max-w-full space-y-4 sm:space-y-6 md:space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900 md:text-[26px] lg:text-[32px]">
              Dashboard
            </h1>
            <div className="block lg:hidden">
               <div className="flex items-center gap-6 sm:gap-3">
              <Bell className="h-5 w-5 text-gray-600 transition-colors hover:text-gray-800 sm:h-6 sm:w-6" />
              <div
                className="relative flex cursor-pointer items-center gap-2"
                ref={dropdownRef}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {user?.profile_pic ? (
                  <img
                    src={user.profile_pic}
                    alt={`${user.name}'s profile`}
                    className="h-8 w-8 rounded-full border border-blue-500 object-cover p-[1px] shadow-2xl sm:h-8 sm:w-8"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-500 bg-blue-600 sm:h-8 sm:w-8">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}

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
              {searchTerm &&
                (searchResults.length > 0 || searchLoading || searchError) && (
                  <div className="absolute top-full z-10 mt-2 max-h-64 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
                    {searchLoading ? (
                      <div className="p-4 text-center text-gray-500">
                        Searching...
                      </div>
                    ) : searchError ? (
                      <div className="p-4 text-center text-red-500">
                        {searchError}
                      </div>
                    ) : searchResults.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No results found.
                      </div>
                    ) : (
                      searchResults.map((result, index) => (
                        <div
                          key={index}
                          className="cursor-pointer p-4 transition-colors hover:bg-gray-100"
                          onClick={() => {
                            navigate(result.path);
                            setSearchTerm(""); // Clear search term after navigating
                          }}
                        >
                          <p className="font-semibold text-gray-800">
                            {result.name || result.title || "No Title"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {result.type} -{" "}
                            {
                              result.email ||
                                result.description ||
                                result.uploadedBy ||
                                result.url /* Added URL for links */
                            }
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}
            </div>

            {/* User Profile & Logout Section */}
            <div className="hidden lg:block">
              <div className="flex items-center gap-6 sm:gap-3">
                <Bell className="h-5 w-5 text-gray-600 transition-colors hover:text-gray-800 sm:h-6 sm:w-6" />
                <div
                  className="relative flex cursor-pointer items-center gap-2"
                  ref={dropdownRef}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {user?.profile_pic ? (
                    <img
                      src={user.profile_pic}
                      alt={`${user.name}'s profile`}
                      className="h-8 w-8 rounded-full border border-blue-500 object-cover p-[1px] shadow-2xl sm:h-8 sm:w-8"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-500 bg-blue-600 sm:h-8 sm:w-8">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}

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
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 xl:gap-6">
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
            {loading ? ( // Display loading state if data is being fetched
              <p className="p-6 text-center text-gray-500">
                Loading activities...
              </p>
            ) : error ? ( // Display error message if fetching failed
              <p className="p-6 text-center text-red-500">{error}</p>
            ) : recentActivities.length > 0 ? ( // Display activities if available
              recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-gray-100 p-4 transition-colors duration-200 last:border-b-0 hover:bg-gray-50 sm:p-5 md:p-6"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 sm:h-10 sm:w-10">
                      {/* Dynamic Icons based on activity type */}
                      {activity.icon === "user" && (
                        <User className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
                      )}
                      {activity.icon === "file" && (
                        <FileText className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
                      )}
                      {activity.icon === "link" && (
                        <Link className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
                      )}
                      {activity.icon === "settings" && (
                        <Settings className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-[600] text-gray-900 sm:text-base">
                        {activity.description}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 sm:text-sm">
                    {/* Display time using formatDistanceToNow */}
                    {formatDistanceToNow(new Date(activity.timestamp), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              ))
            ) : (
              // Display message if no activities found
              <p className="p-6 text-center text-gray-500">
                No recent activity found.
              </p>
            )}
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
                className={`cursor-pointer rounded-xl border-2 border-dashed p-4 text-center transition-all duration-200 hover:border-solid hover:bg-gray-50 hover:shadow-md sm:p-5 md:p-6 ${action.borderColor}`}
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

export default Dashboard;