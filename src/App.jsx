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
import AdminLayout from "./components/admin/AdminLayout";
import FarmersManagement from "./pages/farmersManagement/FarmersManagement";
import PlantManagement from "./pages/plantManagement/PlantManagement";
import UserManagement from "./pages/UserManagement/UserManagement";
import BuyerManagement from "./pages/buyerManagement/BuyerManagement";
import { SnackbarProvider } from 'notistack';

const App = () => {
  return (
    <SnackbarProvider maxSnack={3}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="farmers" element={<FarmersManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="plants" element={<PlantManagement />} />
            <Route path="buyer" element={<BuyerManagement />} />
          </Route>

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
    </SnackbarProvider>
  );
};

export default App;
