import React, { useState } from "react";
import PlantOrderComponent from "../../components/PlantOrderComponent";
import ProductDeliveryComponent from "../../components/ProductDeliveryComponent";

const PlanPage = () => {
  const [selectedComponent, setSelectedComponent] = useState("plantOrder");

  return (
    <div>
      <div className="flex flex-col mx-20 bg-Green-Custom rounded-3xl p-6">
        <div className="text-xl">ทำนาย</div>
        <img
          src="https://def2design.com/images/stories/mkt/graph_annual_report_2.jpg"
          width={300}
          alt=""
        />
      </div>
      <div className="flex flex-col mx-20">
        <div className="flex gap-3 m-4">
          <button
            className={`${
              selectedComponent == "plantOrder"
                ? "bg-Green-button text-white"
                : "bg-gray-300 text-black"
            }  px-7 py-2 rounded-xl`}
            onClick={() => setSelectedComponent("plantOrder")}
          >
            สั่งปลูก
          </button>
          <button
            className={`${
              selectedComponent == "productDelivery"
                ? "bg-Green-button text-white"
                : "bg-gray-300 text-black"
            } text-black px-7 py-2 rounded-xl`}
            onClick={() => setSelectedComponent("productDelivery")}
          >
            ส่งผลผลิต
          </button>
        </div>

        {/* แสดง Component ตามปุ่มที่กด */}
        {selectedComponent === "plantOrder" && <PlantOrderComponent />}
        {selectedComponent === "productDelivery" && (
          <ProductDeliveryComponent />
        )}
      </div>
    </div>
  );
};

export default PlanPage;
