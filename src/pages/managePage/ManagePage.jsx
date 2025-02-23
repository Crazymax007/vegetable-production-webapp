import React, { useEffect, useState } from "react";
import { getOrders } from "../../services/orderService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ManagePage = () => {
  const [data, setData] = useState([]);
  const [searchFarmer, setSearchFarmer] = useState(""); // คำค้นหาลูกสวน
  const [searchVegetable, setSearchVegetable] = useState(""); // คำค้นหาชื่อผัก
  const [searchOrderDate, setSearchOrderDate] = useState(null); // คำค้นหาวันที่สั่งปลูก
  const [searchDeliveryDate, setSearchDeliveryDate] = useState(null); // คำค้นหาวันที่ส่งปลูก
  const [searchQuantityOrdered, setSearchQuantityOrdered] = useState(""); // คำค้นหาน้ำหนักที่สั่ง
  const [searchQuantityDelivered, setSearchQuantityDelivered] = useState(""); // คำค้นหาน้ำหนักที่ส่ง
  const [searchStatus, setSearchStatus] = useState(""); // คำค้นหาสถานะ
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSearch = (field, value) => {
    if (field === "farmer") setSearchFarmer(value);
    if (field === "vegetable") setSearchVegetable(value);
    if (field === "orderDate") setSearchOrderDate(value);
    if (field === "deliveryDate") setSearchDeliveryDate(value);
    if (field === "quantityOrdered") setSearchQuantityOrdered(value);
    if (field === "quantityDelivered") setSearchQuantityDelivered(value);
    if (field === "status") setSearchStatus(value);
  };

  useEffect(() => {
    getOrders(0)
      .then((response) => {
        let uniqueId = 1;
        const orders = response.data.data
          .map((order) => {
            return order.details.map((detail) => {
              return {
                id: uniqueId++,
                farmerId: `${detail.farmerId.firstName} ${detail.farmerId.lastName}`,
                vegetableName: order.vegetable.name,
                orderDate: new Date(order.orderDate).toLocaleDateString(),
                quantityOrdered: detail.quantityKg,
                // ตรวจสอบว่า deliveryDate เป็น null หรือไม่
                deliveryDate: detail.delivery.deliveredDate
                  ? new Date(detail.delivery.deliveredDate).toLocaleDateString()
                  : "--", // ถ้าเป็น null ให้แสดง "--"
                quantityDelivered: detail.delivery.actualKg,
                status: detail.delivery.status,
              };
            });
          })
          .flat();
        setData(orders);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // ฟังก์ชันกรองข้อมูล
  const filteredData = data.filter((item) => {
    return (
      item.farmerId.toLowerCase().includes(searchFarmer.toLowerCase()) &&
      item.vegetableName
        .toLowerCase()
        .includes(searchVegetable.toLowerCase()) &&
      (searchOrderDate
        ? item.orderDate === searchOrderDate.toLocaleDateString()
        : true) &&
      (searchDeliveryDate
        ? item.deliveryDate === searchDeliveryDate.toLocaleDateString()
        : true) &&
      item.quantityOrdered.toString().includes(searchQuantityOrdered) &&
      item.quantityDelivered.toString().includes(searchQuantityDelivered) &&
      item.status.toLowerCase().includes(searchStatus.toLowerCase())
    );
  });

  // เพิ่มฟังก์ชัน sort data
  const sortedData = React.useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  // เพิ่มฟังก์ชันสำหรับ pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const generatePagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 4; // จำนวนหมายเลขที่แสดงก่อนต้องเปลี่ยนชุด
    let startPage, endPage;

    if (totalPages <= maxVisiblePages) {
      // ถ้ามีหน้าน้อยกว่า maxVisiblePages ก็แสดงทั้งหมดเลย
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 3) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage + 2 >= totalPages) {
        startPage = totalPages - (maxVisiblePages - 1);
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }

    if (startPage > 1) pageNumbers.push(1);
    if (startPage > 2) pageNumbers.push("...");
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    if (endPage < totalPages - 1) pageNumbers.push("...");
    if (endPage < totalPages) pageNumbers.push(totalPages);

    return pageNumbers;
  };

  const columns = [
    { header: "ลำดับ", accessor: "id", width: "5%" },
    { header: "ลูกสวน", accessor: "farmerId", width: "20%" },
    { header: "ชื่อผัก", accessor: "vegetableName", width: "15%" },
    { header: "วันที่สั่งปลูก", accessor: "orderDate", width: "12%" },
    { header: "จำนวนที่สั่ง (กก.)", accessor: "quantityOrdered", width: "10%" },
    { header: "วันที่ส่งผลิต", accessor: "deliveryDate", width: "12%" },
    {
      header: "จำนวนที่ส่ง (กก.)",
      accessor: "quantityDelivered",
      width: "10%",
    },
    { header: "สถานะ", accessor: "status", width: "10%" },
    {
      header: "จัดการข้อมูล",
      accessor: "actions",
      width: "15%",
      Cell: ({ row }) => (
        <div className="flex">
          <button
            className="bg-blue-500 text-black px-2 py-1 rounded mr-2 w-14"
            onClick={() => handleEdit(row)}
          >
            แก้ไข
          </button>
          <button
            className="bg-red-500 text-white px-2 py-1 rounded w-14"
            onClick={() => handleDelete(row)}
          >
            ลบ
          </button>
        </div>
      ),
    },
  ];

  // ? ฟังก์ชัน
  const handleEdit = (id) => {
    alert("Edit ID:" + id);
  };

  const handleDelete = (id) => {
    alert("Delete ID:" + id);
  };

  return (
    <div className="flex flex-col mx-20 bg-Green-Custom rounded-3xl p-6 mb-[2%]">
      <div className="text-xl">จัดการข้อมูล</div>
      <div className="flex flex-wrap gap-4 mt-4">
        {/* ช่องค้นหาต่างๆ */}
        <input
          type="text"
          placeholder="ค้นหาลูกสวน"
          className="px-4 py-2 border rounded-lg"
          value={searchFarmer}
          onChange={(e) => handleSearch("farmer", e.target.value)}
        />
        <input
          type="text"
          placeholder="ค้นหาชื่อผัก"
          className="px-4 py-2 border rounded-lg"
          value={searchVegetable}
          onChange={(e) => handleSearch("vegetable", e.target.value)}
        />
        {/* เลือกวันที่ */}
        <DatePicker
          selected={searchOrderDate}
          onChange={(date) => handleSearch("orderDate", date)}
          className="px-4 py-2 border rounded-lg"
          placeholderText="ค้นหาวันที่สั่งปลูก"
        />
        {/* เลือกวันที่ส่งปลูก */}
        <DatePicker
          selected={searchDeliveryDate}
          onChange={(date) => handleSearch("deliveryDate", date)}
          className="px-4 py-2 border rounded-lg"
          placeholderText="ค้นหาวันที่ส่งปลูก"
        />
        {/* ช่องกรอกน้ำหนัก */}
        <input
          type="number"
          placeholder="ค้นหาน้ำหนักที่สั่ง"
          className="px-4 py-2 border rounded-lg"
          value={searchQuantityOrdered}
          onChange={(e) => handleSearch("quantityOrdered", e.target.value)}
        />
        <input
          type="number"
          placeholder="ค้นหาน้ำหนักที่ส่ง"
          className="px-4 py-2 border rounded-lg"
          value={searchQuantityDelivered}
          onChange={(e) => handleSearch("quantityDelivered", e.target.value)}
        />
        <input
          type="text"
          placeholder="ค้นหาสถานะ"
          className="px-4 py-2 border rounded-lg"
          value={searchStatus}
          onChange={(e) => handleSearch("status", e.target.value)}
        />
      </div>

      <div className="flex flex-col mt-6 px-4">
        <div className="relative overflow-x-auto">
          {/* Show Entries */}
          <div className="flex items-center gap-2 m-4">
            <span className="text-sm">แสดง</span>
            <select
              className="px-2 py-1 text-sm rounded-lg"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm">รายการ</span>
          </div>

          <table
            className="w-full text-sm text-left text-gray-500"
            style={{
              borderCollapse: "collapse",
              border: "1px solid #ddd",
              tableLayout: "fixed",
            }}
          >
            <thead
              className="text-sm text-gray-700 uppercase bg-gray-300"
              style={{ borderBottom: "1px solid #ddd" }}
            >
              <tr>
                {columns.map((col, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="px-6 py-3 cursor-pointer"
                    style={{ width: col.width }}
                    onClick={() =>
                      setSortConfig({
                        key: col.accessor,
                        direction:
                          sortConfig.direction === "asc" ? "desc" : "asc",
                      })
                    }
                  >
                    {col.header}
                    <span className="ml-1">
                      {sortConfig.key === col.accessor
                        ? sortConfig.direction === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr
                  key={item.id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4">{item.id}</td>
                  <td className="px-6 py-4">{item.farmerId}</td>
                  <td className="px-6 py-4">{item.vegetableName}</td>
                  <td className="px-6 py-4">{item.orderDate}</td>
                  <td className="px-6 py-4">{item.quantityOrdered}</td>
                  <td className="px-6 py-4">{item.deliveryDate}</td>
                  <td className="px-6 py-4">{item.quantityDelivered}</td>
                  <td className="px-6 py-4">{item.status}</td>
                  <td className="px-6 py-4">
                    <div className="flex">
                      <button
                        className="bg-blue-500 text-black px-2 py-1 rounded mr-2 w-14"
                        onClick={() => handleEdit(item.id)}
                      >
                        แก้ไข
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded w-14"
                        onClick={() => handleDelete(item.id)}
                      >
                        ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center p-2">
            <div className="text-sm">
              แสดงรายการ {indexOfFirstItem + 1} ถึง{" "}
              {Math.min(indexOfLastItem, filteredData.length)} จาก{" "}
              {filteredData.length} รายการ
            </div>

            <nav className="inline-flex items-center">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-l-lg"
              >
                ก่อนหน้า
              </button>

              {generatePagination().map((number, index) =>
                number === "..." ? (
                  <span
                    key={index}
                    className="px-4 py-2 text-sm font-semibold bg-white text-gray-500"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={index}
                    onClick={() => paginate(number)}
                    className={`px-4 py-2 text-sm font-semibold ${
                      currentPage === number
                        ? "bg-blue-600 text-white"
                        : "bg-white"
                    } border`}
                  >
                    {number}
                  </button>
                )
              )}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-r-lg"
              >
                ถัดไป
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagePage;
