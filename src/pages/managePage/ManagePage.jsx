import React, { useEffect, useState } from "react";
import TableComponent from "../../components/TableComponent";
import { getOrders } from "../../services/orderService";

const ManagePage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getOrders()
      .then((response) => {
        let uniqueId = 1; // เริ่มต้นลำดับที่ 1
        const orders = response.data.data
          .map((order) => {
            return order.details.map((detail) => {
              return {
                id: uniqueId++, // เพิ่มลำดับที่ไม่ซ้ำกัน
                farmerId: `${detail.farmerId.firstName} ${detail.farmerId.lastName}`,
                vegetableName: order.vegetable.name,
                orderDate: new Date(order.orderDate).toLocaleDateString(),
                quantityOrdered: detail.quantityKg,
                deliveryDate: new Date(
                  detail.delivery.deliveredDate
                ).toLocaleDateString(),
                quantityDelivered: detail.delivery.actualKg,
              };
            });
          })
          .flat();
        setData(orders);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const columns = [
    { header: "ลำดับ", accessor: "id" },
    { header: "ลูกสวน", accessor: "farmerId" },
    { header: "ชื่อผัก", accessor: "vegetableName" },
    { header: "วันที่สั่งปลูก", accessor: "orderDate" },
    { header: "จำนวนที่สั่ง (กก.)", accessor: "quantityOrdered" },
    { header: "วันที่ส่งปลูก", accessor: "deliveryDate" },
    { header: "จำนวนที่ส่ง (กก.)", accessor: "quantityDelivered" },
    {
      header: "จัดการข้อมูล",
      accessor: "actions",
      Cell: ({ row }) => (
        <div>
          <button className="bg-blue-500 text-black px-2 py-1 rounded mr-2 w-14">
            แก้ไข
          </button>
          <button className="bg-red-500 text-white px-2 py-1 rounded w-14">
            ลบ
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col mx-20 bg-Green-Custom rounded-3xl p-6">
      <div className="text-xl">จัดการข้อมูล</div>
      <div className="flex flex-col mt-6 px-4">
        <TableComponent columns={columns} data={data} />
      </div>
    </div>
  );
};

export default ManagePage;
