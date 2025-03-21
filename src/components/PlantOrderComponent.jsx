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
import { useWindowSize } from "../contexts/WindowSizeContext";
import "../pages/planPage/PlanPage.css";
import Popper from '@mui/material/Popper'; // นำเข้า Popper

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
  const { width } = useWindowSize();

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
    <div className="bg-Green-Custom md:rounded-3xl flex flex-col md:pt-6 pb-6 px-6">
      <div className="flex justify-between">
        <div className="text-xl mb-6">มอบหมายการปลูก</div>
        <button
          className="bg-Green-button block al:hidden text-sm sm:text-base text-white rounded-lg p-2 h-1/4 sm:h-1/2"
          onClick={handleAddFarmer}
        >
          เพิ่มลูกสวน
        </button>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-col al:flex-row justify-between space-y-4 al:space-y-0 al:space-x-4 mx-[2%] md:mx-[3%] lg:mx-[5%] mb-6">
          <div className="flex flex-col al:flex-row items-center space-y-4 al:space-y-0 al:space-x-4">
            {/* เลือกผัก */}
            <div className="w-full al:w-auto">
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
                className="w-full rounded-lg min-w-[200px]"
                loading={loading}
                disableClearable
                noOptionsText={
                  loading ? <CircularProgress size={24} /> : "ไม่พบผัก"
                }
              />
            </div>
            {/* เลือกผู้รับซื้อ */}
            <div className="w-full al:w-auto">
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
                className="w-full rounded-lg min-w-[200px]"
                loading={loading}
                disableClearable
                noOptionsText={
                  loading ? <CircularProgress size={24} /> : "ไม่พบผู้รับซื้อ"
                }
              />
            </div>
            {/* เลือกวันที่สั่ง */}
            <div className="w-full al:w-auto">
              <TextField
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-white rounded-lg w-full"
                size="small"
                label="วันที่สั่ง"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  placeholder: "วว/ดด/ปปปป"
                }}
              />
            </div>
            {/* เลือกวันที่กำหนดสั่ง */}
            <div className="w-full al:w-auto">
              <TextField
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-white rounded-lg w-full"
                size="small"
                label="วันที่กำหนดส่ง"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: selectedDate || undefined,
                  placeholder: "วว/ดด/ปปปป"
                }}
              />
            </div>
          </div>
          <button
            className="bg-Green-button hidden al:block text-base text-white rounded-lg w-full al:w-24 p-2"
            onClick={handleAddFarmer}
          >
            เพิ่มลูกสวน
          </button>
        </div>
        {/* ลูกสวน */}
        <div className="bg-gray-200 rounded-3xl overflow-auto max-h-44 mx-[2%] md:mx-[3%] lg:mx-[5%] p-4 flex flex-col space-y-4 mb-6">
          {selectedFarmers.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 p-2"
              style={{ borderBottom: width < 640 ? "1px solid #ccc" : "" }}
            >
              <span className="whitespace-nowrap text-sm sm:text-base">
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
                className="w-full sm:w-1/3 bg-white rounded-lg"
                disablePortal
                loading={loading}
                noOptionsText={
                  loading ? <CircularProgress size={24} /> : "ไม่พบลูกสวน"
                }
                PopperComponent={(props) => <Popper {...props} placement="top" />}
              />
              {/* จำนวน */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                <span className="whitespace-nowrap text-sm sm:text-base">จำนวน(กก.): </span>
                <input
                  type="text"
                  value={item.amount}
                  onChange={(e) => handleAmountChange(index, e.target.value)}
                  className="border p-1 w-full sm:w-32 text-center rounded-lg bg-white"
                  placeholder="กรอกจำนวน"
                />
              </div>
              {/* ปุ่มลบ */}
              <button
                className={`bg-red-500 text-white rounded-lg px-4 py-1 shadow-md w-full sm:w-auto ${index == 0 ? "opacity-0" : "opacity-100"
                  }`}
                onClick={() => handleRemoveFarmer(index)}
                disabled={index === 0}
              >
                ลบ
              </button>
            </div>
          ))}
        </div>
        <div className="mx-[2%] lg:mx-[5%]">
          <button
            className="bg-Green-button text-white rounded-lg w-full al:w-24 text-base p-2"
            onClick={handleSave}
          >
            บันทึก
          </button></div>
      </div>
    </div>
  );
};

export default PlantOrderComponent;
