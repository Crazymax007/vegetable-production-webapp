import React, { useEffect, useState } from "react";
import TableComponent from "../../components/TableComponent";
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
        const orders = response.data.data
          .map((order) => {
            return order.details.map((detail) => {
              return {
                id: detail._id,
                orderId: order._id,
                farmerId: `${detail.farmerId.firstName} ${detail.farmerId.lastName}`,
                vegetableName: order.vegetable.name,
                orderDate: new Date(order.orderDate).toLocaleDateString(),
                quantityOrdered: detail.quantityKg,
                deliveryDate: detail.delivery.deliveredDate
                  ? new Date(detail.delivery.deliveredDate).toLocaleDateString()
                  : "--",
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

  // ฟังก์ชันจัดการการเรียงข้อมูล
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

  // ฟังก์ชันจัดการการแบ่งหน้า
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const columns = [
    { 
      header: "ลำดับ", 
      accessor: "index",
      width: "5%" 
    },
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
            onClick={() => handleEdit(row.original.id, row.original.orderId)}
          >
            แก้ไข
          </button>
          <button
            className="bg-red-500 text-white px-2 py-1 rounded w-14"
            onClick={() => handleDelete(row.original.id, row.original.orderId)}
          >
            ลบ
          </button>
        </div>
      ),
    },
  ];

  // ? ฟังก์ชัน
  const handleEdit = (id, orderId) => {
    alert("Edit ID:" + id + " and Order ID:" + orderId);
  };

  const handleDelete = (id, orderId) => {
    alert("Delete ID:" + id + " and Order ID:" + orderId);
  };

  // เพิ่มฟังก์ชันสำหรับการแบ่งหน้า
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="flex flex-col mx-20 bg-Green-Custom rounded-3xl p-6 mb-6">
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

        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-sm text-gray-700 uppercase bg-gray-300">
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
                      direction: sortConfig.direction === "asc" ? "desc" : "asc",
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
            {currentItems.map((item, index) => (
              <tr key={item.id} className="bg-white">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    {col.accessor === "index" ? (
                      indexOfFirstItem + index + 1
                    ) : col.accessor === "actions" ? (
                      <div className="flex">
                        <button
                          className="bg-blue-500 text-black px-2 py-1 rounded mr-2 w-14"
                          onClick={() => handleEdit(item.id, item.orderId)}
                        >
                          แก้ไข
                        </button>
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded w-14"
                          onClick={() => handleDelete(item.id, item.orderId)}
                        >
                          ลบ
                        </button>
                      </div>
                    ) : (
                      item[col.accessor]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* เพิ่ม Pagination */}
        <div className="flex justify-center gap-2 mt-4 mb-4">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            หน้าแรก
          </button>
          <button
            onClick={handlePrevPage}
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
            onClick={handleNextPage}
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

export default ManagePage;
