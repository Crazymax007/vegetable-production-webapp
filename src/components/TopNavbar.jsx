import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { logout, getUserInfo } from "../services/authService";

const TopNavbar = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [role, setRole] = useState(null); // เก็บ Role ของผู้ใช้
  const location = useLocation(); // ใช้สำหรับตรวจสอบเส้นทางปัจจุบัน

  // ดึงข้อมูลผู้ใช้เมื่อ Component โหลด
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user = await getUserInfo();
        setRole(user.role); // เก็บ Role จาก API
      } catch (error) {
        console.error("Failed to fetch user role:", error);
      }
    };
    fetchUserRole();
  }, []);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  // ฟังก์ชันตรวจสอบ Active
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-gay-200 border-solid border mb-[2%] sticky top-0 z-50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-[2%] py-5 px-20">
        <a href="/map" className="">
          <img src="/favicon.png" className="h-[39px]" alt="Logo" />
        </a>
        <div className="flex items-center space-x-5">
          <a href="/map">
            <div
              className={`flex items-center rounded-[66px] p-[3px] ${
                isActive("/map") ? "bg-[#c8e29c]" : "bg-[#D9D9D9]"
              } hover:bg-[#c8e29c]`}
            >
              <div className="bg-white rounded-full flex justify-center items-center p-1 w-[33px] h-[33px]">
                <img
                  src="/assets/images/map.png"
                  className="w-[90%] h-[90%] object-contain"
                  alt=""
                />
              </div>
              <span className="px-5 text-base">แผนที่</span>
            </div>
          </a>
          {/* แสดงเมนู "วางแผน" เฉพาะผู้ใช้ที่ไม่ใช่ farmer */}
          {role !== "farmer" && (
            <a href="/plan">
              <div
                className={`flex items-center rounded-[66px] p-[3px] ${
                  isActive("/plan") ? "bg-[#c8e29c]" : "bg-[#D9D9D9]"
                } hover:bg-[#c8e29c]`}
              >
                <div className="bg-white rounded-full flex justify-center items-center p-1 w-[33px] h-[33px]">
                  <img
                    src="/assets/images/predictive-chart.png"
                    className="w-[90%] h-[90%] object-contain"
                    alt=""
                  />
                </div>
                <span className="px-5 text-base">วางแผนการปลูกผัก</span>
              </div>
            </a>
          )}
          <a href="/management">
            <div
              className={`flex items-center rounded-[66px] p-[3px] ${
                isActive("/management") ? "bg-[#c8e29c]" : "bg-[#D9D9D9]"
              } hover:bg-[#c8e29c]`}
            >
              <div className="bg-white rounded-full flex justify-center items-center p-1 w-[33px] h-[33px]">
                <img
                  src="/assets/images/folder.png"
                  className="w-[90%] h-[90%] object-contain"
                  alt=""
                />
              </div>
              <span className="px-5 text-base">ข้อมูลผลผลิต</span>
            </div>
          </a>
        </div>

        <div className="relative">
          <button
            onClick={toggleProfileMenu}
            className="flex items-center text-gray-700 dropdown-toggle"
          >
            <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
              <img src="/assets/images/profile.png" alt="User" />
            </span>
            <svg
              className={`stroke-gray-500 transition-transform duration-200 ${
                isProfileMenuOpen ? "rotate-180" : ""
              }`}
              width="18"
              height="20"
              viewBox="0 0 18 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-[17px] w-[260px] flex flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-lg">
              {role === "admin" && (
                <ul className="flex flex-col gap-1 pb-3 border-b border-gray-200">
                  <li>
                    <a
                      href="/admin"
                      className="flex items-center gap-3 px-3 py-2 font-semibold text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      จัดการระบบ
                    </a>
                  </li>
                </ul>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 mt-3 font-semibold text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100"
              >
                <svg
                  className="fill-gray-500 group-hover:fill-gray-700"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497L14.3507 14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497L20.7507 5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.74501L14.3507 9.74501V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609L18.5007 4.74609C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609L19.2507 18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007ZM3.25073 11.9984C3.25073 12.2144 3.34204 12.4091 3.48817 12.546L8.09483 17.1556C8.38763 17.4485 8.86251 17.4487 9.15549 17.1559C9.44848 16.8631 9.44863 16.3882 9.15583 16.0952L5.81116 12.7484L16.0007 12.7484C16.4149 12.7484 16.7507 12.4127 16.7507 11.9984C16.7507 11.5842 16.4149 11.2484 16.0007 11.2484L5.81528 11.2484L9.15585 7.90554C9.44864 7.61255 9.44847 7.13767 9.15547 6.84488C8.86248 6.55209 8.3876 6.55226 8.09481 6.84525L3.52309 11.4202C3.35673 11.5577 3.25073 11.7657 3.25073 11.9984Z"
                    fill=""
                  />
                </svg>
                ออกจากระบบ
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
