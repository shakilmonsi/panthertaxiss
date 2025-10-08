import { useState, useEffect } from "react";
import { FaEllipsisH, FaEye } from "react-icons/fa";

export const RecordsCard = ({ checks, getStatusBadge }) => {
  const [page, setPage] = useState(1);
  const [paginatedData, setPaginatedData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedData(checks.slice(startIndex, endIndex));
  }, [page, checks]);

  const totalPages = Math.ceil(checks.length / itemsPerPage);

  // modal open function
  const handleView = (row) => {
    setSelectedRow(row);
    setShowModal(true);
  };

  return (
    <div>
      <div className="scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400 relative overflow-x-scroll shadow-md sm:rounded-lg">
        <style>{`
          .overflow-x-scroll {
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 #f1f5f9;
          }
          .overflow-x-scroll::-webkit-scrollbar {
            height: 8px;
          }
          .overflow-x-scroll::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 4px;
          }
          .overflow-x-scroll::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
          }
          .overflow-x-scroll::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        `}</style>

        {/* Desktop Table */}
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="p-3 text-left text-sm font-semibold text-gray-800 sm:text-base">
                Check ID
              </th>
              <th className="p-3 text-left text-sm font-semibold text-gray-800 sm:text-base">
                User
              </th>
              <th className="p-3 text-left text-sm font-semibold text-gray-800 sm:text-base">
                Date & Time
              </th>
              <th className="p-3 text-left text-sm font-semibold text-gray-800 sm:text-base">
                Vehicle Reg.
              </th>
              <th className="p-3 text-left text-sm font-semibold text-gray-800 sm:text-base">
                Status
              </th>
              <th className="p-3 text-left text-sm font-semibold text-gray-800 sm:text-base">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-100 transition-colors duration-200 hover:bg-gray-50"
              >
                <td className="p-3 text-sm text-gray-700 sm:text-base">
                  {row.id?.substring(0, 8) || "N/A"}
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-blue-100">
                      {row?.profile_pic ? (
                        <img
                          src={row.profile_pic}
                          alt="profile"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-medium text-blue-600">
                          {row?.completedBy?.name?.charAt(0) || "U"}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-700 sm:text-base">
                      {row.completedBy?.name || "N/A"}
                    </span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-700 sm:text-base">
                      {row.date
                        ? new Date(row.date).toLocaleDateString()
                        : "N/A"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {row.date
                        ? new Date(row.date).toLocaleTimeString()
                        : "N/A"}
                    </span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-700 sm:text-base">
                      {row.vehicleRegNo || "N/A"}
                    </span>
                    {/* <span className="text-xs text-gray-500">
                      {row.plateNo || "N/A"}
                    </span> */}
                  </div>
                </td>
                <td className="p-3">{getStatusBadge(row)}</td>
                <td className="p-3">
                  <div className="flex items-center gap-4">
                    <FaEye
                      onClick={() => handleView(row)}
                      className="h-5 w-5 cursor-pointer text-gray-600 transition-colors duration-200 hover:text-blue-600"
                    />
                    <FaEllipsisH className="h-4 w-4 cursor-pointer text-gray-600 transition-colors duration-200 hover:text-gray-800" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-center gap-3">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            page === 1
              ? "cursor-not-allowed bg-gray-100 text-gray-400"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Previous
        </button>

        <span className="flex items-center text-sm font-medium text-gray-600">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            page === totalPages
              ? "cursor-not-allowed bg-gray-100 text-gray-400"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {showModal && selectedRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 text-black shadow-lg">
            <h2 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">
              Check Details
            </h2>
            <div className="space-y-3 border-b pb-3 text-sm text-gray-700">
              <p className="border-b pb-2 text-gray-700">
                <span className="font-medium">Check ID:</span>{" "}
                {selectedRow.id || "N/A"}
              </p>
              <p className="border-b pb-3 text-gray-700">
                <span className="font-medium">User:</span>{" "}
                {selectedRow.completedBy?.name || "N/A"}
              </p>
              <p className="border-b pb-3 text-gray-700">
                <span className="font-medium">Date:</span>{" "}
                {selectedRow.date
                  ? new Date(selectedRow.date).toLocaleDateString()
                  : "N/A"}{" "}
                {selectedRow.date
                  ? new Date(selectedRow.date).toLocaleTimeString()
                  : ""}
              </p>
              <p className="border-b pb-3 text-gray-700">
                <span className="font-medium">Vehicle Reg:</span>{" "}
                {selectedRow.vehicleRegNo || "N/A"}
              </p>
              {/* <p className="border-b pb-3 text-gray-700">
                <span className="font-medium">Plate No:</span>{" "}
                {selectedRow.plateNo || "N/A"}
              </p> */}
              <p>
                <span className="font-medium">Status:</span>{" "}
                {getStatusBadge(selectedRow)}
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
