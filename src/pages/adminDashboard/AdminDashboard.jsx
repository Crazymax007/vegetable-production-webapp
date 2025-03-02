import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormLabel,
  Box,
  TextField,
} from "@mui/material";

// 📌 ดึงข้อมูล API
import { getVegetables } from "../../services/vegatableService";
import { getFarmers } from "../../services/farmerService";
import { getOrders } from "../../services/orderService";
import { getUsers } from "../../services/authService";

// 📌 นำเข้า Pie Chart จาก react-chartjs-2 และ Chart.js
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// 📌 กำหนดให้ ChartJS ใช้ ArcElement สำหรับ Pie Chart
ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const [vegetables, setVegetables] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [selectedVegetables, setSelectedVegetables] = useState({});
  const [startDate, setStartDate] = useState(""); // สถานะของวันที่เริ่ม
  const [endDate, setEndDate] = useState(""); // สถานะของวันที่สิ้นสุด
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]); // เพิ่ม state สำหรับเก็บข้อมูลที่กรองแล้ว
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // คำนวณจำนวนหน้าทั้งหมด
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // คำนวณ index เริ่มต้นและสิ้นสุดของข้อมูลในหน้าปัจจุบัน
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // กรองข้อมูลสำหรับหน้าปัจจุบัน
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  useEffect(() => {
    fetchVegetables();
    fetchFarmers();
    fetchOrders();
    fetchUsers();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [selectedVegetables, startDate, endDate, orders]);

  const fetchVegetables = async () => {
    try {
      const response = await getVegetables();
      setVegetables(response.data);
      // สร้าง object สำหรับเก็บสถานะการเลือกของแต่ละผัก
      const initialSelected = response.data.reduce((acc, veg) => {
        acc[veg._id] = false;
        return acc;
      }, {});
      setSelectedVegetables(initialSelected);
    } catch (error) {
      console.error("Failed to fetch vegetables:", error);
    }
  };

  const fetchFarmers = async () => {
    try {
      const response = await getFarmers();
      setFarmers(response.data);
    } catch (error) {
      console.error("Failed to fetch farmers:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };
  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      if (response && response.data && response.data.data) {
        // แปลงข้อมูลให้อยู่ในรูปแบบที่ต้องการก่อน
        const allOrders = response.data.data
          .map((order) => {
            if (!order.details) return null;
            return order.details.map((detail) => ({
              id: detail._id,
              vegetableName: order.vegetable ? order.vegetable.name : "ไม่ระบุ",
              quantityOrdered: detail.quantityKg || 0,
              quantityDelivered: detail.delivery
                ? detail.delivery.actualKg || 0
                : 0,
              harvestDate:
                detail.delivery && detail.delivery.deliveredDate
                  ? new Date(detail.delivery.deliveredDate).toLocaleDateString(
                      "th-TH"
                    )
                  : "--",
            }));
          })
          .filter(Boolean)
          .flat();

        // สร้าง key สำหรับจัดกลุ่ม (ชื่อผัก + วันที่)
        const groupedOrders = allOrders.reduce((acc, order) => {
          const key = `${order.vegetableName}_${order.harvestDate}`;
          if (!acc[key]) {
            acc[key] = {
              id: order.id, // เก็บ id แรกที่เจอ
              vegetableName: order.vegetableName,
              quantityOrdered: 0,
              quantityDelivered: 0,
              harvestDate: order.harvestDate,
            };
          }
          acc[key].quantityOrdered += order.quantityOrdered;
          acc[key].quantityDelivered += order.quantityDelivered;
          return acc;
        }, {});

        // แปลงกลับเป็น array
        const formattedOrders = Object.values(groupedOrders);
        setOrders(formattedOrders);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const handleVegetableChange = (event) => {
    const newSelection = {
      ...selectedVegetables,
      [event.target.name]: event.target.checked,
    };
    setSelectedVegetables(newSelection);
    console.log("Selected Vegetables: ", newSelection);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    console.log("Start Date: ", e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    console.log("End Date: ", e.target.value);
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // กรองตามผักที่เลือก
    const selectedVegIds = Object.entries(selectedVegetables)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id);

    if (selectedVegIds.length > 0) {
      filtered = filtered.filter((order) => {
        const vegetable = vegetables.find(
          (v) => v.name === order.vegetableName
        );
        return vegetable && selectedVegIds.includes(vegetable._id);
      });
    }

    // กรองตามวันที่
    if (startDate && endDate) {
      filtered = filtered.filter((order) => {
        if (order.harvestDate === "--") return false;
        const orderDate = new Date(
          order.harvestDate.split("/").reverse().join("-")
        );
        const start = new Date(startDate);
        const end = new Date(endDate);
        return orderDate >= start && orderDate <= end;
      });
    }

    setFilteredOrders(filtered);
    updatePieChartData(filtered);
  };

  const updatePieChartData = (filteredData) => {
    // จัดกลุ่มข้อมูลตามชื่อผัก
    const vegGroups = filteredData.reduce((acc, order) => {
      if (!acc[order.vegetableName]) {
        acc[order.vegetableName] = 0;
      }
      acc[order.vegetableName] += order.quantityDelivered;
      return acc;
    }, {});

    // อัพเดทข้อมูล Pie Chart
    setPieData({
      labels: Object.keys(vegGroups),
      datasets: [
        {
          data: Object.values(vegGroups),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#FF9F40",
            "#FF6384",
            "#4BC0C0",
            "#FFCE56",
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#FF9F40",
            "#FF6384",
            "#4BC0C0",
            "#FFCE56",
          ],
        },
      ],
    });
  };

  // เพิ่ม state สำหรับ Pie Chart
  const [pieData, setPieData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: [],
      },
    ],
  });

  // เพิ่ม options สำหรับ Pie Chart
  const pieOptions = {
    plugins: {
      legend: {
        position: "right",
        align: "start",
        labels: {
          boxWidth: 15,
          padding: 15,
          font: {
            size: 12,
          }
        },
        display: true,
        overflow: 'scroll',
        maxHeight: 350
      }
    },
    layout: {
      padding: {
        left: 0,
        right: 20,
        top: 0,
        bottom: 0,
      },
    },
    maintainAspectRatio: false,
  };

  // คำนวณจำนวนกิโลกรัมรวม
  const calculateTotalKilograms = () => {
    if (filteredOrders.length === 0) {
      // ถ้าไม่มีการกรอง ให้คำนวณจากทั้งหมด
      return orders.reduce((total, order) => total + order.quantityDelivered, 0);
    }
    // ถ้ามีการกรอง ให้คำนวณจากข้อมูลที่กรองแล้ว
    return filteredOrders.reduce((total, order) => total + order.quantityDelivered, 0);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-row gap-4">
        <div className="w-[20%] flex flex-col gap-4 rounded-lg max-h-[500px] ">
          <Box
            className="rounded-lg p-4 bg-white border border-black"
            sx={{
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              height: "100%",
              gap: 1,
            }}
          >
            <FormLabel component="legend" sx={{ fontWeight: "bold" }}>
              เลือกชนิดผัก
            </FormLabel>
            <FormGroup>
              {vegetables.map((vegetable) => (
                <FormControlLabel
                  key={vegetable._id}
                  control={
                    <Checkbox
                      checked={selectedVegetables[vegetable._id] || false}
                      onChange={handleVegetableChange}
                      name={vegetable._id}
                    />
                  }
                  label={vegetable.name}
                />
              ))}
            </FormGroup>
          </Box>
          <div className="flex flex-col gap-2 bg-white rounded-lg border border-black p-4">
            <div className="flex flex-col gap-4">
              <TextField
                label="วันที่เริ่ม"
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                sx={{ width: "200px" }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="วันที่สิ้นสุด"
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                sx={{ width: "200px" }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
          </div>
        </div>

        {/* จำนวนกิโล 💻 */}
        <div className="w-[80%] flex flex-col gap-4 rounded-lg">
          <div className="flex justify-between gap-4">
            <div className="bg-white flex w-1/3 flex-col gap-2 items-center p-2 rounded-lg border border-black">
              <span>จำนวนลูกสวนทั้งหมด</span>
              <span>{farmers.length}</span>
            </div>
            <div className="bg-white flex w-1/3 flex-col gap-2 items-center p-2 rounded-lg border border-black">
              <span>จำนวนผู้ใช้ระบบ</span>
              <span>{users.length}</span>
            </div>
            <div className="bg-white flex w-1/3 flex-col gap-2 items-center p-2 rounded-lg border border-black">
              <span>จำนวนกิโลกรัม</span>
              <span>{calculateTotalKilograms().toLocaleString('th-TH')}</span>
            </div>
          </div>
          <div
            className="flex justify-center p-4 bg-white rounded-lg border border-black"
            style={{ height: "410px" }}
          >
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
      </div>
      {/* ตาราง 💻 */}
      <div className="flex flex-col items-center gap-4 bg-white rounded-lg border border-black">
        <div className="w-full">
          <div className="overflow-x-auto">
            <div className="overflow-hidden rounded-lg">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-6 py-4 font-bold text-gray-600 first:rounded-tl-lg w-[80px]">
                      ลำดับ
                    </th>
                    <th className="px-6 py-4 font-bold text-gray-600 w-[200px]">
                      ชื่อผัก
                    </th>
                    <th className="px-6 py-4 font-bold text-gray-600 w-[150px]">
                      จำนวนสั่ง (กก.)
                    </th>
                    <th className="px-6 py-4 font-bold text-gray-600 w-[150px]">
                      จำนวนส่งจริง (กก.)
                    </th>
                    <th className="px-6 py-4 font-bold text-gray-600 w-[200px]">
                      วันที่เก็บเกี่ยว
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-gray-600">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {item.vegetableName}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {item.quantityOrdered}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {item.quantityDelivered}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {item.harvestDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                      ? "bg-green-500 text-white"
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

export default AdminDashboard;
