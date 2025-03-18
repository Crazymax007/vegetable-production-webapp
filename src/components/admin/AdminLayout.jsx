import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { logout } from "../../services/authService";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen bg-gray-50 relative max-w-[100vw] overflow-x-hidden">
      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[70]"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div 
        className={`${isMobile ? 'fixed z-[80]' : ''}`}
        onMouseEnter={() => !isSidebarOpen && !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isSidebarOpen && !isMobile && setIsHovered(false)}
      >
        <Sidebar isSidebarOpen={isSidebarOpen} isMobile={isMobile} />
      </div>

      <div 
        className={`flex-1 flex flex-col transition-all duration-300 min-w-0 ${
          !isMobile && (isSidebarOpen || isHovered) ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        <Header
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          handleLogout={handleLogout}
        />
        <main className="flex-1 p-6 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
