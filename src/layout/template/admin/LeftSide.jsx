import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiSettings,
  FiLink,
  FiFileText,
  FiFile,
  FiUsers,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { RiAdminLine } from "react-icons/ri";

// Sidebar navigation links
const navLinksData = [
  { name: "Admin", icon: <RiAdminLine />, path: "/admin" },
  {
    name: "User",
    icon: <FiUsers />,
    path: "/admin/user-management",
  },
  { name: "Records", icon: <FiFile />, path: "/admin/records" },
  { name: "Documents", icon: <FiFileText />, path: "/admin/documents" },
  { name: "Links", icon: <FiLink />, path: "/admin/links" },
  // { name: "Settings", icon: <FiSettings />, path: "/admin/settings" },
];

const LeftSide = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

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

        <div className="mt-4 mb-3 flex items-center justify-center">
          <h2 className="text-2xl font-semibold text-[#1276F9]">Admin Panel</h2>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col">
          {navLinksData.map((link) => (
            <a
              key={link.name}
              onClick={() => {
                navigate(link.path);
                setIsOpen(false); // close sidebar on mobile after click
              }}
              className={`font-semiboldExport CSVExport CSV relative flex cursor-pointer items-center gap-4 rounded-lg px-4 py-3 text-base capitalize transition-colors duration-200 ${
                isActive(link.path)
                  ? "text-blue-500"
                  : "text-neutral-400 hover:text-blue-500"
              }`}
            >
              {/* Left bar for active */}
              {isActive(link.path) && (
                <div className="absolute top-2 left-0 h-10 w-1 rounded-tr-sm rounded-br-sm bg-blue-500" />
              )}

              {/* Icon bubble */}
              <span
                className={`rounded-lg p-2 transition-colors duration-200 ${
                  isActive(link.path)
                    ? "bg-blue-500 text-white"
                    : "bg-neutral-700 text-white"
                }`}
              >
                {link.icon}
              </span>

              {/* Label */}
              <span className="whitespace-nowrap">{link.name}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default LeftSide;
