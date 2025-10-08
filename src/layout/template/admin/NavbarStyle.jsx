// src/components/Navbar.jsx
import React from "react";
import { FaBars, FaBell, FaRegUser } from "react-icons/fa";

const NavbarStyle = () => {
  return (
    <div className="flex w-full flex-col items-center justify-between gap-4 border-b border-stone-300 pb-3 md:flex-row">
      <h1 className="text-2xl font-semibold text-neutral-800 sm:text-3xl">
        Dashboard
      </h1>
      <div className="flex w-full flex-col items-center justify-end gap-4 sm:flex-row md:w-auto">
        <div className="flex max-w-sm flex-1 items-center gap-2.5 rounded-lg border border-gray-200 px-3 py-1.5">
          <FaBars className="h-4 w-4 text-neutral-600" />
          <input
            type="text"
            placeholder="Search...."
            className="flex-1 bg-transparent text-base font-normal text-neutral-600 focus:outline-none"
          />
        </div>
        <FaBell className="h-6 w-6 text-neutral-600" />
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 p-1">
          <FaRegUser className="h-4 w-4 text-white" />
        </div>
        <span className="text-base font-normal text-black">John Doe</span>
      </div>
    </div>
  );
};

export default NavbarStyle;
