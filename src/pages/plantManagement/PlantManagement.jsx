import React, { useState, useEffect } from "react";
import {
  getVegetables,
  addVegetable,
  updateVegetable,
  deleteVegetable,
} from "../../services/vegatableService";
import Swal from "sweetalert2";

const API_BASE_URL = "http://localhost:5000";

const PlantManagement = () => {
  const [plants, setPlants] = useState([]); // เปลี่ยนเป็น array เปล่า
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPlants, setTotalPlants] = useState(1);
  const plantsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    removeImage: false,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [editingPlant, setEditingPlant] = useState(null);

  // ฟังก์ชันแปลงวันที่เป็น พ.ศ.
  const convertToBuddhistYear = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getFullYear() + 543;
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${day}/${month < 10 ? "0" : ""}${month}/${year}`;
  };

  // คำนวณข้อมูลสำหรับการแสดงผล
  const indexOfLastPlant = currentPage * plantsPerPage;
  const indexOfFirstPlant = indexOfLastPlant - plantsPerPage;
  const currentPlants = filteredPlants.slice(
    indexOfFirstPlant,
    indexOfLastPlant
  );
  const totalPages = Math.ceil(totalPlants / plantsPerPage);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await getVegetables();
        setPlants(response.data);
      } catch (error) {
        console.error("Error fetching plants:", error);
        await Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด!",
          text: "ไม่สามารถดึงข้อมูลผักได้ กรุณาลองใหม่อีกครั้ง",
        });
      }
    };
    fetchPlants();
  }, []);

  useEffect(() => {
    const results = plants.filter((plant) =>
      plant.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPlants(results);
    setTotalPlants(results.length);
  }, [searchTerm, plants]);

  // เพิ่มฟังก์ชันจัดการ input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // เพิ่มฟังก์ชันจัดการอัพโหลดรูป
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // เพิ่มฟังก์ชันสำหรับลบรูปภาพ
  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
      removeImage: true,
    }));
    setPreviewImage(null);
    const fileInput = document.getElementById("file_input");
    if (fileInput) fileInput.value = "";
  };

  // เพิ่มฟังก์ชันสำหรับเปิด Modal แก้ไข
  const handleEditClick = (plant) => {
    setEditingPlant(plant);
    setFormData({
      name: plant.name,
      image: null,
      removeImage: false,
    });
    setPreviewImage(`${API_BASE_URL}${plant.imageUrl}`);
    setIsModalOpen(true);
  };

  // แก้ไขฟังก์ชัน handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      if (formData.image && formData.image instanceof File) {
        formDataToSend.append("image", formData.image);
      }
      formDataToSend.append("removeImage", formData.removeImage);

      if (editingPlant) {
        console.log("Updating with data:", {
          id: editingPlant._id,
          formData: Object.fromEntries(formDataToSend.entries()),
        });

        await updateVegetable(editingPlant._id, formDataToSend);
        await Swal.fire({
          icon: "success",
          title: "สำเร็จ!",
          text: "แก้ไขผักเรียบร้อยแล้ว",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await addVegetable(formDataToSend);
        await Swal.fire({
          icon: "success",
          title: "สำเร็จ!",
          text: "เพิ่มผักเรียบร้อยแล้ว",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      // รีเฟรชข้อมูล
      const response = await getVegetables();
      setPlants(response.data);

      // รีเซ็ตฟอร์มและปิด Modal
      setIsModalOpen(false);
      setFormData({ name: "", image: null, removeImage: false });
      setPreviewImage(null);
      setEditingPlant(null);
    } catch (error) {
      console.error("Error:", error);
      await Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด!",
        text:
          error.response?.data?.message ||
          "ไม่สามารถดำเนินการได้ กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  // เพิ่มฟังก์ชันสำหรับลบผัก
  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "ยืนยันการลบ?",
        text: "คุณต้องการลบผักนี้ใช่หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "ใช่, ลบเลย!",
        cancelButtonText: "ยกเลิก",
      });

      if (result.isConfirmed) {
        await deleteVegetable(id);
        const response = await getVegetables();
        setPlants(response.data);

        await Swal.fire({
          icon: "success",
          title: "ลบสำเร็จ!",
          text: "ลบผักเรียบร้อยแล้ว",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error deleting vegetable:", error);
      await Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถลบผักได้ กรุณาลองใหม่อีกครั้ง",
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
            placeholder="ค้นหาผัก..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 xl:w-[430px]"
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-Green-button hover:bg-green-600 shadow-md text-white text-sm px-3 py-2 rounded-lg transition-colors"
        >
          เพิ่มพืชผัก
        </button>
      </div>

      {/* Modal สำหรับเพิ่มผัก */}
      {isModalOpen && !editingPlant && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[70]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">เพิ่มผัก</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ชื่อผัก
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
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  รูปภาพ
                </label>
                <div className="space-y-3">
                  {previewImage ? (
                    <div className="relative w-fit">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="file_input"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 mb-3 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              คลิกเพื่อเลือกรูปภาพ
                            </span>
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG หรือ GIF
                          </p>
                        </div>
                        <input
                          id="file_input"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setFormData({ name: "", image: null, removeImage: false });
                    setPreviewImage(null);
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

      {/* Modal สำหรับแก้ไขผัก */}
      {isModalOpen && editingPlant && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[70]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">แก้ไขผัก</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ชื่อผัก
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
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  รูปภาพ
                </label>
                <div className="space-y-3">
                  {previewImage || formData.image ? (
                    <div className="relative w-fit">
                      <img
                        src={
                          previewImage ||
                          "https://www.protean.co.jp/wp-content/themes/protean/images/no-image.gif"
                        }
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="file_input"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 mb-3 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              คลิกเพื่อเลือกรูปภาพ
                            </span>
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG หรือ GIF
                          </p>
                        </div>
                        <input
                          id="file_input"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setFormData({ name: "", image: null, removeImage: false });
                    setPreviewImage(null);
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
                  <th scope="col" className="px-6 py-4 font-bold text-gray-600">
                    ชื่อผัก
                  </th>
                  <th scope="col" className="px-6 py-4 font-bold text-gray-600">
                    รูปภาพ
                  </th>
                  <th scope="col" className="px-6 py-4 font-bold text-gray-600">
                    สร้างเมื่อวันที่
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-bold text-gray-600 last:rounded-tr-lg text-center"
                  >
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentPlants.map((plant, index) => (
                  <tr
                    key={plant._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-600">
                      {indexOfFirstPlant + index + 1}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{plant.name}</td>
                    <td className="px-6 py-4">
                      <img
                        src={
                          plant.imageUrl
                            ? `${API_BASE_URL}${plant.imageUrl}`
                            : "https://www.protean.co.jp/wp-content/themes/protean/images/no-image.gif"
                        }
                        alt={plant.name}
                        className="w-16 h-16 object-cover rounded-full border border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {convertToBuddhistYear(plant.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(plant)}
                          className="bg-Green-button hover:bg-green-600 text-white shadow-md px-4 py-2 rounded-lg transition-colors"
                        >
                          แก้ไข
                        </button>
                        <button
                          onClick={() => handleDelete(plant._id)}
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

        {/* ย้าย pagination เข้ามาอยู่ในกล่องเดียวกับตาราง */}
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
            // แสดงเฉพาะ 5 หน้ารอบๆ หน้าปัจจุบัน
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

export default PlantManagement;
