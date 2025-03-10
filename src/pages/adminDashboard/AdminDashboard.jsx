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
import { FcCloseUpMode, FcShop, FcOvertime } from "react-icons/fc";

// 📌 ดึงข้อมูล API
import { getVegetables } from "../../services/vegatableService";
import { getFarmers } from "../../services/farmerService";
import { getOrders } from "../../services/orderService";
import { getUsers } from "../../services/authService";
import { getBuyers } from "../../services/buyerService";

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
  const [buyers, setBuyers] = useState([]);
  const [selectedBuyers, setSelectedBuyers] = useState({});

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
    fetchBuyers(); // Add this line
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

  const fetchBuyers = async () => {
    try {
      const response = await getBuyers();
      setBuyers(response.data);
      // Initialize selected buyers state
      const initialSelected = response.data.reduce((acc, buyer) => {
        acc[buyer._id] = false;
        return acc;
      }, {});
      setSelectedBuyers(initialSelected);
    } catch (error) {
      console.error("Failed to fetch buyers:", error);
    }
  };

  const handleBuyerChange = (event) => {
    const newSelection = {
      ...selectedBuyers,
      [event.target.name]: event.target.checked,
    };
    setSelectedBuyers(newSelection);
    console.log("selectedBuyers: ", newSelection);
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
    if (startDate) {
      filtered = filtered.filter((order) => {
        if (order.harvestDate === "--") return false;

        try {
          // แปลงวันที่จากฐานข้อมูลให้เป็นรูปแบบที่ถูกต้อง
          const [day, month, year] = order.harvestDate.split("/");
          const orderDate = new Date(
            parseInt(year) - 543,
            parseInt(month) - 1,
            parseInt(day)
          );

          const start = new Date(startDate);
          const end = endDate ? new Date(endDate) : new Date();

          // ตั้งเวลาให้เป็นเที่ยงคืนของวันนั้นๆ
          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);
          orderDate.setHours(0, 0, 0, 0);

          return orderDate >= start && orderDate <= end;
        } catch (error) {
          console.error("Date parsing error:", error);
          return false;
        }
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

    // กำหนดสีที่ไม่ซ้ำกัน
    const colors = [
      "#FF6384", // สีชมพู
      "#36A2EB", // สีฟ้า
      "#FFCE56", // สีเหลือง
      "#4BC0C0", // สีเขียวมิ้นท์
      "#FF9F40", // สีส้ม
      "#9966FF", // สีม่วง
      "#FF6384", // สีชมพูเข้ม
      "#C9CBCF", // สีเทา
      "#4D5360", // สีเทาเข้ม
      "#FF99CC", // สีชมพูอ่อน
      "#99CCFF", // สีฟ้าอ่อน
      "#FFB366", // สีส้มอ่อน
      "#99FF99", // สีเขียวอ่อน
      "#FF99CC", // สีชมพูอ่อน
      "#CC99FF", // สีม่วงอ่อน
    ];

    // ตรวจสอบว่ามีการเลือกผักหรือไม่
    const selectedVegIds = Object.entries(selectedVegetables)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id);

    // คำนวณเปอร์เซ็นต์ถ้ามีการเลือกผัก
    const total = Object.values(vegGroups).reduce((a, b) => a + b, 0);
    const labels = Object.keys(vegGroups).map((label, index) => {
      if (selectedVegIds.length > 0) {
        const value = Object.values(vegGroups)[index];
        const percentage = ((value / total) * 100).toFixed(1);
        return `${label} (${value} กก. ${percentage}%)`;
      }
      return label;
    });

    // อัพเดทข้อมูล Pie Chart
    setPieData({
      labels: labels,
      datasets: [
        {
          data: Object.values(vegGroups),
          backgroundColor: colors.slice(0, Object.keys(vegGroups).length),
          hoverBackgroundColor: colors.slice(0, Object.keys(vegGroups).length),
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
          },
        },
        display: true,
        overflow: "scroll",
        maxHeight: 350,
      },
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
      return orders.reduce(
        (total, order) => total + order.quantityDelivered,
        0
      );
    }
    // ถ้ามีการกรอง ให้คำนวณจากข้อมูลที่กรองแล้ว
    return filteredOrders.reduce(
      (total, order) => total + order.quantityDelivered,
      0
    );
  };

  // เพิ่มฟังก์ชันสำหรับนำออกข้อมูล CSV
  const exportToCSV = () => {
    // กำหนดข้อมูลที่จะนำออก
    const dataToExport = filteredOrders.length > 0 ? filteredOrders : orders;

    // สร้างหัวข้อ CSV
    const headers = [
      "ลำดับ",
      "ชื่อผัก",
      "จำนวนสั่ง (กก.)",
      "จำนวนส่งจริง (กก.)",
      "วันที่",
    ];

    // แปลงข้อมูลเป็นรูปแบบ CSV
    const csvContent = [
      headers.join(","),
      ...dataToExport.map((item, index) =>
        [
          index + 1,
          item.vegetableName,
          item.quantityOrdered,
          item.quantityDelivered,
          item.harvestDate,
        ].join(",")
      ),
    ].join("\n");

    // สร้าง Blob และดาวน์โหลดไฟล์
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    // สร้างชื่อไฟล์ตามวันที่ปัจจุบัน
    const today = new Date().toISOString().split("T")[0];
    const fileName = `รายงานการส่งผลผลิต_${today}.csv`;

    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ข้างบน */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          {/* เลือกชนิดผัก */}
          <div className="bg-white w-[25%] border border-black rounded-lg p-4">
            <div className="h-[50vh] overflow-y-auto">
              <FormGroup className="">
                <FormLabel
                  component="legend"
                  className="mb-2 flex items-center gap-2"
                >
                  <FcCloseUpMode />
                  เลือกชนิดผัก
                </FormLabel>
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
            </div>
          </div>
          {/* Pie chart */}
          <div className="bg-white w-[75%] flex flex-col  border border-black rounded-lg p-4">
            <div>ผลผลิตทั้งหมดแยกตามลูกค้า (กิโลกรัม)</div>
            <div> Pie Chart </div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-[25%]">
            <div className="flex flex-col gap-2">
              <div className="bg-white border border-black rounded-lg p-4">
                <div className="h-[30vh] overflow-y-auto">
                  <FormGroup>
                    <FormLabel
                      component="legend"
                      className="mb-2 flex items-center gap-2"
                    >
                      <FcShop />
                      เลือกผู้รับซื้อ
                    </FormLabel>
                    {buyers.map((buyer) => (
                      <FormControlLabel
                        key={buyer._id}
                        control={
                          <Checkbox
                            checked={selectedBuyers[buyer._id] || false}
                            onChange={handleBuyerChange}
                            name={buyer._id}
                          />
                        }
                        label={buyer.name}
                      />
                    ))}
                  </FormGroup>
                </div>
              </div>
              <div className="bg-white border border-black rounded-lg p-4 overflow-auto">
                <FormGroup>
                  <FormLabel
                    component="legend"
                    className="mb-2 flex items-center gap-2"
                  >
                    <FcOvertime />
                    เลือกช่วงเวลา
                  </FormLabel>
                  <div className="flex flex-col gap-2">
                    <TextField
                      label="วันที่เริ่มต้น"
                      type="date"
                      value={startDate}
                      onChange={handleStartDateChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="วันที่สิ้นสุด"
                      type="date"
                      value={endDate}
                      onChange={handleEndDateChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      size="small"
                    />
                  </div>
                </FormGroup>
              </div>
            </div>
          </div>
          <div className="bg-green-200 w-[75%] border border-black rounded-lg p-4">
            Bar chart
          </div>
        </div>
      </div>
      {/* ตาราง 💻 */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-end">
          <button
            onClick={exportToCSV}
            className="px-4 py-2 text-sm text-white bg-Green-button rounded-lg hover:bg-green-600"
          >
            นำออกข้อมูล CSV
          </button>
        </div>
        <div className="w-full bg-white border border-black rounded-lg">
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
                      วันที่
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
