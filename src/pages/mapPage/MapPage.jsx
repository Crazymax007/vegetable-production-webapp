import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getFarmers } from "../../services/farmerService";
import { getTopVegetables, getTopYear } from "../../services/orderService";
import { FooterComponent } from "../../components/FooterComponent";
import { useWindowSize } from "../../contexts/WindowSizeContext";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
  const [topYear, setTopYear] = useState([]);
  const API_BASE_URL = "http://localhost:5000";
  const currentYear = new Date().getFullYear();
  const { width } = useWindowSize();

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

  const fetchTopVegetable = async () => {
    try {
      const response = await getTopYear();
      setTopYear(response.data);
    } catch (error) {
      console.error("Failed to fetch farmers:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchTopVegetable();
  }, []);

  const handleMarkerClick = async (farmer) => {
    try {
      const response = await getTopVegetables(farmer._id);

      if (response.status === 404) {
        setSelectedFarmer(farmer);
        setTopVegetables([]);
        return;
      }

      const updatedVegetables = response.topVegetables.map((veg) => ({
        ...veg,
        imageUrl: veg.imageUrl
          ? `${API_BASE_URL}${veg.imageUrl}`
          : "/uploads/default.png",
      }));

      setSelectedFarmer(farmer);
      setTopVegetables(updatedVegetables);
    } catch (error) {
      console.error("Failed to fetch vegetables:", error);
      setSelectedFarmer(farmer);
      setTopVegetables([]);
    }
  };

  // สร้าง Map เพื่อตรวจจับตำแหน่งที่ซ้ำกัน
  const positionMap = new Map();

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col lg:flex-row justify-center gap-3 md:gap-6 mx-10 md:mx-20 mb-[5%] lg:mb-[2%] mt-[5%] lg:mt-0">
        {/* Mini map */}
        <div className="rounded-3xl shadow-md overflow-hidden w-full lg:w-[65%]">
          <MapContainer
            center={[9.08598, 99.229071]}
            zoom={13}
            style={{
              height: "65vh", // สูง 50% ของหน้าจอ
              width: "100%",
              minHeight: "300px", // ป้องกันไม่ให้เล็กเกินไป
              maxHeight: "600px", // ป้องกันไม่ให้สูงเกินไป
              zIndex: "10",
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
        {/* details */}
        <div className="bg-Green-Custom shadow-md w-full lg:w-[35%] flex flex-col p-6 rounded-3xl">
          <div className="flex flex-col">
            <span className="text-center p-2 text-2xl">รายละเอียด</span>
            {selectedFarmer ? (
              <span className="p-4 text-lg">
                ลูกสวน : {selectedFarmer.firstName} {selectedFarmer.lastName}
              </span>
            ) : (
              <span className="p-4 text-lg">
                ลูกสวน :{" "}
                <span className="font-light opacity-50">
                  กรุณาเลือกลูกสวน...
                </span>{" "}
              </span>
            )}
          </div>
          <div className="bg-white rounded-3xl p-4 flex-grow">
            <div className="flex flex-col">
              <span className="text-center pb-4 text-lg">
                ผักที่ปลูกได้เยอะที่สุด 3 อันดับแรก ({currentYear})
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
                    - ไม่มีรายการในปีนี้ -
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-Green-button shadow-md h-full py-5 flex flex-col lg:flex-row justify-center items-center lg:gap-24">
        <div className="h-full flex justify-center items-center">
          {width > 1024 ? (
            <div className="text-xl text-center text-white">
              จำนวนผลผลิต
              <br />
              แต่ละชนิดของกลุ่มวิสาหกิจ
              <br />
              ในปี {currentYear}
            </div>
          ) : (
            <div className="text-xl text-white text-center px-2 mb-2">
              จำนวนผลผลิตแต่ละชนิดของกลุ่มวิสาหกิจในปี {currentYear}
            </div>
          )}
        </div>
        <div className="h-full flex justify-center items-center p-2">
          <div className="w-[250px] ss:w-[350px] sm:w-[400px] md:w-[500px] lg:w-[800px]">
            {" "}
            {/* ความกว้างตามต้องการ */}
            {topYear.length > 0 ? (
              <Slider
                dots={false}
                infinite={true}
                speed={500}
                slidesToShow={5}
                slidesToScroll={1}
                autoplay={true}
                autoplaySpeed={2000}
                arrows={false}
                responsive={[
                  {
                    breakpoint: 1280,
                    settings: {
                      slidesToShow: 4,
                    },
                  },
                  {
                    breakpoint: 1024,
                    settings: {
                      slidesToShow: 3,
                    },
                  },
                  {
                    breakpoint: 600,
                    settings: {
                      slidesToShow: 2,
                    },
                  },
                  {
                    breakpoint: 480,
                    settings: {
                      slidesToShow: 1,
                    },
                  },
                ]}
              >
                {topYear.map((item, index) => (
                  <div key={index} className="px-2">
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src={API_BASE_URL + item.imageUrl}
                        alt=""
                        className="w-[120px] h-[130px] rounded-lg "
                      />
                      <div className="flex flex-col justify-center items-center">
                        <span className="text-sm sm:text-base text-white font-medium text-center">
                          {index + 1}. {item.name}
                        </span>
                        <span className="text-sm sm:text-base text-white font-medium">
                          {item.quantity} โล
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            ) : (
              <div className="text-center text-red-500">ไม่มีข้อมูล</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default MapPage;
