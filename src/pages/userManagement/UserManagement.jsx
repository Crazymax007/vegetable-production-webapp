import React from "react";

const UserManagement = () => {
  // เพิ่มข้อมูลตัวอย่าง
  const sampleData = [
    {
      firstName: "กัญญา",
      lastName: "หงษ์ทอง",
      nickname: "ญา",
      phone: "0874720346",
      location: {
        latitude: 9.086613,
        longitude: 99.222596,
      },
    },
    {
      firstName: "สมชาย",
      lastName: "ใจดี",
      nickname: "ชาย",
      phone: "0812345678",
      location: {
        latitude: 9.087123,
        longitude: 99.223456,
      },
    },
    {
      firstName: "วันดี",
      lastName: "มีสุข",
      nickname: "ดี",
      phone: "0898765432",
      location: {
        latitude: 9.085789,
        longitude: 99.221234,
      },
    },
    {
      firstName: "ประเสริฐ",
      lastName: "รักษ์ดี",
      nickname: "เสริฐ",
      phone: "0856789012",
      location: {
        latitude: 9.088901,
        longitude: 99.224567,
      },
    },
    {
      firstName: "นภา",
      lastName: "สว่างใจ",
      nickname: "ภา",
      phone: "0834567890",
      location: {
        latitude: 9.084567,
        longitude: 99.220123,
      },
    },
    {
      firstName: "สมหมาย",
      lastName: "ยิ้มสวย",
      nickname: "หมาย",
      phone: "0845678901",
      location: {
        latitude: 9.089012,
        longitude: 99.225678,
      },
    },
    {
      firstName: "รัตนา",
      lastName: "พรมมา",
      nickname: "ตุ๊ก",
      phone: "0867890123",
      location: {
        latitude: 9.083456,
        longitude: 99.219012,
      },
    },
    {
      firstName: "บุญมี",
      lastName: "ศรีสุข",
      nickname: "มี",
      phone: "0878901234",
      location: {
        latitude: 9.090123,
        longitude: 99.226789,
      },
    },
    {
      firstName: "สุดา",
      lastName: "แก้วใส",
      nickname: "ดา",
      phone: "0889012345",
      location: {
        latitude: 9.082345,
        longitude: 99.21789,
      },
    },
    {
      firstName: "มานะ",
      lastName: "ตั้งใจ",
      nickname: "นะ",
      phone: "0890123456",
      location: {
        latitude: 9.091234,
        longitude: 99.22789,
      },
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="overflow-x-auto">
        <div className="overflow-hidden rounded-lg">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-200">
                <th
                  scope="col"
                  className="px-6 py-4 font-bold text-gray-600 first:rounded-tl-lg w-[50px]"
                >
                  ลำดับ
                </th>
                <th scope="col" className="px-6 py-4 font-bold text-gray-600 w-[200px]">
                  ชื่อ-นามสกุล
                </th>
                <th scope="col" className="px-6 py-4 font-bold text-gray-600 w-[100px]">
                  ชื่อเล่น
                </th>
                <th scope="col" className="px-6 py-4 font-bold text-gray-600 w-[150px]">
                  เบอร์โทรศัพท์
                </th>
                <th scope="col" className="px-6 py-4 font-bold text-gray-600 w-[200px]">
                  พิกัด
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 font-bold text-gray-600 last:rounded-tr-lg text-center w-[100px]"
                >
                  จัดการข้อมูล
                </th>
              </tr>
            </thead>
            <tbody>
              {sampleData.map((item, index) => (
                <tr
                  key={item._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-600">{index + 1}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {`${item.firstName} ${item.lastName}`}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.nickname}</td>
                  <td className="px-6 py-4 text-gray-600">{item.phone}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {`${item.location.latitude}°N, ${item.location.longitude}°E`}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="bg-Green-button hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
                        แก้ไข
                      </button>
                      <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                        ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100">
        <span className="text-sm text-gray-600">
          Showing <span className="">1-10</span> of{" "}
          <span className="">1000</span>
        </span>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            Previous
          </button>
          <button className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
