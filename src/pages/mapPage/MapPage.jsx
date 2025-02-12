import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getFarmers } from "../../services/farmerService";
import { getTopVegetables } from "../../services/orderService";

// 🔹 สร้างไอคอน Marker แบบกำหนดเอง
const customIcon = L.icon({
  // iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
  iconUrl: "https://cdn-icons-png.flaticon.com/512/8587/8587894.png ",
  iconSize: [40, 40], // ขนาดไอคอน (กว้าง x สูง)
  iconAnchor: [20, 40], // จุดยึดของไอคอน (ทำให้หมุดตรงจุด)
  popupAnchor: [0, -40], // จุดที่ Popup จะแสดง
});

// 🔹 ฟังก์ชันเปลี่ยนตำแหน่งแผนที่
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const MapPage = () => {
  const [farmers, setFarmers] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [topVegetables, setTopVegetables] = useState([]);
  const API_BASE_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFarmers();

        if (response && Array.isArray(response.data)) {
          setFarmers(response.data);
        } else {
          console.error("Invalid data format:", response);
        }
      } catch (error) {
        console.error("Failed to fetch farmers:", error);
      }
    };
    fetchData();
  }, []);

  const handleMarkerClick = async (farmer) => {
    const vegetables = await getTopVegetables(farmer._id);

    const updatedVegetables = vegetables.topVegetables.map((veg) => ({
      ...veg,
      imageUrl: veg.imageUrl
        ? `${API_BASE_URL}${veg.imageUrl}`
        : "/uploads/default.png",
    }));

    setSelectedFarmer(farmer);
    setTopVegetables(updatedVegetables);
  };

  // สร้าง Map เพื่อตรวจจับตำแหน่งที่ซ้ำกัน
  const positionMap = new Map();

  return (
    <div className="flex justify-center gap-6 mx-20">
      <div className="rounded-3xl shadow-lg overflow-hidden w-[65%]">
        <MapContainer
          center={[9.08598, 99.229071]}
          zoom={13}
          style={{
            height: "65vh", // สูง 50% ของหน้าจอ
            width: "100%",
            minHeight: "300px", // ป้องกันไม่ให้เล็กเกินไป
            maxHeight: "600px", // ป้องกันไม่ให้สูงเกินไป
          }}
          scrollWheelZoom={true}
          dragging={true}
        >
          <ChangeView center={[9.08598, 99.229071]} zoom={15} />

          {/* แผนที่แบบการ์ตูน */}
          {/* 
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          /> */}
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          />

          {farmers
            .filter(
              (farmer) =>
                farmer.location &&
                farmer.location.latitude != null &&
                farmer.location.longitude != null
            )
            .map((farmer) => {
              let { latitude, longitude } = farmer.location;
              const key = `${latitude},${longitude}`;

              // ถ้ามีพิกัดนี้แล้ว ให้เพิ่ม offset
              if (positionMap.has(key)) {
                let count = positionMap.get(key);
                longitude += count * 0.001; // ขยับไปทางขวาทีละ 0.0001
                positionMap.set(key, count + 1);
              } else {
                positionMap.set(key, 1);
              }

              return (
                <Marker
                  key={farmer._id}
                  position={[latitude, longitude]}
                  icon={customIcon}
                  eventHandlers={{
                    click: () => handleMarkerClick(farmer), // ✅ ใช้ handleMarkerClick
                  }}
                >
                  <Popup>
                    <strong>
                      {farmer.firstName} {farmer.lastName} ({farmer.nickname})
                    </strong>{" "}
                    <br />
                    โทร: {farmer.phone} <br />
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>
      </div>
      <div className="bg-Green-Custom w-[35%] flex flex-col p-6 rounded-3xl">
        <div className="flex flex-col">
          <span className="text-center p-2 text-2xl">รายละเอียด</span>
          {selectedFarmer ? (
            <span className="p-4 text-lg">
              ลูกสวน : {selectedFarmer.firstName} {selectedFarmer.lastName}
            </span>
          ) : (
            <span className="p-4 text-lg">
              ลูกสวน :{" "}
              <span className="font-light opacity-50">กรุณาเลือกลูกสวน...</span>{" "}
            </span>
          )}
        </div>
        <div className="bg-white rounded-3xl p-4 flex-grow">
          <div className="flex flex-col">
            <span className="text-center pb-4 text-lg">
              ผักที่ปลูกได้เยอะที่สุด 3 อันดับแรก (2024)
            </span>
            <div className="flex flex-col gap-4">
              {topVegetables.length > 0 ? (
                topVegetables.map((vegetable, index) => (
                  <div key={index} className="flex items-center">
                    <span>{index + 1}.</span>
                    <img
                      src={vegetable.imageUrl}
                      className="w-[50px] h-[50px] rounded-full mx-2 p-1 border border-[#096518]"
                      alt=""
                    />
                    <div className="flex flex-col">
                      <div className="text-[#096518]">{vegetable.name}</div>
                      <div className="text-sm">
                        ปลูกได้ : {vegetable.quantity} KG
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center text-[#096518] font-normal">
                  - เลือกข้อมูลลูกสวน -
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
