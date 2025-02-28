import { RxDashboard } from "react-icons/rx";
import { BsPeople } from "react-icons/bs";
import { GiPlantSeed } from "react-icons/gi";
import { Link, useLocation } from "react-router-dom";
import { PiUserCircleGearLight } from "react-icons/pi";
import { FaStore } from "react-icons/fa";

const Sidebar = ({ isSidebarOpen }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div
      className={`${
        isSidebarOpen ? "w-64" : "w-20 hover:w-64"
      } fixed top-0 left-0 h-screen bg-white text-black p-6 border-r border-gray-200 transition-all duration-300 md:block group`}
    >
      <div
        className={`flex justify-center items-center mb-8 ${
          !isSidebarOpen && "justify-center group-hover:justify-start"
        }`}
      >
        <img src="/favicon.png" alt="Admin Icon" className="w-10 h-10" />
        <span
          className={`text-2xl font-semibold ml-2 ${
            !isSidebarOpen && "hidden group-hover:inline"
          }`}
        >
          Admin
        </span>
      </div>
      <ul>
        <Link to="/admin">
          <li
            className={`mb-4 p-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center ${
              !isSidebarOpen && "justify-center group-hover:justify-start"
            } gap-2 ${
              isActive("/admin")
                ? "text-Green-button bg-[#e0ffd7]"
                : "hover:bg-gray-200"
            }`}
          >
            <RxDashboard
              className={`text-xl ${
                isActive("/admin") ? "text-Green-button" : ""
              }`}
            />
            <span
              className={`${!isSidebarOpen && "hidden group-hover:inline"}`}
            >
              หน้าหลัก
            </span>
          </li>
        </Link>

        <Link to="/admin/farmers">
          <li
            className={`mb-4 p-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center ${
              !isSidebarOpen && "justify-center group-hover:justify-start"
            } gap-2 ${
              isActive("/admin/farmers")
                ? "text-Green-button bg-[#e0ffd7]"
                : "hover:bg-gray-200"
            }`}
          >
            <BsPeople
              className={`text-xl ${
                isActive("/admin/farmers") ? "text-Green-button" : ""
              }`}
            />
            <span
              className={`${!isSidebarOpen && "hidden group-hover:inline"}`}
            >
              จัดการลูกสวน
            </span>
          </li>
        </Link>

        <Link to="/admin/users">
          <li
            className={`mb-4 p-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center ${
              !isSidebarOpen && "justify-center group-hover:justify-start"
            } gap-2 ${
              isActive("/admin/users")
                ? "text-Green-button bg-[#e0ffd7]"
                : "hover:bg-gray-200"
            }`}
          >
            <PiUserCircleGearLight
              className={`text-2xl ${
                isActive("/admin/users") ? "text-Green-button" : ""
              }`}
            />
            <span
              className={`${!isSidebarOpen && "hidden group-hover:inline"}`}
            >
              จัดการผู้ใช้
            </span>
          </li>
        </Link>

        <Link to="/admin/plants">
          <li
            className={`mb-4 p-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center ${
              !isSidebarOpen && "justify-center group-hover:justify-start"
            } gap-2 ${
              isActive("/admin/plants")
                ? "text-Green-button bg-[#e0ffd7]"
                : "hover:bg-gray-200"
            }`}
          >
            <GiPlantSeed
              className={`text-xl ${
                isActive("/admin/plants") ? "text-Green-button" : ""
              }`}
            />
            <span
              className={`${!isSidebarOpen && "hidden group-hover:inline"}`}
            >
              จัดการผัก
            </span>
          </li>
        </Link>

        <Link to="/admin/buyer">
          <li
            className={`mb-4 p-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center ${
              !isSidebarOpen && "justify-center group-hover:justify-start"
            } gap-2 ${
              isActive("/admin/buyer")
                ? "text-Green-button bg-[#e0ffd7]"
                : "hover:bg-gray-200"
            }`}
          >
            <FaStore
              className={`text-lg ${
                isActive("/admin/buyer") ? "text-Green-button" : ""
              }`}
            />
            <span
              className={`${!isSidebarOpen && "hidden group-hover:inline"}`}
            >
              จัดการผู้รับซื้อ
            </span>
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default Sidebar;
