import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { logout } from "../../services/authService";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      <div 
        onMouseEnter={() => !isSidebarOpen && setIsHovered(true)}
        onMouseLeave={() => !isSidebarOpen && setIsHovered(false)}
      >
        <Sidebar isSidebarOpen={isSidebarOpen} />
      </div>
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen || isHovered ? "ml-64" : "ml-20"
        }`}
      >
        <Header
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          handleLogout={handleLogout}
        />
        <main className="flex-1 p-6 max-w-full overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
