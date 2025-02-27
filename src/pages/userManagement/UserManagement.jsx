import React, { useEffect, useState } from "react";
import {
  getUsers,
  addUser,
  deleteUser,
  updateUser,
} from "../../services/authService";
import { getFarmers } from "../../services/farmerService";
import Swal from "sweetalert2";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const usersPerPage = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // แยก state สำหรับฟอร์มเพิ่มและแก้ไข
  const [addFormData, setAddFormData] = useState({
    username: "",
    password: "",
    role: "",
    farmerId: "",
  });

  const [editFormData, setEditFormData] = useState({
    username: "",
    password: "",
    role: "",
    farmerId: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [farmers, setFarmers] = useState([]);

  // ✅ เรียกข้อมูลผู้ใช้จากระบบ
  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
      setTotalUsers(response.data.length);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // เพิ่มฟังก์ชันดึงข้อมูลลูกสวน
  const fetchFarmers = async () => {
    try {
      const response = await getFarmers();
      setFarmers(response.data);
    } catch (error) {
      console.error("Error fetching farmers:", error);
    }
  };

  // ❌ ลบผู้ใช้
  const handleDeleteUser = async (userId) => {
    const result = await Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการลบผู้ใช้คนนี้ใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, ลบเลย",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(userId);
        await Swal.fire("ลบสำเร็จ!", "ลบข้อมูลผู้ใช้เรียบร้อยแล้ว", "success");
        fetchUsers();
      } catch (error) {
        await Swal.fire(
          "เกิดข้อผิดพลาด!",
          "ไม่สามารถลบผู้ใช้ได้ กรุณาลองใหม่อีกครั้ง",
          "error"
        );
      }
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchFarmers();
  }, []);

  // ค้นหาผู้ใช้
  useEffect(() => {
    const results = users.filter((user) =>
      Object.values(user).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredUsers(results);
    setTotalUsers(results.length);
  }, [searchTerm, users]);

  // คำนวณข้อมูลสำหรับหน้าปัจจุบัน
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  // แยกฟังก์ชัน handleInputChange สำหรับแต่ละฟอร์ม
  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setAddFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // อัพเดทฟังก์ชัน handleSubmit สำหรับการเพิ่ม
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addUser(addFormData);
      await fetchUsers();
      setIsModalOpen(false);
      // รีเซ็ตฟอร์มเพิ่ม
      setAddFormData({
        username: "",
        password: "",
        role: "",
        farmerId: "",
      });

      await Swal.fire({
        icon: "success",
        title: "สำเร็จ!",
        text: "เพิ่มผู้ใช้เรียบร้อยแล้ว",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถเพิ่มผู้ใช้ได้ กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  // อัพเดทฟังก์ชัน handleEditClick
  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditFormData({
      username: user.username || "",
      role: user.role || "",
      farmerId: user.farmerId || "",
      password: "", // รีเซ็ตรหัสผ่านเป็นค่าว่าง
    });
    setIsEditModalOpen(true);
  };

  // อัพเดทฟังก์ชัน handleEditSubmit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(editingUser._id, editFormData);
      await fetchUsers();
      setIsEditModalOpen(false);
      setEditingUser(null);
      // รีเซ็ตฟอร์มแก้ไข
      setEditFormData({
        username: "",
        password: "",
        role: "",
        farmerId: "",
      });

      await Swal.fire({
        icon: "success",
        title: "สำเร็จ!",
        text: "แก้ไขข้อมูลผู้ใช้เรียบร้อยแล้ว",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถแก้ไขข้อมูลผู้ใช้ได้ กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  // เพิ่มฟังก์ชันสำหรับหาข้อมูลลูกสวนจาก ID
  const getFarmerInfo = (farmerId) => {
    const farmer = farmers.find((f) => f._id === farmerId);
    if (farmer) {
      return `${farmer.firstName} ${farmer.lastName} (${farmer.nickname})`;
    }
    return "-";
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="relative">
          <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
            <svg
              className="fill-gray-500"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                fill=""
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="ค้นหาผู้ใช้..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 xl:w-[430px]"
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-Green-button hover:bg-green-600 shadow-md text-white text-sm px-3 py-2 rounded-lg transition-colors"
        >
          เพิ่มผู้ใช้
        </button>
      </div>

      {/* ตารางแสดงข้อมูลผู้ใช้ */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <div className="overflow-hidden rounded-lg">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-6 py-4 font-bold text-gray-600 first:rounded-tl-lg w-[80px]">
                    ลำดับ
                  </th>
                  <th className="px-6 py-4 font-bold text-gray-600 w-[200px]">
                    ชื่อผู้ใช้
                  </th>
                  <th className="px-6 py-4 font-bold text-gray-600 w-[150px]">
                    รหัสผ่าน
                  </th>
                  <th className="px-6 py-4 font-bold text-gray-600 w-[150px]">
                    สิทธิ์การใช้งาน
                  </th>
                  <th className="px-6 py-4 font-bold text-gray-600 w-[200px]">
                    วันที่สร้าง
                  </th>
                  <th className="px-6 py-4 font-bold text-gray-600 last:rounded-tr-lg text-center w-[200px]">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-600">
                      {indexOfFirstUser + index + 1}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.username}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {user.password ? "••••••••" : "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {user.role === 'admin' ? 'ผู้ดูแลระบบ' : 
                       user.role === 'manager' ? 'ผู้จัดการ' : 
                       user.role === 'farmer' ? 'ลูกสวน' : user.role}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(user)}
                          className="bg-Green-button hover:bg-green-600 text-white shadow-md px-4 py-2 rounded-lg transition-colors"
                        >
                          แก้ไข
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="bg-red-600 hover:bg-red-700 text-white shadow-md px-4 py-2 rounded-lg transition-colors"
                        >
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* การแบ่งหน้า */}
        <div className="flex justify-center gap-2 mt-4 mb-4">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            หน้าแรก
          </button>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            ก่อนหน้า
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            if (
              pageNumber === 1 ||
              pageNumber === totalPages ||
              (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
            ) {
              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`px-4 py-2 text-sm rounded-lg ${
                    currentPage === pageNumber
                      ? "bg-Green-button text-white"
                      : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            } else if (
              pageNumber === currentPage - 3 ||
              pageNumber === currentPage + 3
            ) {
              return (
                <span
                  key={pageNumber}
                  className="px-4 py-2 text-sm text-gray-600"
                >
                  ...
                </span>
              );
            }
            return null;
          })}

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            ถัดไป
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            หน้าสุดท้าย
          </button>
        </div>
      </div>

      {/* Modal เพิ่มผู้ใช้ - ใช้ addFormData */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[70]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">เพิ่มผู้ใช้</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ชื่อผู้ใช้
                </label>
                <input
                  type="text"
                  name="username"
                  value={addFormData.username}
                  onChange={handleAddInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  รหัสผ่าน
                </label>
                <input
                  type="password"
                  name="password"
                  value={addFormData.password}
                  onChange={handleAddInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  บทบาท
                </label>
                <select
                  name="role"
                  value={addFormData.role}
                  onChange={handleAddInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="">เลือกบทบาท</option>
                  <option value="admin">ผู้ดูแลระบบ</option>
                  <option value="manager">ผู้จัดการ</option>
                  <option value="farmer">ลูกสวน</option>
                </select>
              </div>
              {addFormData.role === "farmer" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    เลือกลูกสวน
                  </label>
                  <select
                    name="farmerId"
                    value={addFormData.farmerId}
                    onChange={handleAddInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  >
                    <option value="">เลือกลูกสวน</option>
                    {farmers.map((farmer) => (
                      <option key={farmer._id} value={farmer._id}>
                        {farmer.firstName} {farmer.lastName} ({farmer.nickname})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white bg-Green-button rounded-lg hover:bg-green-600"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal แก้ไขผู้ใช้ - ใช้ editFormData */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[70]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">แก้ไขข้อมูลผู้ใช้</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ชื่อผู้ใช้
                </label>
                <input
                  type="text"
                  name="username"
                  value={editFormData.username}
                  onChange={handleEditInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  รหัสผ่าน
                </label>
                <input
                  type="password"
                  name="password"
                  value={editFormData.password}
                  onChange={handleEditInputChange}
                  placeholder="ใส่รหัสผ่านใหม่หากต้องการเปลี่ยน"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  บทบาท
                </label>
                <select
                  name="role"
                  value={editFormData.role}
                  onChange={handleEditInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="">เลือกบทบาท</option>
                  <option value="admin">ผู้ดูแลระบบ</option>
                  <option value="manager">ผู้จัดการ</option>
                  <option value="farmer">ลูกสวน</option>
                </select>
              </div>
              {editFormData.role === "farmer" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    เลือกลูกสวน
                  </label>
                  <select
                    name="farmerId"
                    value={editFormData.farmerId}
                    onChange={handleEditInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  >
                    <option value="">เลือกลูกสวน</option>
                    {farmers.map((farmer) => (
                      <option key={farmer._id} value={farmer._id}>
                        {farmer.firstName} {farmer.lastName} ({farmer.nickname})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingUser(null);
                  }}
                  className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white bg-Green-button rounded-lg hover:bg-green-600"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
