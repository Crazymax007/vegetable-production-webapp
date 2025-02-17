import React, { useState, useEffect } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { getVegetables } from "../services/vegatableService";
import { getFarmers } from "../services/farmerService";
import { createOrder } from "../services/orderService";
import Swal from "sweetalert2"; // นำเข้า SweetAlert2

const PlantOrderComponent = () => {
  const [vegetable, setVegetable] = useState(null);
  const [vegetableList, setVegetableList] = useState([]);
  const [farmerList, setFarmerList] = useState([]);
  const [selectedFarmers, setSelectedFarmers] = useState([
    { farmer: null, amount: "", date: "" },
  ]);
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
    setSelectedFarmers([
      ...selectedFarmers,
      { farmer: null, amount: "", date: "" },
    ]);
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
    // ตรวจสอบว่าเลือกผักและกรอกข้อมูลทุกอย่างครบถ้วนหรือไม่
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

    const currentDate = new Date().toISOString(); // ใช้เวลาปัจจุบันในรูปแบบ UTC
    const formattedDate = currentDate.split("T")[0] + "T00:00:00.000+00:00"; // เปลี่ยนเป็นรูปแบบที่ต้องการ
    const orderData = {
      orderDate: formattedDate,
      vegetableId: vegetable?._id,
      details: selectedFarmers.map((farmer) => ({
        farmerId: farmer.farmer?._id,
        quantityKg: farmer.amount,
      })),
    };

    // แสดง SweetAlert2 เพื่อยืนยันการบันทึก
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
        const response = await createOrder(orderData); // เรียกใช้ createOrder
        Swal.fire("สำเร็จ!", "ข้อมูลการบันทึกสำเร็จ.", "success");
        console.log("Order created successfully:", response);

        // ล้างค่า (reset states) หลังบันทึกสำเร็จ
        setVegetable(null);
        setSelectedFarmers([{ farmer: null, amount: "", date: "" }]);
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
          <div className="flex items-center space-x-2 w-[20%]">
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
              <div>
                <span>วันที่: </span>
                <input
                  type="date"
                  className="border p-1 bg-white rounded-lg text-center"
                  value={new Date().toISOString().split("T")[0]} // แสดงวันที่ปัจจุบัน
                  disabled // ป้องกันไม่ให้แก้ไขหรือเลือกวันที่
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
