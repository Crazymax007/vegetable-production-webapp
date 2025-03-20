import React, { useEffect, useState } from "react";
import {
  getOrders,
  updateOrderDetail,
  deleteOrderDetail,
} from "../../services/orderService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { getUserInfo } from "../../services/authService";
import { format } from "date-fns";

// เพิ่มตัวแปรสำหรับตัวเลือกสถานะ
const STATUS_OPTIONS = [
  { value: "Pending", label: "รอดำเนินการ" },
  { value: "Complete", label: "เสร็จสิ้น" },
];

const ManagePage = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // สำหรับค้นหาทั่วไป
  const [searchDates, setSearchDates] = useState({
    orderDate: "",
    deliveryDate: "",
  });
  const [searchStatus, setSearchStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // เพิ่ม state ใหม่สำหรับเก็บค่าการค้นหาชั่วคราว
  const [tempSearch, setTempSearch] = useState({
    farmer: "",
    vegetable: "",
    buyer: "",
    orderDate: "",
    deliveryDate: "",
    status: "",
  });

  // เพิ่ม state สำหรับ modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // เพิ่ม state สำหรับควบคุมการแสดง/ซ่อนการค้นหาขั้นสูง
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  // เพิ่ม state สำหรับช่วงวันที่
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });

  const [user, setUser] = useState(null); // เพิ่ม state สำหรับเก็บข้อมูลผู้ใช้
  const [editStatus, setEditStatus] = useState(""); // สำหรับการแก้ไข

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserInfo(); // ดึงข้อมูลผู้ใช้
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };
    fetchUser();
  }, []);

  const handleSearch = (field, value) => {
    if (field === "general") {
      setSearchTerm(value);
    } else if (field === "status") {
      setSearchStatus(value); // ค้นหาสถานะ
    } else if (field === "dateRange") {
      setDateRange((prev) => ({
        ...prev,
        ...value,
      }));
    } else {
      setSearchDates((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // เพิ่มฟังก์ชันสำหรับการยืนยันการค้นหา
  const handleSubmitSearch = () => {
    setTempSearch((prev) => ({
      ...prev,
      farmer: searchTerm,
      vegetable: tempSearch.vegetable,
      buyer: tempSearch.buyer,
      orderDate: searchDates.orderDate,
      deliveryDate: searchDates.deliveryDate,
      status: searchStatus,
    }));
    setCurrentPage(1); // รีเซ็ตหน้าเมื่อค้นหาใหม่
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders(
          user?.role === "farmer" ? { farmerId: user.farmerId } : {}
        );
        if (response && response.data && response.data.data) {
          const orders = response.data.data
            .map((order) => {
              if (!order.details) return null;
              // Filter details for farmer role
              const relevantDetails = user?.role === "farmer"
                ? order.details.filter(detail => detail?.farmerId?._id === user.farmerId)
                : order.details;

              return relevantDetails.map((detail) => {
                if (!detail || !detail.farmerId) return null;
                return {
                  id: detail._id,
                  orderId: order._id,
                  farmerId:
                    detail.farmerId.firstName && detail.farmerId.lastName
                      ? `${detail.farmerId.firstName} ${detail.farmerId.lastName}`
                      : "ไม่ระบุ",
                  buyerName: order.buyer ? order.buyer.name : "-",
                  vegetableName: order.vegetable
                    ? order.vegetable.name
                    : "ไม่ระบุ",
                  orderDate: order.orderDate
                    ? formatDate(order.orderDate)
                    : "--",
                  dueDate: order.dueDate ? formatDate(order.dueDate) : "--",
                  quantityOrdered: detail.quantityKg || 0,
                  deliveryDate:
                    detail.delivery && detail.delivery.deliveredDate
                      ? formatDate(detail.delivery.deliveredDate)
                      : "--",
                  quantityDelivered: detail.delivery
                    ? detail.delivery.actualKg || 0
                    : 0,
                  status: detail.delivery
                    ? detail.delivery.status || "Pending"
                    : "Pending",
                };
              });
            })
            .filter(Boolean) // กรองค่า null ออก
            .flat();
          setData(orders);
        } else {
          setData([]);
          console.warn("No data received from API");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  // เพิ่มฟังก์ชันสำหรับจัดรูปแบบวันที่
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // เดือนเริ่มต้นที่ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // แก้ไขฟังก์ชัน filteredData
  const filteredData = data.filter((item) => {
    if (!item) return false;

    // ค้นหาข้อความทั่วไป (รวมถึงจำนวนกิโล)
    const searchTermMatch =
      searchTerm.toLowerCase() === "" ||
      item.farmerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vegetableName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.quantityOrdered.toString().includes(searchTerm) ||
      item.quantityDelivered.toString().includes(searchTerm);

    // ค้นหาตามช่วงวันที่
    let dateMatch = true;
    const start = dateRange.start ? new Date(dateRange.start) : null;
    const end = dateRange.end ? new Date(dateRange.end) : null;

    // แปลงวันที่จากสตริงเป็น Date object
    const orderDate =
      item.orderDate !== "--"
        ? new Date(item.orderDate.split("/").reverse().join("-"))
        : null;
    const dueDate =
      item.dueDate !== "--"
        ? new Date(item.dueDate.split("/").reverse().join("-"))
        : null;
    const deliveryDate =
      item.deliveryDate !== "--"
        ? new Date(item.deliveryDate.split("/").reverse().join("-"))
        : null;

    // ตรวจสอบว่ามีวันที่ใดๆ อยู่ในช่วงที่กำหนดหรือไม่
    if (start && end) {
      dateMatch =
        (orderDate && orderDate >= start && orderDate <= end) ||
        (dueDate && dueDate >= start && dueDate <= end) ||
        (deliveryDate && deliveryDate >= start && deliveryDate <= end);
    } else if (start) {
      dateMatch =
        (orderDate && orderDate >= start) ||
        (dueDate && dueDate >= start) ||
        (deliveryDate && deliveryDate >= start);
    } else if (end) {
      dateMatch =
        (orderDate && orderDate <= end) ||
        (dueDate && dueDate <= end) ||
        (deliveryDate && deliveryDate <= end);
    }

    const statusMatch = searchStatus === "" || item.status === searchStatus;

    return searchTermMatch && dateMatch && statusMatch;
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

  // เพิ่มฟังก์ชันแปลงสถานะเป็นภาษาไทย
  const getStatusThai = (status) => {
    switch (status) {
      case "Pending":
        return "รอดำเนินการ";
      case "Complete":
        return "เสร็จสิ้น";
      default:
        return status;
    }
  };

  // แก้ไขฟังก์ชัน handleEdit
  const handleEdit = async (detailId, orderId) => {
    try {
      const orderData = data.find((item) => item.id === detailId);
      setSelectedOrder({
        detailId,
        orderId,
        ...orderData,
      });
      setIsEditModalOpen(true);
    } catch (error) {
      console.error("Error handling edit:", error);
      alert("เกิดข้อผิดพลาดในการแก้ไขข้อมูล");
    }
  };

  // แก้ไขฟังก์ชัน handleDelete
  const handleDelete = async (detailId, orderId) => {
    try {
      const result = await Swal.fire({
        title: "คุณแน่ใจหรือไม่?",
        text: "คุณต้องการลบข้อมูลนี้ใช่หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ใช่, ลบข้อมูล",
        cancelButtonText: "ยกเลิก",
      });

      if (result.isConfirmed) {
        const response = await deleteOrderDetail(orderId, detailId);
        if (response.status === 200) {
          setData((prevData) =>
            prevData.filter((item) => item.id !== detailId)
          );
          Swal.fire({
            title: "ลบข้อมูลสำเร็จ!",
            icon: "success",
            timer: 1500,
          });
        }
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถลบข้อมูลได้",
        icon: "error",
      });
    }
  };

  // เพิ่มฟังก์ชันสำหรับการแบ่งหน้า
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // เพิ่ม Modal component สำหรับแก้ไข
  const EditModal = ({ isOpen, onClose, order }) => {
    const [editData, setEditData] = useState({
      quantityOrdered: "",
      deliveryDate: null,
      quantityDelivered: "",
      status: "", // ใช้สำหรับการแก้ไข
    });

    useEffect(() => {
      if (order) {
        try {
          let deliveryDate = null;

          if (order.deliveryDate && order.deliveryDate !== "--") {
            // แยกวันที่ด้วย '/'
            const parts = order.deliveryDate.split("/");
            if (parts.length === 3) {
              // แปลงเป็น Date object โดยใช้รูปแบบ dd/mm/yyyy
              const [day, month, year] = parts;
              deliveryDate = new Date(year, month - 1, day);
            } else {
              // กรณีรูปแบบอื่นๆ
              deliveryDate = new Date(order.deliveryDate);
            }
          }

          setEditData({
            quantityOrdered: order.quantityOrdered || 0,
            deliveryDate: deliveryDate,
            quantityDelivered: order.quantityDelivered || 0,
            status: order.status || "Pending",
          });
        } catch (error) {
          console.error("Error parsing date:", error);
          setEditData({
            quantityOrdered: order.quantityOrdered || 0,
            deliveryDate: null,
            quantityDelivered: order.quantityDelivered || 0,
            status: order.status || "Pending",
          });
        }
      }
    }, [order]);

    const handleSubmit = async (e) => {
      e.preventDefault();

      // Add validation checks
      if (!editData.quantityOrdered || editData.quantityOrdered <= 0) {
        Swal.fire({
          title: "ข้อผิดพลาด!",
          text: "กรุณาระบุจำนวนที่สั่งให้ถูกต้อง",
          icon: "error"
        });
        return;
      }

      if (!editData.deliveryDate) {
        Swal.fire({
          title: "ข้อผิดพลาด!",
          text: "กรุณาระบุวันที่ส่งผลิต",
          icon: "error"
        });
        return;
      }

      if (!editData.quantityDelivered || editData.quantityDelivered < 0) {
        Swal.fire({
          title: "ข้อผิดพลาด!",
          text: "กรุณาระบุจำนวนที่ส่งให้ถูกต้อง",
          icon: "error"
        });
        return;
      }

      // Add confirmation dialog before submitting
      const confirmResult = await Swal.fire({
        title: "ยืนยันการแก้ไข",
        text: "คุณต้องการบันทึกการเปลี่ยนแปลงหรือไม่?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก"
      });

      if (!confirmResult.isConfirmed) {
        return;
      }

      try {
        const detailData = {
          _id: order.detailId,
          quantityKg: editData.quantityOrdered,
          delivery: {
            actualKg: editData.quantityDelivered,
            deliveredDate: editData.deliveryDate
              ? format(editData.deliveryDate, "yyyy-MM-dd")
              : null,
            status: editData.status,
          },
        };

        const response = await updateOrderDetail(order.orderId, detailData);

        if (response.status === 200) {
          // Update the data state with new values
          setData(prevData =>
            prevData.map(item =>
              item.id === order.detailId
                ? {
                  ...item,
                  quantityOrdered: editData.quantityOrdered,
                  deliveryDate: format(editData.deliveryDate, "dd/MM/yyyy"),
                  quantityDelivered: editData.quantityDelivered,
                  status: editData.status
                }
                : item
            )
          );

          await Swal.fire({
            title: "สำเร็จ!",
            text: "แก้ไขข้อมูลเรียบร้อยแล้ว",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
          });
          onClose();
        }
      } catch (error) {
        console.error("Error updating order:", error);
        Swal.fire({
          title: "เกิดข้อผิดพลาด!",
          text: "ไม่สามารถแก้ไขข้อมูลได้",
          icon: "error",
          confirmButtonText: "ตกลง"
        });
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
        <div className="bg-white p-6 rounded-lg w-96">
          <h2 className="text-xl mb-4">แก้ไขข้อมูล</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2">จำนวนที่สั่ง (กก.)</label>
              <input
                type="number"
                value={editData.quantityOrdered}
                onChange={(e) =>
                  setEditData({ ...editData, quantityOrdered: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">วันที่ส่งผลิต</label>
              <TextField
                type="date"
                value={editData.deliveryDate ? format(editData.deliveryDate, "yyyy-MM-dd") : ''}
                onChange={(e) =>
                  setEditData({ ...editData, deliveryDate: new Date(e.target.value) })
                }
                className="w-full"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">จำนวนที่ส่ง (กก.)</label>
              <input
                type="number"
                value={editData.quantityDelivered}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    quantityDelivered: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">สถานะ</label>
              <select
                value={editData.status}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded"
              >
                <option value="Pending">รอดำเนินการ</option>
                <option value="Complete">เสร็จสิ้น</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-Green-button text-white rounded"
              >
                บันทึก
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // เพิ่มฟังก์ชันสำหรับการแสดง/ซ่อนการค้นหาขั้นสูง
  const toggleAdvancedSearch = () => {
    setShowAdvancedSearch((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-5 mx-0 lg:mx-20 lg:mb-[2%] bg-Green-Custom lg:rounded-3xl p-6">
      <div className="text-xl">จัดการข้อมูล</div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-4 items-center">
          {/* ช่องค้นหาทั่วไป */}
          <div className="relative w-full sm:w-[50%] lg:w-[30%]">
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
              placeholder="ค้นหาข้อมูล (ชื่อ, จำนวนกิโล)"
              value={searchTerm}
              onChange={(e) => handleSearch("general", e.target.value)}
              className="h-11 w-full rounded-lg bg-white border border-gray-300 bg-transparent py-2.5 pl-12 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10"
            />
          </div>

          {/* ปุ่มค้นหาเพิ่มเติม */}
          <button
            onClick={toggleAdvancedSearch}
            className="w-full sm:w-[120px] px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
          >
            {showAdvancedSearch ? "ปิด" : "ค้นหาเพิ่มเติม"}
          </button>
        </div>

        {/* แสดงช่องค้นหาขั้นสูงเมื่อ showAdvancedSearch เป็น true */}
        <div
          className={`flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-2 items-start sm:items-center p-2 overflow-hidden transition-all duration-300 ease-in-out ${showAdvancedSearch ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          {/* ช่วงวันที่ */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <span className="text-sm text-gray-600 whitespace-nowrap self-center">ช่วงวันที่:</span>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto">
                <input
                  type="date"
                  className="w-full sm:w-auto px-4 py-2 border rounded-lg text-gray-600"
                  value={dateRange.start}
                  onChange={(e) => {
                    handleSearch("dateRange", { start: e.target.value });
                    if (new Date(e.target.value) > new Date(dateRange.end)) {
                      setDateRange((prev) => ({ ...prev, end: e.target.value }));
                    }
                  }}
                />
              </div>
              <span className="text-sm text-gray-600 self-center">ถึง</span>
              <div className="relative w-full sm:w-auto">
                <input
                  type="date"
                  className="w-full sm:w-auto px-4 py-2 border rounded-lg text-gray-600"
                  value={dateRange.end}
                  onChange={(e) =>
                    handleSearch("dateRange", { end: e.target.value })
                  }
                  min={dateRange.start}
                />
              </div>
            </div>
          </div>

          {/* สถานะ */}
          <div className="w-full sm:w-auto">
            <select
              value={searchStatus}
              onChange={(e) => handleSearch("status", e.target.value)}
              className="w-full sm:w-auto px-4 py-2 border rounded-lg bg-white text-gray-600"
            >
              <option value="">สถานะทั้งหมด</option>
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
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

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        {/* Add max-width and overflow control to table container */}
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1200px]"> {/* Add minimum width to ensure table doesn't compress too much */}
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
                    ลูกสวน
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-bold text-gray-600 w-[150px]"
                  >
                    ชื่อผัก
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-bold text-gray-600 w-[150px]"
                  >
                    ผู้รับซื้อ
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-bold text-gray-600 w-[120px]"
                  >
                    วันที่สั่งปลูก
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-bold text-gray-600 w-[120px]"
                  >
                    วันที่กำหนดส่ง
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-bold text-gray-600 w-[120px]"
                  >
                    จำนวนที่สั่ง (กก.)
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-bold text-gray-600 w-[120px]"
                  >
                    วันที่ส่งผลิต
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-bold text-gray-600 w-[120px]"
                  >
                    จำนวนที่ส่ง (กก.)
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-bold text-gray-600 w-[150px]"
                  >
                    สถานะ
                  </th>
                  {user?.role !== "farmer" && ( // ตรวจสอบว่า user ไม่ใช่ farmer
                    <th
                      scope="col"
                      className="px-6 py-4 font-bold text-gray-600 last:rounded-tr-lg text-center w-[150px]"
                    >
                      จัดการข้อมูล
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-600">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{item.farmerId}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {item.vegetableName}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {item.buyerName}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {item.orderDate}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{item.dueDate}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {item.quantityOrdered}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {item.deliveryDate}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {item.quantityDelivered}
                    </td>
                    <td className="px-6 py-4 text-gray-600 min-w-[130px]">
                      <span className={`rounded-xl px-2 py-1 ${item.status === "Pending" ? "bg-yellow-200" : "bg-green-200"
                        }`}>
                        {getStatusThai(item.status)}
                      </span>
                    </td>
                    {user?.role !== "farmer" && ( // ตรวจสอบว่า user ไม่ใช่ farmer
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(item.id, item.orderId)}
                            className="bg-Green-button hover:bg-green-600 text-white shadow-md px-4 py-2 rounded-lg transition-colors"
                          >
                            แก้ไข
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.orderId)}
                            className="bg-red-600 hover:bg-red-700 text-white shadow-md px-4 py-2 rounded-lg transition-colors"
                          >
                            ลบ
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination section */}
        <div className="flex flex-wrap justify-center items-center gap-2 mt-4 mb-4 px-4">
          {/* First and Previous buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="hidden sm:block px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
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
          </div>

          {/* Page numbers */}
          <div className="flex flex-wrap justify-center gap-2">
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              // Show fewer pages on mobile
              const mobileRange = window.innerWidth < 640 ? 1 : 2;

              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - mobileRange && pageNumber <= currentPage + mobileRange)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-3 sm:px-4 py-2 text-sm rounded-lg ${currentPage === pageNumber
                      ? "bg-Green-button text-white"
                      : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                      }`}
                  >
                    {pageNumber}
                  </button>
                );
              } else if (
                pageNumber === currentPage - (mobileRange + 1) ||
                pageNumber === currentPage + (mobileRange + 1)
              ) {
                return (
                  <span
                    key={pageNumber}
                    className="hidden sm:inline-block px-2 py-2 text-sm text-gray-600"
                  >
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>

          {/* Next and Last buttons */}
          <div className="flex gap-2">
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
              className="hidden sm:block px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              หน้าสุดท้าย
            </button>
          </div>
        </div>
      </div>
      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default ManagePage;
