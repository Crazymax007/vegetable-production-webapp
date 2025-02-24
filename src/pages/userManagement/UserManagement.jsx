import React, { useEffect, useState } from "react";
import { getFarmers, addFarmer } from "../../services/farmerService";
import Swal from "sweetalert2";

const UserManagement = () => {
  const [farmers, setFarmers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalFarmers, setTotalFarmers] = useState(0);
  const farmersPerPage = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nickname: "",
    phone: "",
    location: {
      latitude: "",
      longitude: "",
    },
  });

  // ✅ เรียกข้อมูลลูกสวนจากระบบ
  const fetchFarmers = async () => {
    try {
      const response = await getFarmers();
      setFarmers(response.data);
      setTotalFarmers(response.data.length);
    } catch (error) {
      console.error("Error fetching farmers:", error);
    }
  };

  // ✅ เพิ่มลูกสวนใหม่
  const handleAddFarmer = async (newFarmer) => {
    try {
      await addFarmer(newFarmer);
      fetchFarmers();
    } catch (error) {
      console.error("Error adding farmer:", error);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  // คำนวณข้อมูลสำหรับหน้าปัจจุบัน
  const indexOfLastFarmer = currentPage * farmersPerPage;
  const indexOfFirstFarmer = indexOfLastFarmer - farmersPerPage;
  const currentFarmers = farmers.slice(indexOfFirstFarmer, indexOfLastFarmer);
  const totalPages = Math.ceil(totalFarmers / farmersPerPage);

  // ฟังก์ชันสำหรับเปลี่ยนหน้า
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "latitude" || name === "longitude") {
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addFarmer(formData);
      await fetchFarmers();
      setIsModalOpen(false);
      setFormData({
        firstName: "",
        lastName: "",
        nickname: "",
        phone: "",
        location: {
          latitude: "",
          longitude: "",
        },
      });
      Swal.fire({
        icon: "success",
        title: "เพิ่มลูกสวนสำเร็จ!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถเพิ่มลูกสวนได้ กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-Green-button hover:bg-green-600 shadow-md text-white text-sm px-3 py-2 rounded-lg transition-colors"
        >
          เพิ่มลูกสวน
        </button>
      </div>

      {/* Modal สำหรับเพิ่มลูกสวน */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[70]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">เพิ่มลูกสวน</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ชื่อ
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  นามสกุล
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ชื่อเล่น
                </label>
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ละติจูด
                </label>
                <input
                  type="number"
                  name="latitude"
                  value={formData.location.latitude}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ลองจิจูด
                </label>
                <input
                  type="number"
                  name="longitude"
                  value={formData.location.longitude}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
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

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <div className="overflow-hidden rounded-lg">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-200">
                  <th
                    scope="col"
                    className="px-6 py-4 font-bold text-gray-600 first:rounded-tl-lg w-[50px]"
                  >
                    ลำดับ
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-bold text-gray-600 w-[200px]"
                  >
                    ชื่อ-นามสกุล
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-bold text-gray-600 w-[100px]"
                  >
                    ชื่อเล่น
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-bold text-gray-600 w-[150px]"
                  >
                    เบอร์โทรศัพท์
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-bold text-gray-600 w-[200px]"
                  >
                    พิกัด
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-bold text-gray-600 last:rounded-tr-lg text-center w-[100px]"
                  >
                    จัดการข้อมูล
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentFarmers.map((item, index) => (
                  <tr
                    key={item._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-600">
                      {indexOfFirstFarmer + index + 1}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {item.firstName || item.lastName
                        ? `${item.firstName || "-"} ${item.lastName || "-"}`
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {item.nickname || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {item.phone || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {item.location?.latitude && item.location?.longitude
                        ? `${item.location.latitude}°N, ${item.location.longitude}°E`
                        : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="bg-Green-button hover:bg-green-600 text-white shadow-md px-4 py-2 rounded-lg transition-colors">
                          แก้ไข
                        </button>
                        <button className="bg-red-600 hover:bg-red-700 text-white shadow-md px-4 py-2 rounded-lg transition-colors">
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
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100">
          <span className="text-sm text-gray-600">
            Showing{" "}
            <span className="">
              {indexOfFirstFarmer + 1}-
              {Math.min(indexOfLastFarmer, totalFarmers)}
            </span>{" "}
            of <span className="">{totalFarmers}</span>
          </span>
          <div className="flex gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
