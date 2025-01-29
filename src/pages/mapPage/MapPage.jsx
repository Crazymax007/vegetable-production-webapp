import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const position = [13.736717, 100.523186]; // Bangkok, Thailand

const MapPage = () => {
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    return () => {
      const container = L.DomUtil.get("map");
      if (container != null) {
        container._leaflet_id = null;
      }
    };
  }, []);

  return (
    <div className="bg-gray-600 flex justify-center gap-6 mx-20">
      <div className="bg-red-400 rounded-3xl shadow-lg overflow-hidden w-[65%]">
        <MapContainer
          id="map"
          key={mapKey}
          center={position}
          zoom={13}
          style={{ height: "500px", width: "100%" }}
          scrollWheelZoom={true} // อนุญาตให้เลื่อนแผนที่ด้วยเมาส์
          dragging={true} // อนุญาตให้ลากแผนที่ได้
          doubleClickZoom={true} // อนุญาตให้ซูมแผนที่ด้วยการดับเบิลคลิก
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position} >
            <Popup>Bangkok, Thailand</Popup>
          </Marker>
        </MapContainer>
      </div>
      <div className="bg-blue-400 w-[35%] flex items-center justify-center p-4 rounded-3xl shadow-lg">
        <p className="text-white font-bold text-lg">ลูกสวน</p>
      </div>
    </div>
  );
};

export default MapPage;