import React, { useState } from "react";

const TableComponent = ({ columns, data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const itemsPerPage = 5;

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(data.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleSort = (column) => {
    const newDirection = sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key: column.accessor, direction: newDirection });
  };

  return (
    <div className="relative overflow-x-auto">
      <table
        className="w-full text-sm text-left rtl:text-right text-gray-500"
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
                onClick={() => handleSort(col)}
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
                <td key={colIndex} className="px-6 py-4 ">
                  {col.Cell ? col.Cell({ row: item }) : item[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end p-2">
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
