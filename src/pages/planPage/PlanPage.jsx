import React, { useState } from "react";
import PlantOrderComponent from "../../components/PlantOrderComponent";
import ProductDeliveryComponent from "../../components/ProductDeliveryComponent";
import PredictComponent from "../../components/PredictComponent";
import { FooterComponent } from "../../components/FooterComponent";

const PlanPage = () => {
  const [selectedComponent, setSelectedComponent] = useState("plantOrder");
  const [selectedVegetable, setSelectedVegetable] = useState(null);

  const handleVegetableSelect = (vegetable) => {
    setSelectedVegetable(vegetable);
  };

  return (
    <div>
      <div className="flex flex-col mx-20 my-6">
        {/* ทำนาย */}
        <PredictComponent 
          onVegetableSelect={handleVegetableSelect}
          selectedVegetable={selectedVegetable}
        />
        {/* สั่งปลูก */}
        <div className="flex flex-col">
          <div className="flex gap-3 m-4">
            <button
              className={`${
                selectedComponent == "plantOrder"
                  ? "bg-Green-button text-white"
                  : "bg-gray-300 text-black"
              }  px-7 py-2 rounded-xl text-base`}
              onClick={() => setSelectedComponent("plantOrder")}
            >
              สั่งปลูก
            </button>
            <button
              className={`${
                selectedComponent == "productDelivery"
                  ? "bg-Green-button text-white"
                  : "bg-gray-300 text-black"
              } text-black px-7 py-2 rounded-xl text-base`}
              onClick={() => setSelectedComponent("productDelivery")}
            >
              ส่งผลผลิต
            </button>
          </div>

          {/* แสดง Component ตามปุ่มที่กด */}
          {selectedComponent === "plantOrder" && (
            <PlantOrderComponent 
              selectedVegetable={selectedVegetable}
              onVegetableSelect={handleVegetableSelect}
            />
          )}
          {selectedComponent === "productDelivery" && (
            <ProductDeliveryComponent />
          )}
        </div>
      </div>
      {/* <FooterComponent /> */}
    </div>
  );
};

export default PlanPage;
