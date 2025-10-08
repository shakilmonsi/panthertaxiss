/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useContext, useState, useRef, useEffect, Fragment } from "react";
import { HiMiniArrowLeftStartOnRectangle } from "react-icons/hi2";
import { AuthContext } from "../../../featured/auth/AuthContext";
import { FaUserTie, FaTaxi } from "react-icons/fa6";
import { HiOutlineMenu, HiX } from "react-icons/hi";

const navLinks = [
  { id: "features", label: "Features", path: "#features" },
  { id: "pricing", label: "Pricing", path: "#pricing" },
  { id: "testimonials", label: "Testimonials", path: "#testimonials" },
];

const NavStyle = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const [isDesktopProfileMenuOpen, setIsDesktopProfileMenuOpen] =
    useState(false);
  const [isMobileProfileMenuOpen, setIsMobileProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const desktopProfileMenuRef = useRef(null);
  const mobileProfileMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // 🔥 FIX: Trial user দের access দেওয়ার জন্য logic update করা হলো
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";
  const isTrialing = user?.isTrialing || false;
  const isSubscribed = user?.isSubscribed || false;

  // ✅ Trial user OR Paid subscription user উভয়েই dashboard access পাবে
  const hasAccess = isAdmin || isTrialing || isSubscribed;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        desktopProfileMenuRef.current &&
        !desktopProfileMenuRef.current.contains(event.target)
      ) {
        setIsDesktopProfileMenuOpen(false);
      }
      if (
        mobileProfileMenuRef.current &&
        !mobileProfileMenuRef.current.contains(event.target)
      ) {
        setIsMobileProfileMenuOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !document
          .querySelector('button[aria-label="Toggle mobile menu"]')
          ?.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsDesktopProfileMenuOpen(false);
    setIsMobileProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const toggleDesktopProfileMenu = () => {
    setIsDesktopProfileMenuOpen((prev) => !prev);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileProfileMenu = () => {
    setIsMobileProfileMenuOpen((prev) => !prev);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
    setIsDesktopProfileMenuOpen(false);
    setIsMobileProfileMenuOpen(false);
  };

  // 🔥 FIX: Dashboard URL logic - Trial user দের dashboard access
  const getDashboardUrl = () => {
    if (!user) return "/";
    if (isAdmin) return "/admin";
    // ✅ Trial user OR Subscribed user উভয়েই dashboard যাবে
    if (hasAccess) return "/user-dashboard";
    return "/";
  };

  // 🔥 FIX: Dashboard link text - Trial user দের জন্য আলাদা text
  const getDashboardLinkText = () => {
    if (isAdmin) return "Admin Dashboard";
    if (isTrialing) return "Dashboard (Trial Active)";
    if (isSubscribed) return "User Dashboard";
    return "Get Subscription";
  };

  const profileImageUrl = user?.profile_pic || "/image/allProfile.png";

  return (
    <Fragment>
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
        <nav className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-1 rounded-xl border border-[#1276F9] p-2 sm:gap-2 sm:p-2"
          >
            <FaTaxi className="h-6 w-6 text-blue-600 sm:h-8 sm:w-8" />
            <span className="text-base font-semibold text-[#066ef5] sm:text-xl">
              TAXILOG UK
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 lg:flex">
            <ul className="flex items-center gap-6 text-base capitalize">
              {navLinks.map(({ label, path }) => (
                <li key={label}>
                  {path.startsWith("#") ? (
                    <HashLink
                      smooth
                      to={`/${path}`}
                      className="cursor-pointer text-base font-medium text-neutral-600 transition-colors hover:text-blue-600"
                    >
                      {label}
                    </HashLink>
                  ) : (
                    <Link
                      to={path}
                      className="cursor-pointer text-base font-medium text-neutral-600 transition-colors hover:text-blue-600"
                    >
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            {/* Buttons and Profile */}
            <div className="flex items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              <Link to="/">
                <button className="inline-flex h-8 w-20 items-center justify-center gap-1.5 rounded-md bg-blue-600 px-2 transition-colors duration-200 hover:bg-blue-700 sm:h-9 sm:w-24 sm:gap-2 sm:rounded-md sm:px-2.5 md:h-10 md:w-28 md:gap-2.5 md:rounded-lg md:px-3 lg:h-11 lg:w-32 lg:gap-3 lg:rounded-lg lg:px-4">
                  <span className="font-['Roboto'] text-xs leading-tight font-semibold text-white sm:text-sm md:text-base lg:text-base">
                    Get Started
                  </span>
                </button>
              </Link>

              {isAuthenticated ? (
                <div className="relative" ref={desktopProfileMenuRef}>
                  <img
                    src={profileImageUrl}
                    alt="User Profile"
                    className="h-7 w-7 cursor-pointer rounded-full border-2 border-blue-400 object-cover transition-colors duration-200 hover:border-blue-600 sm:h-8 sm:w-8 md:h-9 md:w-9 lg:h-10 lg:w-10"
                    onClick={toggleDesktopProfileMenu}
                  />
                  <div
                    className={`absolute top-full right-0 z-50 mt-2 w-48 origin-top-right rounded-lg border border-gray-200 bg-white p-2 shadow-lg transition-all duration-300 ease-out sm:w-52 md:w-56 lg:w-60 ${isDesktopProfileMenuOpen ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"}`}
                  >
                    <div className="border-b border-gray-200 px-3 py-2 sm:px-4 sm:py-3">
                      <p className="font-['Roboto'] text-xs font-semibold text-gray-800 sm:text-sm">
                        <span>Name: </span>
                        {user?.name || "N/A"}
                      </p>
                    </div>

                    {/* 🔥 FIX: Trial user এবং Subscribed user উভয়েই dashboard access পাবে */}
                    <Link
                      to={getDashboardUrl()}
                      className={`flex items-center gap-2 rounded-md px-3 py-2 font-['Roboto'] text-xs font-medium transition-colors sm:gap-3 sm:px-4 sm:py-2.5 sm:text-sm ${
                        hasAccess
                          ? "text-gray-700 hover:bg-gray-100"
                          : "text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                      }`}
                      onClick={() => setIsDesktopProfileMenuOpen(false)}
                    >
                      <FaUserTie className="h-3 w-3 text-gray-500 sm:h-4 sm:w-4" />
                      {getDashboardLinkText()}
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="mt-2 flex w-full items-center gap-2 rounded-md border-t border-gray-200 px-3 py-2 pt-2 text-left font-['Roboto'] text-xs font-medium text-red-500 transition-colors hover:bg-gray-100 sm:gap-3 sm:px-4 sm:py-2.5 sm:pt-3 sm:text-sm"
                    >
                      Logout
                      <HiMiniArrowLeftStartOnRectangle className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login">
                  <button className="inline-flex h-8 w-16 items-center justify-center rounded-md border border-blue-600 bg-transparent px-2 text-blue-600 transition-colors duration-200 hover:bg-blue-50 sm:h-9 sm:w-18 sm:rounded-md sm:px-3 md:h-10 md:w-20 md:rounded-lg md:px-4 lg:h-11 lg:w-24 lg:rounded-lg lg:px-5">
                    <span className="font-['Roboto'] text-xs leading-tight font-semibold sm:text-sm md:text-base lg:text-base">
                      Log In
                    </span>
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-3 lg:hidden">
            {isAuthenticated && (
              <div className="relative" ref={mobileProfileMenuRef}>
                <img
                  src={profileImageUrl}
                  alt="User Profile"
                  className="h-10 w-10 cursor-pointer rounded-full border-2 border-gray-200 object-cover transition-colors duration-200 hover:border-blue-300 sm:h-8 sm:w-8 md:h-9 md:w-9 lg:h-10 lg:w-10"
                  onClick={toggleMobileProfileMenu}
                />
                <div
                  className={`absolute top-full right-0 z-50 mt-2 w-48 origin-top-right rounded-lg border border-gray-200 bg-white p-2 shadow-lg transition-all duration-300 ease-out sm:w-52 md:w-56 lg:w-60 ${isMobileProfileMenuOpen ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"}`}
                >
                  <div className="border-b border-gray-200 px-3 py-2 sm:px-4 sm:py-3">
                    <p className="font-['Roboto'] text-xs font-semibold text-gray-800 sm:text-sm">
                      <span>Name: </span>
                      {user?.name || "N/A"}
                    </p>
                  </div>

                  {/* 🔥 FIX: Mobile menu তেও trial user access */}
                  <Link
                    to={getDashboardUrl()}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 font-['Roboto'] text-xs font-medium transition-colors sm:gap-3 sm:px-4 sm:py-2.5 sm:text-sm ${
                      hasAccess
                        ? "text-gray-700 hover:bg-gray-100"
                        : "text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                    onClick={() => setIsMobileProfileMenuOpen(false)}
                  >
                    <FaUserTie className="h-3 w-3 text-gray-500 sm:h-4 sm:w-4" />
                    {getDashboardLinkText()}
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-md border border-blue-700 bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-100 hover:text-red-800"
                  >
                    Logout
                    <HiMiniArrowLeftStartOnRectangle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
              className="rounded-md p-2 text-gray-900 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-inset"
            >
              {isMobileMenuOpen ? (
                <HiX className="h-6 w-6 text-blue-700" />
              ) : (
                <HiOutlineMenu className="h-6 w-6 text-blue-700" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div
            ref={mobileMenuRef}
            className={`absolute inset-x-0 top-full z-40 block w-full rounded-b-2xl border-t-[0.5px] border-b-2 border-blue-700 bg-white px-6 py-4 transition-all duration-300 ease-out lg:hidden ${isMobileMenuOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-4 opacity-0"}`}
          >
            <ul className="flex flex-col gap-4 capitalize">
              {navLinks.map(({ label, path }) => (
                <li key={label}>
                  {path.startsWith("#") ? (
                    <HashLink
                      smooth
                      to={`/${path}`}
                      className="border-1/5 block w-full cursor-pointer rounded-md border-b border-blue-200 p-2 font-[500] text-black transition-colors hover:bg-blue-600 hover:text-white"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {label}
                    </HashLink>
                  ) : (
                    <Link
                      to={path}
                      className="block w-full cursor-pointer rounded-md font-medium text-neutral-600 transition-colors hover:bg-gray-100 hover:text-blue-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-col items-center gap-3">
              <Link to="/" className="w-full">
                <button className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 py-2 text-white transition-colors duration-200 hover:bg-blue-700">
                  Get Started
                </button>
              </Link>
              {!isAuthenticated && (
                <Link to="/login" className="w-full">
                  <button className="inline-flex w-full items-center justify-center rounded-md border border-blue-600 bg-transparent py-2 text-blue-600 transition-colors duration-200 hover:bg-blue-50">
                    Log In
                  </button>
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>
    </Fragment>
  );
};

export default NavStyle;
