import React, { useState } from "react";
import { logout } from "../../services/authService";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import MainContent from "../../components/admin/MainContent";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <div className="flex h-screen">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <Header toggleSidebar={toggleSidebar} handleLogout={handleLogout} />
        <MainContent />
      </div>
    </div>
  );
};

export default AdminDashboard;
