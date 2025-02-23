import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/loginPage/login";
import AdminDashboard from "./pages/adminDashboard/AdminDashboard";
import MapPage from "./pages/mapPage/MapPage";
import ProtectedRoute from "./components/ProtectedRoute";
import TopNavbar from "./components/TopNavbar";
import PlanPage from "./pages/planPage/PlanPage";
import ManagePage from "./pages/managePage/ManagePage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/map"
          element={
            <ProtectedRoute allowedRoles={["farmer", "manager", "admin"]}>
              <TopNavbar />
              <MapPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/plan"
          element={
            <ProtectedRoute allowedRoles={["manager", "admin"]}>
              <TopNavbar />
              <PlanPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/management"
          element={
            <ProtectedRoute allowedRoles={["farmer", "manager", "admin"]}>
              <TopNavbar />
              <ManagePage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
