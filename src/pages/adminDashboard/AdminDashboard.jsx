import React from "react";
import { logout } from "../../services/authService";

const AdminDashboard = () => {
  
  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <div>
      <h1>Welcome to Admin Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default AdminDashboard;
