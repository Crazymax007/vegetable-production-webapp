import React, { useState } from "react";
import { logout } from "../../services/authService";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // ฟังก์ชันสำหรับ toggle ปิด/เปิด Sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`w-64 bg-gray-800 text-white p-6 ${
          isSidebarOpen ? "block" : "hidden"
        } md:block`}
      >
        <h2 className="text-2xl font-semibold text-center mb-8">
          Admin Sidebar
        </h2>
        <ul>
          <li className="mb-4 hover:bg-gray-700 p-2 rounded cursor-pointer">
            Dashboard
          </li>
          <li className="mb-4 hover:bg-gray-700 p-2 rounded cursor-pointer">
            Users
          </li>
          <li className="mb-4 hover:bg-gray-700 p-2 rounded cursor-pointer">
            Settings
          </li>
          <li className="mb-4 hover:bg-gray-700 p-2 rounded cursor-pointer">
            Logout
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-100 p-6 shadow-md flex justify-between items-center">
          {/* ปุ่ม toggle สำหรับ Sidebar (Hamburger Icon) */}
          <button
            className="md:hidden p-2 text-white bg-gray-800 rounded"
            onClick={toggleSidebar}
          >
            {/* Hamburger Icon (สามขีดแนวนอน) */}
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

          {/* เพิ่ม dropdown menu */}
          <div className="relative">
            <img
              src="/assets/images/profile.png"
              className="h-12 cursor-pointer"
              alt="Profile"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            />
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-gray-200 rounded-md shadow-lg py-1">
                <a
                  href="/map"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-400"
                >
                  เว็บไซต์สั่งปลูก
                </a>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-400"
                  onClick={handleLogout}
                >
                  ออกจากระบบ
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 bg-gray-50">
          <p className="text-xl text-gray-700">Welcome to the admin</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
