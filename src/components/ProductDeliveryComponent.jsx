import React, { useState, useEffect } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
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
      value ? parseFloat(value) : 0;
    setOrders(updatedOrders);
  };

  const handleDeliveryDateChange = (orderIndex, detailIndex, date) => {
    const updatedOrders = [...orders];
    if (date) {
      updatedOrders[orderIndex].details[detailIndex].delivery.deliveredDate = format(date, "yyyy-MM-dd");
    }
    setOrders(updatedOrders);
  };

  const handleSave = async () => {
    // สร้าง payload สำหรับการบันทึก
    const detailsToUpdate = [];

    for (let i = 0; i < orders.length; i++) {
      for (let j = 0; j < orders[i].details.length; j++) {
        const detail = orders[i].details[j];
        // ตรวจสอบว่ามีการกรอก actualKg หรือไม่
        if (detail.delivery.actualKg > 0) {
          detailsToUpdate.push({
            _id: detail._id,
            farmerId: detail.farmerId._id,
            quantityKg: detail.quantityKg,
            delivery: {
              actualKg: parseFloat(detail.delivery.actualKg) || 0,
              deliveredDate: detail.delivery.deliveredDate || format(new Date(), "yyyy-MM-dd"),
              status: "Complete",
            },
          });
        }
      }
    }

    // หากไม่มีการกรอกข้อมูลเลย
    if (detailsToUpdate.length === 0) {
      Swal.fire("ไม่มีข้อมูลที่จะบันทึก!", "กรุณากรอกข้อมูลก่อนบันทึก.", "warning");
      return;
    }

    // หากมีการกรอกข้อมูล จะทำการสร้าง payload และบันทึก
    const payload = {
      orderDate: orders[0]?.orderDate,
      season: "Summer",
      details: detailsToUpdate,
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
        setVegetable(null);
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
    <div className="bg-Green-Custom rounded-3xl flex flex-col md:pt-6 pb-6 px-6">
      <div className="text-xl mb-6">บันทึกการส่งผลิต</div>
      <div className="flex flex-col">
        <div className="flex space-x-5 mx-[2%] lg:mx-[5%] mb-6">
          <div className="flex items-center space-x-2 w-full lg:w-[20%]">
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

        {/* Original div */}
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mx-[2%] lg:mx-[5%] mb-6">
          <div className="min-w-[800px]">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                <tr>
                  <th className="px-6 py-3">ลำดับ</th>
                  <th className="px-6 py-3 min-w-32">ลูกสวน</th>
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
                  orders.map((order, index) => {
                    const pendingDetails = order.details.filter(detail => detail.delivery.status !== "Complete");
                    return pendingDetails.length > 0 ? (
                      <React.Fragment key={order._id}>
                        {pendingDetails.map((detail, subIndex) => (
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
                            <td className="px-6 py-4">{detail.quantityKg}</td>
                            <td className="px-6 py-4">
                              {format(new Date(order.orderDate), "dd/MM/yyyy")}
                            </td>
                            <td className="px-6 py-4">
                              {format(new Date(order.dueDate), "dd/MM/yyyy")}
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
                              <input
                                type="date"
                                className="border rounded-lg p-1 text-center"
                                value={
                                  detail.delivery.deliveredDate ||
                                  format(new Date(), "yyyy-MM-dd")
                                }
                                onChange={(e) =>
                                  handleDeliveryDateChange(
                                    index,
                                    subIndex,
                                    new Date(e.target.value)
                                  )
                                }
                              />
                            </td>
                          </tr>
                        ))}
                        {index < orders.length - 1 && (
                          <tr>
                            <td colSpan="8" className="py-2"></td>
                          </tr>
                        )}
                      </React.Fragment>
                    ) : null;
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mx-[2%] lg:mx-[5%]">
          <button
            onClick={handleSave}
            className="bg-Green-button text-white rounded-lg w-full lg:w-24 text-base p-2"
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDeliveryComponent;
