import React, { useState, useEffect } from "react";
import "./ManagePage.css";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/material";
import TableComponent from "../../components/TableComponent";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Dayjs from "dayjs"; // ใช้ในการจัดการวันที่

// 🛜 ดึง API
import { getFarmers } from "../../services/farmerService";
import { getVegetables } from "../../services/vegatableService";
import { getOrders } from "../../services/orderService";

const ManagePage = () => {
  const [farmer, setFarmer] = useState([]);
  const [vegetables, setVegetables] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [selectedVegetable, setSelectedVegetable] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null); // state สำหรับวันที่ที่เลือก
  const [status, setStatus] = useState(""); // state สำหรับสถานะ

  // ฟังก์ชั่นในการดึงข้อมูลจาก API ของ farmer
  const fetchFarmer = async () => {
    try {
      const response = await getFarmers();
      setFarmer(response.data);
    } catch (error) {
      console.error("Failed to fetch farmers:", error);
    }
  };

  // ฟังก์ชั่นในการดึงข้อมูลจาก API ของ vegetables
  const fetchVegetables = async () => {
    try {
      const response = await getVegetables();
      setVegetables(response.data);
    } catch (error) {
      console.error("Failed to fetch vegetables:", error);
    }
  };
  const fetchOrders = async (farmerId, search = "") => {
    try {
      const response = await getOrders({ farmerId, search, actualKg });
      console.log("Orders:", response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    fetchFarmer();
    fetchVegetables();
    fetchOrders("", "ผักกาดหอม", "11");
  }, []);

  useEffect(() => {
    console.log("Selected Farmer:", selectedFarmer);
  }, [selectedFarmer]);

  useEffect(() => {
    console.log("Selected Vegetable:", selectedVegetable);
  }, [selectedVegetable]);

  useEffect(() => {
    console.log("Selected Date:", selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    console.log("Selected Status:", status);
  }, [status]);

  return (
    <div className="flex flex-col mx-20 bg-Green-Custom rounded-3xl p-6">
      <div className="text-xl ">จัดการข้อมูล</div>
      <div className="flex flex-col mt-6 px-4 ">
        <div className="flex gap-2 mb-6">
          {/* Autocomplete สำหรับเลือกลูกสวน */}
          <Autocomplete
            options={farmer}
            getOptionLabel={(option) =>
              `${option.firstName} ${option.lastName}`
            }
            onChange={(event, newValue) => setSelectedFarmer(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="เลือกลูกสวน"
                variant="outlined"
                sx={{
                  width: "250px",
                  height: "45px",
                  borderRadius: "10px",
                  backgroundColor: "white",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    height: "45px",
                    padding: "0 12px",
                  },
                  "& .MuiInputLabel-root": {
                    top: "-6px",
                  },
                }}
              />
            )}
            renderOption={(props, option) => {
              const { key, ...rest } = props;
              return (
                <Box key={option._id} component="li" {...rest}>
                  {`${option.firstName} ${option.lastName}`}
                </Box>
              );
            }}
            ListboxProps={{
              style: {
                maxHeight: 120,
                overflow: "auto",
                backgroundColor: "white",
              },
            }}
          />
          {/* Autocomplete สำหรับเลือกผัก */}
          <Autocomplete
            options={vegetables}
            onChange={(event, newValue) => setSelectedVegetable(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="เลือกผัก"
                variant="outlined"
                sx={{
                  width: "200px",
                  height: "45px",
                  borderRadius: "10px",
                  backgroundColor: "white",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    height: "45px",
                    padding: "0 12px",
                  },
                  "& .MuiInputLabel-root": {
                    top: "-6px",
                  },
                }}
              />
            )}
            getOptionLabel={(option) => option.name || option}
            renderOption={(props, option) => {
              const { key, ...rest } = props;
              return (
                <Box key={option._id || option} component="li" {...rest}>
                  {option.name || option}
                </Box>
              );
            }}
            ListboxProps={{
              style: {
                maxHeight: 120,
                overflow: "auto",
                backgroundColor: "white",
              },
            }}
          />

          {/* ช่องค้นหาวันที่ */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="เลือกวันที่"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  sx={{
                    width: "200px",
                    height: "45px",
                    borderRadius: "10px",
                    backgroundColor: "white",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      height: "45px",
                      padding: "0 12px",
                    },
                  }}
                />
              )}
            />
          </LocalizationProvider>

          {/* ช่องสถานะ */}
          <Autocomplete
            options={["Pending", "Complete"]}
            value={status}
            onChange={(event, newValue) => setStatus(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="สถานะ"
                variant="outlined"
                sx={{
                  width: "200px",
                  height: "45px",
                  borderRadius: "10px",
                  backgroundColor: "white",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    height: "45px",
                    padding: "0 12px",
                  },
                }}
              />
            )}
            getOptionLabel={(option) => {
              if (option === "Pending") return "กำลังดำเนินการ"; // ภาษาไทย
              if (option === "Complete") return "เสร็จสิ้น"; // ภาษาไทย
              return option; // ส่งคืนค่าเดิมเมื่อไม่ตรงกับเงื่อนไข
            }}
            renderOption={(props, option) => {
              const { key, ...rest } = props;
              return (
                <Box key={option} component="li" {...rest}>
                  {option === "Pending" ? "กำลังดำเนินการ" : "เสร็จสิ้น"}{" "}
                  {/* แสดงภาษาไทย */}
                </Box>
              );
            }}
          />
        </div>
        <TableComponent />
      </div>
    </div>
  );
};

export default ManagePage;
