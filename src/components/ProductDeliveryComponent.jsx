import React, { useState, useEffect } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import th from "date-fns/locale/th";
import { getVegetables } from "../services/vegatableService";
import { getOrders } from "../services/orderService";
import Swal from "sweetalert2"; // นำเข้า SweetAlert2

registerLocale("th", th);

const ProductDeliveryComponent = () => {
  const [vegetable, setVegetable] = useState(null);
  const [vegetableList, setVegetableList] = useState([]);
  const [deliveryDate, setDeliveryDate] = useState(null); // สถานะวันที่ส่งผลิต
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

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getOrders({
        search: vegetable?._id,
        orderDate: deliveryDate ? deliveryDate.toISOString().split("T")[0] : null,
        status: "Pending",
      });
      console.log(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVegetables();
  }, []);

  useEffect(() => {
    if (vegetable || deliveryDate) {
      fetchOrders();
    }
  }, [vegetable, deliveryDate]); // เพิ่ม vegetable และ deliveryDate ใน dependency array

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
              loading={loading} // เพิ่มสถานะโหลด
              disableClearable
              noOptionsText={
                loading ? <CircularProgress size={24} /> : "ไม่พบผัก"
              }
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">วันที่สั่งปลูก:</span>
            <DatePicker
              selected={deliveryDate}
              onChange={(date) => setDeliveryDate(date)}
              dateFormat="dd/MM/yyyy"
              locale="th"
              className="border p-1 rounded-lg text-center"
            />
          </div>
        </div>
        <div className="bg-gray-200 rounded-3xl overflow-auto max-h-44 mx-[5%] p-4 flex flex-col space-y-4 mb-6">
          Hello
        </div>
      </div>
    </div>
  );
};

export default ProductDeliveryComponent;
