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

      <div className="flex flex-col mt-6 px-4">
        <TableComponent columns={columns} data={filteredData} />
      </div>
    </div>
  );
};

export default ManagePage;
