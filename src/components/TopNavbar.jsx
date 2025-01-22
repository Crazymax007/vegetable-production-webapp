import React, { useState } from "react";
import { logout } from "../services/authService";

const TopNavbar = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <nav className=" border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto py-5 px-20">
        <a href="/map" className="">
          <img src="/favicon.png" className="h-14" alt="Logo" />
        </a>
        <div className="flex items-center space-x-5">
          <a href="/map">
            <div className="bg-[#D9D9D9] flex items-center rounded-[66px] p-[3px] hover:bg-[#c8e29c]">
              <div className="bg-white rounded-full flex justify-center items-center p-1 w-[33px] h-[33px]">
                <img
                  src="/assets/images/map.png"
                  className="w-[90%] h-[90%] object-contain"
                  alt=""
                />
              </div>
              <span className="px-5 text-base">แผนที่</span>
            </div>
          </a>
          <a href="#">
            <div className="bg-[#D9D9D9] flex items-center rounded-[66px] p-[3px] hover:bg-[#c8e29c]">
              <div className="bg-white rounded-full flex justify-center items-center p-1 w-[33px] h-[33px]">
                <img
                  src="/assets/images/predictive-chart.png"
                  className="w-[90%] h-[90%] object-contain"
                  alt=""
                />
              </div>
              <span className="px-5 text-base">วางแผน</span>
            </div>
          </a>
          <a href="#">
            <div className="bg-[#D9D9D9] flex items-center rounded-[66px] p-[3px] hover:bg-[#c8e29c]">
              <div className="bg-white rounded-full flex justify-center items-center p-1 w-[33px] h-[33px]">
                <img
                  src="/assets/images/folder.png"
                  className="w-[90%] h-[90%] object-contain"
                  alt=""
                />
              </div>
              <span className="px-5 text-base">ข้อมูลผลผลิต</span>
            </div>
          </a>
        </div>

        <div className="relative flex items-center">
          <img
            src="/assets/images/profile.png"
            className="h-12 cursor-pointer"
            alt="Profile"
            onClick={toggleProfileMenu}
          />

          {isProfileMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-36 bg-gray-200 rounded-lg shadow-lg">
              <a
                href="/settings"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-400 hover:rounded-lg"
              >
                การตั้งค่า
              </a>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-400 hover:rounded-lg" 
              >
                ออกจากระบบ
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
