import React, { useState, useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { getVegetables } from "../services/vegatableService";
import { getFarmers } from "../services/farmerService";

const PlantOrderComponent = () => {
  const [vegetable, setVegetable] = useState(null);
  const [vegetableList, setVegetableList] = useState([]);
  const [farmerList, setFarmerList] = useState([]);

  const fetchVegetables = async () => {
    try {
      const response = await getVegetables();
      setVegetableList(response.data);
    } catch (error) {
      console.error("Failed to fetch vegetables:", error);
    }
  };

  const fetchFarmers = async () => {
    try {
      const response = await getFarmers();
      setFarmerList(response.data);
    } catch (error) {
      console.error("Failed to fetch vegetables:", error);
    }
  };

  useEffect(() => {
    fetchVegetables();
    fetchFarmers();
  }, []);

  return (
    <div className="bg-Green-Custom rounded-3xl flex flex-col p-6">
      <div className="text-xl mb-6">มอบหมายการปลูก</div>
      <div className="flex flex-col">
        <div className="flex justify-between mx-[5%] mb-6">
          <div className="flex items-center space-x-2 w-[30%]">
            <span className="text-lg ">ผัก:</span>
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
                  className="bg-white rounded-md"
                  InputProps={{
                    ...params.InputProps,
                    sx: { height: "40px", padding: "4px" },
                  }}
                />
              )}
              className="w-full"
            />
          </div>
          <button className="bg-Green-button text-white rounded-lg w-24 text-base p-2">
            เพิ่มลูกสวน
          </button>
        </div>
        <div className="bg-gray-200 rounded-3xl h-52 mx-[5%] flex flex-col">
          <div className="flex">
            <span>ลูกสวนคนที่ 1: </span>
            <input type="text" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantOrderComponent;
