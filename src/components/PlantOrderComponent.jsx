import React, { useState, useEffect } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { getVegetables } from "../services/vegatableService";
import { getFarmers } from "../services/farmerService";
import { createOrder } from "../services/orderService";
import Swal from "sweetalert2"; // นำเข้า SweetAlert2
import { DatePicker } from "@mui/x-date-pickers"; // ใช้ MUI DatePicker
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { th } from "date-fns/locale";
import { format } from "date-fns";
import "../pages/planPage/PlanPage.css";

const PlantOrderComponent = () => {
  const [vegetable, setVegetable] = useState(null);
  const [vegetableList, setVegetableList] = useState([]);
  const [farmerList, setFarmerList] = useState([]);
  const [selectedFarmers, setSelectedFarmers] = useState([
    { farmer: null, amount: "" },
  ]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchVegetables = async () => {
    setLoading(true);
    try {
      const response = await getVegetables();
      setVegetableList(response.data);
    } catch (error) {
      console.error("Failed to fetch vegetables:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFarmers = async () => {
    setLoading(true);
    try {
      const response = await getFarmers();
      setFarmerList(response.data);
    } catch (error) {
      console.error("Failed to fetch farmers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVegetables();
    fetchFarmers();
  }, []);

  const handleAddFarmer = () => {
    setSelectedFarmers([...selectedFarmers, { farmer: null, amount: "" }]);
  };

  const handleFarmerChange = (index, newValue) => {
    const newFarmers = [...selectedFarmers];
    newFarmers[index].farmer = newValue;
    setSelectedFarmers(newFarmers);
  };

  const handleAmountChange = (index, value) => {
    if (/^\d*$/.test(value)) {
      const newFarmers = [...selectedFarmers];
      newFarmers[index].amount = value;
      setSelectedFarmers(newFarmers);
    }
  };

  const handleRemoveFarmer = (index) => {
    if (index !== 0) {
      const newFarmers = selectedFarmers.filter((_, i) => i !== index);
      setSelectedFarmers(newFarmers);
    }
  };

  const handleSave = async () => {
    if (!vegetable) {
      return Swal.fire("ผิดพลาด", "กรุณาเลือกผัก", "error");
    }

    for (let i = 0; i < selectedFarmers.length; i++) {
      const farmer = selectedFarmers[i];
      if (!farmer.farmer) {
        return Swal.fire("ผิดพลาด", `กรุณาเลือกลูกสวนที่ ${i + 1}`, "error");
      }
      if (!farmer.amount) {
        return Swal.fire(
          "ผิดพลาด",
          `กรุณากรอกจำนวนที่ลูกสวนที่ ${i + 1}`,
          "error"
        );
      }
    }

    // หากเลือกวันที่แล้วใช้วันที่ที่เลือก หากไม่เลือกให้ใช้วันที่ปัจจุบัน
    const currentDate = selectedDate || new Date();
    // แปลงวันที่เป็น 'yyyy-MM-dd' (ไม่ต้องการเวลา)
    const formattedDate = format(currentDate, "yyyy-MM-dd");

    const orderData = {
      orderDate: formattedDate,
      vegetableId: vegetable?._id,
      details: selectedFarmers.map((farmer) => ({
        farmerId: farmer.farmer?._id,
        quantityKg: farmer.amount,
      })),
    };

    const result = await Swal.fire({
      title: "คุณแน่ใจที่จะบันทึกข้อมูลนี้?",
      text: "โปรดยืนยันการบันทึกข้อมูลการมอบหมายการปลูก",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "บันทึก",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        const response = await createOrder(orderData);
        Swal.fire("สำเร็จ!", "ข้อมูลการบันทึกสำเร็จ.", "success");

        setVegetable(null);
        setSelectedFarmers([{ farmer: null, amount: "" }]);
        setSelectedDate(null); // รีเซ็ตวันที่หลังการบันทึก
      } catch (error) {
        console.error("Error creating order:", error);
        Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถบันทึกข้อมูลได้.", "error");
      }
    }
  };

  return (
    <div className="bg-Green-Custom rounded-3xl flex flex-col p-6">
      <div className="text-xl mb-6">มอบหมายการปลูก</div>
      <div className="flex flex-col">
        <div className="flex justify-between mx-[5%] mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 w-[50%]">
              <span className="text-lg">ผัก:</span>
              <Autocomplete
                options={vegetableList}
                getOptionLabel={(option) => option.name}
                value={vegetable}
                onChange={(event, newValue) => setVegetable(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="เลือกผัก"
                    variant="outlined"
                    size="small"
                    className="bg-white rounded-lg"
                    InputProps={{
                      ...params.InputProps,
                      sx: { height: "40px", padding: "4px" },
                    }}
                  />
                )}
                className="w-full rounded-lg"
                loading={loading} // เพิ่มสถานะโหลด
                disableClearable
                noOptionsText={
                  loading ? <CircularProgress size={24} /> : "ไม่พบผัก"
                }
              />
            </div>
            <div className="flex items-center space-x-2 w-[60%]">
              <span className="w-[20%]">วันที่: </span>
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={th}>
                <DatePicker
                  value={selectedDate} // ใช้ค่า selectedDate เป็นค่าปัจจุบัน
                  onChange={(newValue) => setSelectedDate(newValue)} // อัพเดตวันที่เมื่อมีการเลือก
                  className="bg-white rounded-lg h-10 text-center"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      size="small"
                      className="  h-10"
                    />
                  )}
                  format="dd/MM/yyyy"
                />
              </LocalizationProvider>
            </div>
          </div>
          <button
            className="bg-Green-button text-white rounded-lg w-24 text-base p-2"
            onClick={handleAddFarmer}
          >
            เพิ่มลูกสวน
          </button>
        </div>
        <div className="bg-gray-200 rounded-3xl overflow-auto max-h-44 mx-[5%] p-4 flex flex-col space-y-4 mb-6">
          {selectedFarmers.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-center space-x-4"
            >
              <span>ลูกสวนคนที่ {index + 1}: </span>
              <Autocomplete
                options={farmerList}
                getOptionLabel={(option) =>
                  `${option.firstName} ${option.lastName} (${option.nickname})`
                }
                value={item.farmer}
                onChange={(event, newValue) =>
                  handleFarmerChange(index, newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="เลือกลูกสวน"
                    variant="outlined"
                    size="small"
                    className="rounded-lg"
                  />
                )}
                className="w-1/3 bg-white rounded-lg"
                disablePortal
                loading={loading}
                noOptionsText={
                  loading ? <CircularProgress size={24} /> : "ไม่พบลูกสวน"
                }
              />

              <div>
                <span>จำนวน(กก.): </span>
                <input
                  type="text"
                  value={item.amount}
                  onChange={(e) => handleAmountChange(index, e.target.value)}
                  className="border p-1 w-32 text-center rounded-lg"
                  placeholder="กรอกจำนวน"
                />
              </div>

              <button
                className={`bg-red-500 text-white rounded-lg px-4 py-1 shadow-md ${
                  index == 0 ? "opacity-0" : "opacity-100"
                }`}
                onClick={() => handleRemoveFarmer(index)}
                disabled={index === 0} // ปิดการใช้งานปุ่มลบสำหรับลูกสวนคนที่ 1
              >
                ลบ
              </button>
            </div>
          ))}
        </div>
        <button
          className="bg-Green-button text-white rounded-lg w-24 text-base p-2 mx-[5%]"
          onClick={handleSave} // ใช้ฟังก์ชัน handleSave เมื่อคลิก
        >
          บันทึก
        </button>
      </div>
    </div>
  );
};

export default PlantOrderComponent;
