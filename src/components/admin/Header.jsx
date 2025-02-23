import React, { useState } from "react";
import ProfileMenu from "./ProfileMenu";

const Header = ({ toggleSidebar, handleLogout }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <header className="bg-white px-6 py-3 shadow-md flex justify-between items-center border-b border-gray-200">
      <button
        className="md:hidden p-2 text-gray-500 bg-white border border-gray-200 rounded"
        onClick={toggleSidebar}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <div className="relative">
        <img
          src="/assets/images/profile.png"
          className="h-12 cursor-pointer"
          alt="Profile"
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        />
        <ProfileMenu isOpen={isProfileMenuOpen} onLogout={handleLogout} />
      </div>
    </header>
  );
};

export default Header;
