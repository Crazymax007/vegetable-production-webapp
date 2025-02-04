import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getUserInfo } from "../services/authService";
import { motion } from "framer-motion";

const LoadingSpinner = () => (
  <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-70 backdrop-blur-md">
    <motion.div
      className="w-16 h-16 border-4 border-gray-400 border-t-gray-100 rounded-full"
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        duration: 1,
        ease: "linear",
      }}
    ></motion.div>
    <p className="absolute text-white text-lg mt-20">Loading...</p>
  </div>
);

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
        setLoading(false);
        // setTimeout(() => setLoading(false), 1000);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <LoadingSpinner />; // ใช้ Spinner ที่ปรับแต่ง

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
