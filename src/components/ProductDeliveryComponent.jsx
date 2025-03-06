import React, { useState, useEffect } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { th } from "date-fns/locale";
import { format } from "date-fns";
import { getVegetables } from "../services/vegatableService";
import { getOrders, updateOrder } from "../services/orderService";
import Swal from "sweetalert2";

const ProductDeliveryComponent = () => {
  const [vegetable, setVegetable] = useState(null);
  const [vegetableList, setVegetableList] = useState([]);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [orders, setOrders] = useState([]);
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

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getOrders({
        search: vegetable?._id,
        status: "Pending",
      });
      setOrders(response.data.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (orderIndex, detailIndex, value) => {
    const updatedOrders = [...orders];
    updatedOrders[orderIndex].details[detailIndex].delivery.actualKg =
      parseFloat(value);
    setOrders(updatedOrders);
  };

  const handleDeliveryDateChange = (orderIndex, detailIndex, date) => {
    const updatedOrders = [...orders];
    updatedOrders[orderIndex].details[detailIndex].delivery.deliveredDate =
      format(date, "yyyy-MM-dd");
    setOrders(updatedOrders);
  };

  const handleSave = async () => {
    // ตรวจสอบว่ามีการกรอก actualKg หรือไม่
    for (let i = 0; i < orders.length; i++) {
      for (let j = 0; j < orders[i].details.length; j++) {
        const detail = orders[i].details[j];
        if (!detail.delivery.actualKg || detail.delivery.actualKg <= 0) {
          return Swal.fire(
            "ผิดพลาด",
            `กรุณากรอกจำนวนที่ส่ง (kg) สำหรับลูกสวนที่ ${i + 1}, รายการที่ ${
              j + 1
            }`,
            "error"
          );
        }
      }
    }

    // หากผ่านการตรวจสอบแล้วจะทำการสร้าง payload และบันทึก
    const payload = {
      orderDate: orders[0]?.orderDate,
      season: "Summer",
      details: orders.flatMap((order) =>
        order.details.map((detail) => ({
          _id: detail._id,
          farmerId: detail.farmerId._id,
          quantityKg: detail.quantityKg,
          delivery: {
            actualKg: parseFloat(detail.delivery.actualKg) || 0,
            deliveredDate: detail.delivery.deliveredDate || null,
            status: "Complete",
          },
        }))
      ),
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
        await updateOrder(orders[0]._id, payload);
        Swal.fire("สำเร็จ!", "ข้อมูลการบันทึกสำเร็จ.", "success");
        setOrders([]); // รีเซ็ตค่าหลังจากบันทึกสำเร็จ
      } catch (error) {
        console.error("Error updating order:", error);
        Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถบันทึกข้อมูลได้.", "error");
      }
    }
  };

  useEffect(() => {
    fetchVegetables();
  }, []);

  useEffect(() => {
    if (vegetable) {
      fetchOrders();
    }
  }, [vegetable]);

  return (
    <div className="bg-Green-Custom rounded-3xl flex flex-col p-6">
      <div className="text-xl mb-6">บันทึกการส่งผลิต</div>
      <div className="flex flex-col">
        <div className="flex space-x-5 mx-[5%] mb-6">
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
              loading={loading}
              disableClearable
              noOptionsText={
                loading ? <CircularProgress size={24} /> : "ไม่พบผัก"
              }
            />
          </div>
        </div>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mx-[5%] mb-6">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-200">
              <tr>
                <th className="px-6 py-3">ลำดับ</th>
                <th className="px-6 py-3">ลูกสวน</th>
                <th className="px-6 py-3">ชนิดผัก</th>
                <th className="px-6 py-3">จำนวนที่สั่ง (กก.)</th>
                <th className="px-6 py-3">วันที่สั่ง</th>
                <th className="px-6 py-3">วันที่กำหนด</th>
                <th className="px-6 py-3">จำนวนที่ส่ง (กก.)</th>
                <th className="px-6 py-3">วันที่ส่ง</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center bg-white py-4">
                    ไม่พบข้อมูล
                  </td>
                </tr>
              ) : (
                orders.map((order, index) =>
                  order.details.map((detail, subIndex) => (
                    <tr
                      key={detail._id}
                      className="odd:bg-white even:bg-gray-50 border-b"
                    >
                      <td className="px-6 py-4">{subIndex + 1}</td>
                      <td className="px-6 py-4">
                        {detail.farmerId.firstName} {detail.farmerId.lastName}
                      </td>
                      <td className="px-6 py-4">
                        {order.vegetable?.name || "ไม่ระบุ"}
                      </td>
                      {/* แสดงชนิดผักจาก order.vegetable.name */}
                      <td className="px-6 py-4">{detail.quantityKg}</td>
                      <td className="px-6 py-4">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(order.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          className="border rounded-lg p-1 text-center w-20"
                          value={detail.delivery.actualKg || ""}
                          onChange={(e) =>
                            handleInputChange(index, subIndex, e.target.value)
                          }
                        />
                      </td>
                      <td className="px-6 py-4">
                        <LocalizationProvider
                          dateAdapter={AdapterDateFns}
                          locale={th}
                        >
                          <DatePicker
                            value={
                              detail.delivery.deliveredDate
                                ? new Date(detail.delivery.deliveredDate)
                                : new Date()
                            }
                            onChange={(newValue) =>
                              handleDeliveryDateChange(
                                index,
                                subIndex,
                                newValue
                              )
                            }
                            className="bg-white rounded-lg"
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                size="small"
                                className="bg-white rounded-lg w-40"
                              />
                            )}
                            format="dd/MM/yyyy"
                          />
                        </LocalizationProvider>
                      </td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        </div>

        <button
          onClick={handleSave}
          className="bg-Green-button text-white rounded-lg w-24 text-base p-2 mx-[5%]"
        >
          บันทึก
        </button>
      </div>
    </div>
  );
};

export default ProductDeliveryComponent;
