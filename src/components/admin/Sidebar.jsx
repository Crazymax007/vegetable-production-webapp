const Sidebar = ({ isSidebarOpen }) => {
  return (
    <div
      className={`w-64 bg-white text-black p-6 border-r border-gray-200 ${
        isSidebarOpen ? "block" : "hidden"
      } md:block`}
    >
      <h2 className="text-2xl font-semibold text-center mb-8">Admin Sidebar</h2>
      <ul>
        <li className="mb-4 hover:bg-gray-700 p-2 rounded cursor-pointer">
          Dashboard
        </li>
        <li className="mb-4 hover:bg-gray-700 p-2 rounded cursor-pointer">
          Users
        </li>
        <li className="mb-4 hover:bg-gray-700 p-2 rounded cursor-pointer">
          Settings
        </li>
        <li className="mb-4 hover:bg-gray-700 p-2 rounded cursor-pointer">
          Logout
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
