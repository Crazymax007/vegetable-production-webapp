import React, { useState, useEffect } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { getVegetables } from "../services/vegatableService";
import { getFarmers } from "../services/farmerService";
import { getBuyers } from "../services/buyerService";
import { createOrder } from "../services/orderService";
import Swal from "sweetalert2"; // นำเข้า SweetAlert2
import { DatePicker } from "@mui/x-date-pickers"; // ใช้ MUI DatePicker
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { th } from "date-fns/locale"; // ใช้ locale ภาษาไทย
import { format } from "date-fns";
import "../pages/planPage/PlanPage.css";

const PlantOrderComponent = ({ selectedVegetable, onVegetableSelect }) => {
  const [vegetableList, setVegetableList] = useState([]);
  const [farmerList, setFarmerList] = useState([]);
  const [buyerList, setBuyerList] = useState([]);
  const [selectedReceiver, setSelectedReceiver] = useState(null);
  const [selectedFarmers, setSelectedFarmers] = useState([
    { farmer: null, amount: "" },
  ]);
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchVegetables = async () => {
    setLoading(true);
    try {
      const response = await getVegetables();
      const sortedVegetables = response.data.sort((a, b) => {
        return a.name.localeCompare(b.name, "th");
      });
      setVegetableList(sortedVegetables);
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

  const fetchBuyers = async () => {
    setLoading(true);
    try {
      const response = await getBuyers();
      setBuyerList(response.data);
    } catch (error) {
      console.error("Failed to fetch buyers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVegetables();
    fetchFarmers();
    fetchBuyers();
  }, []);

  const getAvailableFarmers = (index) => {
    return farmerList.filter((farmer) => {
      return !selectedFarmers.some(
        (selected) =>
          selected.farmer?._id === farmer._id &&
          selected !== selectedFarmers[index]
      );
    });
  };

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
    if (!selectedVegetable) {
      return Swal.fire("ผิดพลาด", "กรุณาเลือกผัก", "error");
    }

    if (!selectedReceiver) {
      return Swal.fire("ผิดพลาด", "กรุณาเลือกผู้รับสินค้า", "error");
    }

    if (!selectedDate) {
      return Swal.fire("ผิดพลาด", "กรุณาเลือกวันที่สั่ง", "error");
    }

    if (!dueDate) {
      return Swal.fire("ผิดพลาด", "กรุณาเลือกวันที่กำหนดส่ง", "error");
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

    const orderData = {
      orderDate: selectedDate,
      dueDate: dueDate,
      vegetableId: selectedVegetable?._id,
      buyerId: selectedReceiver._id,
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

        setSelectedFarmers([{ farmer: null, amount: "" }]);
        setSelectedDate("");
        setDueDate("");
      } catch (error) {
        console.error("Error creating order:", error);
        Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถบันทึกข้อมูลได้.", "error");
      }
    }
  };

  return (
    <div className="bg-Green-Custom md:rounded-3xl flex flex-col p-6">
      <div className="text-xl mb-6">มอบหมายการปลูก</div>
      <div className="flex flex-col">
        <div className="flex justify-between space-x-4 mx-[5%] mb-6 ">
          <div className="flex items-center space-x-4 w-[80%]">
            <div className="flex items-center space-x-2 w-[20%] ">
              <span className="text-lg whitespace-nowrap">ผัก:</span>
              <Autocomplete
                options={vegetableList}
                getOptionLabel={(option) => option.name}
                value={selectedVegetable}
                onChange={(event, newValue) => {
                  onVegetableSelect(newValue);
                }}
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
                loading={loading}
                disableClearable
                noOptionsText={
                  loading ? <CircularProgress size={24} /> : "ไม่พบผัก"
                }
              />
            </div>
            <div className="flex items-center space-x-2 w-[30%]">
              <span className="text-lg whitespace-nowrap">ผู้รับซื้อ:</span>
              <Autocomplete
                options={buyerList}
                getOptionLabel={(option) => option.name}
                value={selectedReceiver}
                onChange={(event, newValue) => setSelectedReceiver(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="เลือกผู้รับซื้อ"
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
                loading={loading}
                disableClearable
                noOptionsText={
                  loading ? <CircularProgress size={24} /> : "ไม่พบผู้รับซื้อ"
                }
              />
            </div>
            <div className="flex items-center space-x-2 w-[25%]">
              <span className="whitespace-nowrap text-lg">วันที่สั่ง: </span>
              <TextField
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-white rounded-lg"
                size="small"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
            <div className="flex items-center space-x-2 w-[25%]">
              <span className="whitespace-nowrap text-lg">กำหนดส่ง: </span>
              <TextField
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-white rounded-lg"
                size="small"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: selectedDate || undefined,
                }}
              />
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
              <span className="whitespace-nowrap">
                ลูกสวนคนที่ {index + 1}:{" "}
              </span>
              <Autocomplete
                options={getAvailableFarmers(index)}
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
                <span className="whitespace-nowrap">จำนวน(กก.): </span>
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
                disabled={index === 0}
              >
                ลบ
              </button>
            </div>
          ))}
        </div>
        <button
          className="bg-Green-button text-white rounded-lg w-24 text-base p-2 mx-[5%]"
          onClick={handleSave}
        >
          บันทึก
        </button>
      </div>
    </div>
  );
};

export default PlantOrderComponent;
