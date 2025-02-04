import React, { useState } from "react";

const TableComponent = () => {
  const data = [
    {
      name: 'Apple MacBook Pro 17"',
      color: "Silver",
      category: "Laptop",
      price: "$2999",
    },
    {
      name: "Microsoft Surface Pro",
      color: "White",
      category: "Laptop PC",
      price: "$1999",
    },
    {
      name: "Magic Mouse 2",
      color: "Black",
      category: "Accessories",
      price: "$99",
    },
    { name: "Dell XPS 13", color: "Gold", category: "Laptop", price: "$1399" },
    { name: "iPhone 12", color: "Blue", category: "Phone", price: "$799" },
    {
      name: "Samsung Galaxy S21",
      color: "Gray",
      category: "Phone",
      price: "$999",
    },
    {
      name: "Google Pixel 5",
      color: "Green",
      category: "Phone",
      price: "$699",
    },
    {
      name: "Sony WH-1000XM4",
      color: "Black",
      category: "Headphones",
      price: "$349",
    },
    {
      name: "Bose QuietComfort 35",
      color: "Silver",
      category: "Headphones",
      price: "$299",
    },
    {
      name: "Logitech MX Master 3",
      color: "Black",
      category: "Mouse",
      price: "$99",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // หาค่าช่วงของข้อมูลที่จะแสดงในแต่ละหน้า
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // เปลี่ยนหน้า
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // คำนวณจำนวนหน้าทั้งหมด
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(data.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Product name
            </th>
            <th scope="col" className="px-6 py-3">
              Color
            </th>
            <th scope="col" className="px-6 py-3">
              Category
            </th>
            <th scope="col" className="px-6 py-3">
              Price
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr
              key={index}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
            >
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {item.name}
              </td>
              <td className="px-6 py-4">{item.color}</td>
              <td className="px-6 py-4">{item.category}</td>
              <td className="px-6 py-4">{item.price}</td>
              <td className="px-6 py-4">
                <a
                  href="#"
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  Edit
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="flex justify-center mt-4">
        <nav className="inline-flex items-center">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-l-lg"
          >
            Previous
          </button>
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-4 py-2 text-sm font-medium ${
                currentPage === number
                  ? "bg-blue-600 text-white"
                  : "text-blue-600"
              } border`}
            >
              {number}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === pageNumbers.length}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-r-lg"
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  );
};

export default TableComponent;
