import React, { useState, useEffect } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import {
  predictOrder,
  checkAvailableFarmers,
} from "../services/predictService";
import { getVegetables } from "../services/vegatableService";

const PredictComponent = ({ onVegetableSelect, selectedVegetable }) => {
  const [vegetableList, setVegetableList] = useState([]);
  const [requiredKg, setRequiredKg] = useState("");
  const [numFarmers, setNumFarmers] = useState("");
  const [predictionData, setPredictionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [availableFarmers, setAvailableFarmers] = useState(0);
  const [isFarmersChecked, setIsFarmersChecked] = useState(false);

  const prediction = async () => {
    try {
      setIsLoading(true);
      const response = await predictOrder({
        plant: selectedVegetable?.name,
        required_kg: parseFloat(requiredKg),
        num_farmers: parseInt(numFarmers),
      });
      setPredictionData(response.data.data);
    } catch (error) {
      console.error("Failed to fetch vegetables:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVegetables = async () => {
    try {
      const response = await getVegetables();
      const sortedVegetables = response.data.sort((a, b) => {
        // เปรียบเทียบชื่อผักโดยใช้ localeCompare สำหรับภาษาไทย
        return a.name.localeCompare(b.name, "th");
      });
      setVegetableList(sortedVegetables);
    } catch (error) {
      console.error("Failed to fetch vegetables:", error);
    }
  };

  const checkAvailableFarmersForSelectedVegetable = async (
    selectedVegetable
  ) => {
    if (!selectedVegetable) return;
    setIsLoading(true); // Start loading state

    try {
      const response = await checkAvailableFarmers({
        plant: selectedVegetable.name,
      });
      setAvailableFarmers(response.data.availableFarmers);
      setIsFarmersChecked(true);
    } catch (error) {
      console.error("Failed to check available farmers:", error);
      setIsFarmersChecked(false);
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  useEffect(() => {
    fetchVegetables();
  }, []);

  return (
    <div className="bg-Green-Custom md:rounded-3xl flex flex-col p-6">
      <div className="text-xl mb-6">ทำนาย</div>
      <div className="flex flex-col lg:flex-row lg:items-center space-x-0 lg:space-x-4 mx-[3%] md:mx-[5%] mb-6">
        <div className="flex items-center min-w-[200px] mb-4 lg:mb-0">
          {/* <span className="text-lg mr-2">ผัก:</span> */}
          <Autocomplete
            options={vegetableList}
            getOptionLabel={(option) => option.name}
            value={selectedVegetable}
            onChange={(event, newValue) => {
              onVegetableSelect(newValue);
              checkAvailableFarmersForSelectedVegetable(newValue);
            }}
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

        {isFarmersChecked && (
          <>
            <div className="flex items-center min-w-[220px] mb-4 lg:mb-0">
              {/* <span className="text-lg mr-2">จำนวนที่ต้องการ  :</span> */}
              <TextField
                type="number"
                value={requiredKg}
                onChange={(e) => setRequiredKg(e.target.value)}
                variant="outlined"
                size="small"
                className="bg-white rounded-lg w-full"
                label="กรอกจำนวน (กก.)"
              />
            </div>

            <div className="flex items-center min-w-[220px] mb-4 lg:mb-0">
              {/* <span className="text-lg mr-2">จำนวนคน (สูงสุด: {availableFarmers}):</span> */}
              <TextField
                type="number"
                value={numFarmers}
                onChange={(e) => {
                  const value = Math.min(e.target.value, availableFarmers);
                  setNumFarmers(value);
                }}
                variant="outlined"
                size="small"
                className="bg-white rounded-lg w-full"
                label={`กรอกจำนวนคน (สูงสุด ${availableFarmers} คน)`}
              />
            </div>
          </>
        )}
        <button
          onClick={prediction}
          disabled={isLoading}
          className="bg-Green-button text-white rounded-lg w-full lg:w-24 text-base p-2 mx-auto disabled:opacity-50 h-10"
        >
          {isLoading ? <CircularProgress size={20} color="inherit" /> : "ทำนาย"}
        </button>
      </div>

      {/* แสดงตาราง */}
      <div className="relative overflow-x-auto sm:rounded-lg mx-[3%] md:mx-[5%] mb-6">
        <div className="min-w-[800px]">
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
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="text-center bg-white py-8">
                    <CircularProgress sx={{ color: "#4CAF50" }} />
                  </td>
                </tr>
              ) : predictionData.length === 0 ? (
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
    </div>
  );
};

export default PredictComponent;
