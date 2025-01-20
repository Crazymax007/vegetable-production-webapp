import React from "react";
import { logout } from "../../services/authService";

const UserDashboard = () => {

  const handleLogout = () => {
    logout(); 
    window.location.reload()
  };
  return (
    <div>
      <h1>Welcome to Farmer Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default UserDashboard;
