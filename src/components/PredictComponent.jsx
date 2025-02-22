import React, { useState, useEffect } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { predictOrder } from "../services/orderService";
import { getVegetables } from "../services/vegatableService";

const PredictComponent = () => {
  const [vegetable, setVegetable] = useState(null);
  const [vegetableList, setVegetableList] = useState([]);
  const [requiredKg, setRequiredKg] = useState("");
  const [numFarmers, setNumFarmers] = useState("");
  const [predictionData, setPredictionData] = useState([]); // สำหรับเก็บข้อมูลที่ได้จากการทำนาย

  const prediction = async () => {
    try {
      const response = await predictOrder({
        plant: vegetable?.name, // ใช้ชื่อผักจาก state หรือค่า default
        required_kg: parseFloat(requiredKg),
        num_farmers: parseInt(numFarmers),
      });
      setPredictionData(response.data.data); // เก็บข้อมูลที่ได้จาก prediction
    } catch (error) {
      console.error("Failed to fetch vegetables:", error);
    }
  };

  const fetchVegetables = async () => {
    try {
      const response = await getVegetables();
      setVegetableList(response.data);
    } catch (error) {
      console.error("Failed to fetch vegetables:", error);
    }
  };

  useEffect(() => {
    fetchVegetables();
  }, []);

  return (
    <div className="bg-Green-Custom rounded-3xl flex flex-col p-6">
      <div className="text-xl mb-6">ทำนาย</div>
      <div className="flex space-x-4 mx-[5%] mb-6">
        <div className="flex items-center min-w-[200px]">
          <span className="text-lg mr-2">ผัก:</span>
          <Autocomplete
            options={vegetableList}
            getOptionLabel={(option) => option.name}
            value={vegetable}
            onChange={(event, newValue) => setVegetable(newValue)}
            className="w-full"
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
            loading={vegetableList.length === 0}
            disableClearable
            noOptionsText={
              vegetableList.length === 0 ? (
                <CircularProgress size={24} />
              ) : (
                "ไม่พบผัก"
              )
            }
          />
        </div>

        <div className="flex items-center min-w-[220px]">
          <span className="text-lg mr-2">จำนวนที่ต้องการ (กก.):</span>
          <TextField
            type="number"
            value={requiredKg}
            onChange={(e) => setRequiredKg(e.target.value)}
            variant="outlined"
            size="small"
            className="bg-white rounded-lg"
            label="กรอกจำนวน (กก.)"
          />
        </div>

        <div className="flex items-center min-w-[220px]">
          <span className="text-lg mr-2">จำนวนคน:</span>
          <TextField
            type="number"
            value={numFarmers}
            onChange={(e) => setNumFarmers(e.target.value)}
            variant="outlined"
            size="small"
            className="bg-white rounded-lg"
            label="กรอกจำนวนคน"
          />
        </div>
        <button
          onClick={prediction}
          className="bg-Green-button text-white rounded-lg w-24 text-base p-2 mx-auto"
        >
          ทำนาย
        </button>
      </div>

      {/* แสดงตาราง */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mx-[5%] mb-6">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200">
            <tr>
              <th className="px-6 py-3">ลำดับ</th>
              <th className="px-6 py-3">ชื่อลูกสวน</th>
              <th className="px-6 py-3">จำนวนที่ทำได้สูงสุด</th>
              <th className="px-6 py-3">จำนวนที่ควรสั่งให้ปลูก</th>
            </tr>
          </thead>
          <tbody>
            {predictionData.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center bg-white py-4">
                  ไม่มีข้อมูลการทำนาย
                </td>
              </tr>
            ) : (
              predictionData.map((item, index) => (
                <tr
                  key={item.ID}
                  className="odd:bg-white even:bg-gray-50 border-b"
                >
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">
                    {item.firstname} {item.lastname}
                  </td>
                  <td className="px-6 py-4">{item.Max_Actual_KG}</td>
                  <td className="px-6 py-4">{item.Adjusted_Predicted_KG}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PredictComponent;
