import React, { useState } from "react";
import { Link } from "react-router";

const Header = ({ toggleSidebar, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <header className="bg-white sticky top-0 z-[60] px-4 lg:px-6 py-3 shadow-sm flex justify-between items-center border-b border-gray-200">
      <button
        className="p-2 flex items-center justify-center w-10 h-10 text-gray-500 bg-white border border-gray-200 rounded"
        onClick={toggleSidebar}
      >
        <svg
          width="16"
          height="12"
          viewBox="0 0 16 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z"
            fill="currentColor"
          />
        </svg>
      </button>

      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center text-gray-700 dropdown-toggle"
        >
          <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
            {/* <img src="/assets/images/profile.png" alt="User" /> */}
            <img src="/assets/images/profile.png" alt="User" />
          </span>
          <span className="block mr-1 font-bold">Admin</span>
          <svg
            className={`stroke-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
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

        {isOpen && (
          <div className="absolute right-0 mt-[17px] w-[260px] flex flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-lg">
            <ul className="flex flex-col gap-1 pb-3 border-b border-gray-200">
              <li>
                <Link
                  to="/map"
                  className="flex items-center gap-3 px-3 py-2  font-semibold text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100"
                  onClick={closeDropdown}
                >
                  เว็บไซต์สั่งปลูก
                </Link>
              </li>
            </ul>

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
    </header>
  );
};

export default Header;
