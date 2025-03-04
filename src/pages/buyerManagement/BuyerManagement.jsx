import React, { useState, useEffect } from "react";
import {
  getBuyers,
  createBuyer,
  updateBuyer,
  deleteBuyer,
} from "../../services/buyerService";
import Swal from "sweetalert2";

const API_BASE_URL = "http://localhost:5000";

const BuyerManagement = () => {
  const [buyers, setBuyers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBuyers, setTotalBuyers] = useState(1);
  const buyersPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBuyers, setFilteredBuyers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [editingBuyer, setEditingBuyer] = useState(null);

  // คำนวณข้อมูลสำหรับการแสดงผล
  const indexOfLastBuyer = currentPage * buyersPerPage;
  const indexOfFirstBuyer = indexOfLastBuyer - buyersPerPage;
  const currentBuyers = filteredBuyers.slice(
    indexOfFirstBuyer,
    indexOfLastBuyer
  );
  const totalPages = Math.ceil(totalBuyers / buyersPerPage);

  // ฟังก์ชันแปลงวันที่เป็น พ.ศ.
  const convertToBuddhistYear = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getFullYear() + 543;
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${day}/${month < 10 ? "0" : ""}${month}/${year}`;
  };

  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const response = await getBuyers();
        setBuyers(response.data);
      } catch (error) {
        console.error("Error fetching buyers:", error);
        await Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด!",
          text: "ไม่สามารถดึงข้อมูลผู้รับซื้อได้ กรุณาลองใหม่อีกครั้ง",
        });
      }
    };
    fetchBuyers();
  }, []);

  useEffect(() => {
    const results = buyers.filter((buyer) =>
      buyer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBuyers(results);
    setTotalBuyers(results.length);
  }, [searchTerm, buyers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditClick = (buyer) => {
    setEditingBuyer(buyer);
    setFormData({
      name: buyer.name,
      contact: buyer.contact,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBuyer) {
        await updateBuyer(editingBuyer._id, formData);
        await Swal.fire({
          icon: "success",
          title: "สำเร็จ!",
          text: "แก้ไขผู้รับซื้อเรียบร้อยแล้ว",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await createBuyer(formData);
        await Swal.fire({
          icon: "success",
          title: "สำเร็จ!",
          text: "เพิ่มผู้รับซื้อเรียบร้อยแล้ว",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      const response = await getBuyers();
      setBuyers(response.data);

      setIsModalOpen(false);
      setFormData({
        name: "",
        contact: "",
      });
      setEditingBuyer(null);
    } catch (error) {
      console.error("Error:", error);

      // ตรวจสอบ error message จาก backend
      const errorMessage = error.message;
      console.log(errorMessage);
      // จัดการ error message ตามประเภท
      switch (errorMessage) {
        case "Name is required":
          await Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด!",
            text: "กรุณากรอกชื่อผู้รับซื้อ",
          });
          break;
        case "Buyer with this name already exists":
          await Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด!",
            text: "มีชื่อผู้รับซื้อนี้ในระบบแล้ว กรุณาใช้ชื่ออื่น",
          });
          break;
        default:
          await Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด!",
            text: "ไม่สามารถดำเนินการได้ กรุณาลองใหม่อีกครั้ง",
          });
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "ยืนยันการลบ?",
        text: "คุณต้องการลบผู้รับซื้อนี้ใช่หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "ใช่, ลบเลย!",
        cancelButtonText: "ยกเลิก",
      });

      if (result.isConfirmed) {
        await deleteBuyer(id);
        const response = await getBuyers();
        setBuyers(response.data);

        await Swal.fire({
          icon: "success",
          title: "ลบสำเร็จ!",
          text: "ลบผู้รับซื้อเรียบร้อยแล้ว",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error deleting buyer:", error);
      await Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถลบผู้รับซื้อได้ กรุณาลองใหม่อีกครั้ง",
      });
    }
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
            placeholder="ค้นหาผู้รับซื้อ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 xl:w-[430px]"
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-Green-button hover:bg-green-600 shadow-md text-white text-sm px-3 py-2 rounded-lg transition-colors"
        >
          เพิ่มผู้รับซื้อ
        </button>
      </div>

      {/* Modal for Add/Edit Buyer */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[70]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingBuyer ? "แก้ไขผู้รับซื้อ" : "เพิ่มผู้รับซื้อ"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ชื่อผู้รับซื้อ
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ข้อมูลติดต่อ
                </label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="เบอร์โทรศัพท์หรืออีเมล"
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setFormData({
                      name: "",
                      contact: "",
                    });
                    setEditingBuyer(null);
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

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <div className="overflow-hidden rounded-lg">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-6 py-4 font-bold text-gray-600 first:rounded-tl-lg w-[50px]">
                    ลำดับ
                  </th>
                  <th className="px-6 py-4 font-bold text-gray-600">
                    ชื่อผู้รับซื้อ
                  </th>
                  <th className="px-6 py-4 font-bold text-gray-600">
                    ข้อมูลติดต่อ
                  </th>
                  <th className="px-6 py-4 font-bold text-gray-600">
                    สร้างเมื่อวันที่
                  </th>
                  <th className="px-6 py-4 font-bold text-gray-600 last:rounded-tr-lg text-center">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentBuyers.map((buyer, index) => (
                  <tr
                    key={buyer._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-600">
                      {indexOfFirstBuyer + index + 1}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{buyer.name}</td>
                    <td className="px-6 py-4 text-gray-600">{buyer.contact ? buyer.contact : "-"}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {convertToBuddhistYear(buyer.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(buyer)}
                          className="bg-Green-button hover:bg-green-600 text-white shadow-md px-4 py-2 rounded-lg transition-colors"
                        >
                          แก้ไข
                        </button>
                        <button
                          onClick={() => handleDelete(buyer._id)}
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

        {/* Pagination */}
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
    </div>
  );
};

export default BuyerManagement;
