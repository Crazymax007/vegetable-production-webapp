const ProfileMenu = ({ isOpen, onLogout }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-36 bg-gray-200 rounded-md shadow-lg py-1">
      <a
        href="/map"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-400"
      >
        เว็บไซต์สั่งปลูก
      </a>
      <button
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-400"
        onClick={onLogout}
      >
        ออกจากระบบ
      </button>
    </div>
  );
};

export default ProfileMenu;
