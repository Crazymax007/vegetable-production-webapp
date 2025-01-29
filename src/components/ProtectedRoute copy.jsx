import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getUserInfo } from "../services/authService";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserInfo(); // ดึงข้อมูลผู้ใช้
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      } finally {
        setTimeout(() => setLoading(false), 1000);
        // setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading)
    return <div className="flex justify-center items-center">Loading...</div>; // แสดง Loading ระหว่างตรวจสอบ

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
