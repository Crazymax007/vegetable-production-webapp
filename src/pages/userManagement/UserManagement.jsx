import React, { useEffect, useState } from "react";
import { getFarmers } from "../../services/farmerService";

const UserManagement = () => {
  const [farmers, setFarmers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalFarmers, setTotalFarmers] = useState(0);
  const farmersPerPage = 10;

  const fetchFarmers = async () => {
    try {
      const response = await getFarmers();
      setFarmers(response.data);
      setTotalFarmers(response.data.length);
    } catch (error) {
      console.error("Error fetching farmers:", error);
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

  return (
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
                    {item.firstName || item.lastName ? 
                      `${item.firstName || '-'} ${item.lastName || '-'}` : 
                      '-'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {item.nickname || '-'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {item.phone || '-'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {item.location?.latitude && item.location?.longitude ? 
                      `${item.location.latitude}°N, ${item.location.longitude}°E` : 
                      '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="bg-Green-button hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
                        แก้ไข
                      </button>
                      <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
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
          Showing <span className="">{indexOfFirstFarmer + 1}-{Math.min(indexOfLastFarmer, totalFarmers)}</span> of{" "}
          <span className="">{totalFarmers}</span>
        </span>
        <div className="flex gap-2">
          <button 
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Previous
          </button>
          <button 
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 ${
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
