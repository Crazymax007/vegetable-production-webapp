import React, { useState } from "react";
import PlantOrderComponent from "../../components/PlantOrderComponent";
import ProductDeliveryComponent from "../../components/ProductDeliveryComponent";
import PredictComponent from "../../components/PredictComponent";

const PlanPage = () => {
  const [selectedComponent, setSelectedComponent] = useState("plantOrder");
  const [selectedVegetable, setSelectedVegetable] = useState(null);

  const handleVegetableSelect = (vegetable) => {
    setSelectedVegetable(vegetable);
  };

  return (
    <div>
      <div className="flex flex-col mx-0 md:mx-20 md:my-6">
        {/* ทำนาย */}
        <PredictComponent
          onVegetableSelect={handleVegetableSelect}
          selectedVegetable={selectedVegetable}
        />
        {/* สั่งปลูก */}
        <div className="flex flex-col mt-4 bg-Green-Custom md:bg-white">
          <div className="flex gap-3 m-4">
            <button
              className={`${selectedComponent == "plantOrder"
                ? "bg-Green-button text-white"
                : "bg-gray-100 md:bg-gray-300 text-black"
                }  px-7 py-2 rounded-xl text-base`}
              onClick={() => setSelectedComponent("plantOrder")}
            >
              สั่งปลูก
            </button>
            <button
              className={`${selectedComponent == "productDelivery"
                ? "bg-Green-button text-white"
                : "bg-gray-100 md:bg-gray-300 text-black"
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
