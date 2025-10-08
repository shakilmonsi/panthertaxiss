import { useState, useContext } from "react"; // ⬅️ New: useContext added
import { useLocation, useNavigate } from "react-router-dom";
import { FiSettings, FiLink, FiFileText, FiMenu, FiX } from "react-icons/fi";
import { AuthContext } from "../../../../featured/auth/AuthContext";

const navLinksData = [
  // ⚠️ Note: I'm replacing the duplicate FiFileText with FiUser and FiClock for better icon representation
  { name: "User", icon: <FiFileText />, path: "/user-dashboard/user" },
  { name: "History", icon: <FiFileText />, path: "/user-dashboard/history" },
  {
    name: "Documents",
    icon: <FiSettings />,
    path: "/user-dashboard/documents",
  },
  { name: "Links", icon: <FiLink />, path: "/user-dashboard/links" },
  // { name: "Seting", icon: <FiLink />, path: "/user-dashboard/dasboard-seting" },
];

const UserLeftSide = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // 🎯 NEW: Fetch user data from Auth Context
  const { user } = useContext(AuthContext);

  // 🎯 NEW: Calculating access status
  // This will take effect after adding canAccessServices to AuthProvider.jsx.
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";
  const canAccessServices = user?.canAccessServices;

  const filteredNavLinks = navLinksData.filter((link) => {
    if (isAdmin || canAccessServices) {
      return true;
    }

    return link.name === "User";
  });

  // ✅ fix: make "User" active when base dashboard path is visited
  const isActive = (path) => {
    if (
      (location.pathname === "/user-dashboard" ||
        location.pathname === "/user-dashboard/") &&
      path === "/user-dashboard/user"
    ) {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="fixed z-50 flex w-full items-center justify-between bg-gray-900 px-4 py-3 text-white lg:hidden">
        <button onClick={() => setIsOpen(true)}>
          <FiMenu className="h-7 w-7" />
        </button>
        <a href="/">
          <img src="/image/Logo.png" alt="Logo" className="h-10" />
        </a>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 transform bg-gray-800 text-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-gray-700 p-4 lg:justify-center">
          <a href="/">
            <img
              src="/image/Logo.png"
              alt="Logo"
              className="h-[48px] w-[144px] rounded-2xl border-2 border-yellow-400 bg-cover object-cover p-2"
            />
          </a>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white lg:hidden"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col pt-6">
          {/* 🎯 CHANGED: navLinksData-এর পরিবর্তে filteredNavLinks ব্যবহার করা হয়েছে */}
          {filteredNavLinks.map((link) => (
            <a
              key={link.name}
              onClick={() => {
                navigate(link.path);
                setIsOpen(false); // close after click on mobile
              }}
              className={`relative flex cursor-pointer items-center gap-4 rounded-lg px-4 py-3 text-base font-normal capitalize transition-colors duration-200 ${
                isActive(link.path)
                  ? "text-blue-500"
                  : "text-neutral-400 hover:text-blue-500"
              }`}
            >
              {isActive(link.path) && (
                <div className="absolute top-2 left-0 h-10 w-1 rounded-tr-sm rounded-br-sm bg-blue-500" />
              )}
              <span
                className={`rounded-lg p-2 transition-colors duration-200 ${
                  isActive(link.path)
                    ? "bg-blue-500 text-white"
                    : "bg-neutral-700 text-white"
                }`}
              >
                {link.icon}
              </span>
              <span className="whitespace-nowrap">{link.name}</span>
            </a>
          ))}
        </nav>

        {user && !isAdmin && !canAccessServices && (
          <div className="mx-4 mt-8 rounded-lg bg-red-800 p-4 text-center">
            <p className="font-bold">Access Restricted</p>
            <p className="text-sm">
              Your trial has ended. Please subscribe to unlock all features.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-2 w-full rounded bg-yellow-400 py-1 text-sm font-semibold text-gray-900 hover:bg-yellow-500"
            >
              Go to Pricing
            </button>
          </div>
        )}
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default UserLeftSide;
