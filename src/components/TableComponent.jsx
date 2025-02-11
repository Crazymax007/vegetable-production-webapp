import React, { useState } from "react";

const TableComponent = ({ columns, data, numPerPage }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const itemsPerPage = numPerPage; // แสดงทีละ 10 รายการ

  const sortedData = React.useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // ฟังก์ชันสร้างหมายเลขหน้าให้เปลี่ยนอัตโนมัติเมื่อถึงสุดขอบ
  const generatePagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 4; // จำนวนหมายเลขที่แสดงก่อนต้องเปลี่ยนชุด
    let startPage, endPage;

    if (totalPages <= maxVisiblePages) {
      // ถ้ามีหน้าน้อยกว่า maxVisiblePages ก็แสดงทั้งหมดเลย
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 3) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage + 2 >= totalPages) {
        startPage = totalPages - (maxVisiblePages - 1);
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }

    if (startPage > 1) pageNumbers.push(1);
    if (startPage > 2) pageNumbers.push("...");
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    if (endPage < totalPages - 1) pageNumbers.push("...");
    if (endPage < totalPages) pageNumbers.push(totalPages);

    return pageNumbers;
  };

  return (
    <div className="relative overflow-x-auto">
      <table
        className="w-full text-sm text-left text-gray-500"
        style={{ borderCollapse: "collapse", border: "1px solid #ddd" }}
      >
        <thead
          className="text-sm text-gray-700 uppercase bg-gray-300"
          style={{ borderBottom: "1px solid #ddd" }}
        >
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3"
                onClick={() =>
                  setSortConfig({
                    key: col.accessor,
                    direction: sortConfig.direction === "asc" ? "desc" : "asc",
                  })
                }
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr
              key={index}
              className="bg-white"
              style={{ borderBottom: "1px solid #ddd" }}
            >
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  {col.Cell ? col.Cell({ row: item }) : item[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-end p-2">
        <nav className="inline-flex items-center">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-l-lg"
          >
            Previous
          </button>

          {generatePagination().map((number, index) =>
            number === "..." ? (
              <span
                key={index}
                className="px-4 py-2 text-sm font-medium bg-white text-gray-500"
              >
                ...
              </span>
            ) : (
              <button
                key={index}
                onClick={() => paginate(number)}
                className={`px-4 py-2 text-sm font-medium ${
                  currentPage === number
                    ? "bg-blue-600 text-white"
                    : "bg-white"
                } border`}
              >
                {number}
              </button>
            )
          )}

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
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
