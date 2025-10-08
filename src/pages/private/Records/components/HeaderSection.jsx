import toast from "react-hot-toast";
import { BiRefresh } from "react-icons/bi";
import { FaDownload } from "react-icons/fa";

export const HeaderSection = ({
  user,
  handleRefresh,
  loading,
  checks = { checks },
}) => {
  
  const handleExportCSV = () => {
    if (checks.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = "ID,User,Date,Time,VehicleReg,Status,PlateNo,BadgeNo\n";
    const csvContent = checks
      .map((row) => {
        const checkId = row.id?.substring(0, 8) || "N/A";
        const userName = row.completedBy?.name || "N/A";
        const date = row.date ? new Date(row.date).toLocaleDateString() : "N/A";
        const time = row.date ? new Date(row.date).toLocaleTimeString() : "N/A";
        const vehicleReg = row.vehicleRegNo || "";
        const status = row.status || "";
        const plateNo = row.plateNo || "";
        const badgeNo = row.badgeNo || "";

        return `"${checkId}","${userName}","${date}","${time}","${vehicleReg}","${status}","${plateNo}","${badgeNo}"`;
      })
      .join("\n");

    const blob = new Blob([headers + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `daily_checks_records_${new Date().getTime()}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("CSV exported successfully");
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-1 sm:space-y-2">
        <h1 className="font-[700] text-gray-900 text-xl md:text-[26px] lg:text-[32px]">
          Daily Check Records
        </h1>
        <p className="text-sm text-gray-600 sm:text-sm md:text-lg">
          {user?.name || "Guest"} - {user?.role || "User"}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg border border-blue-600 px-4 py-2.5 text-blue-600 transition-all duration-200 hover:border-blue-700 hover:bg-blue-50 focus:ring-2 focus:ring-blue-200 focus:outline-none disabled:opacity-50 sm:px-5 sm:py-3 lg:min-w-40"
        >
          <BiRefresh
            className={`h-4 w-4 sm:h-5 sm:w-5 ${loading ? "animate-spin" : ""}`}
          />
          <span className="text-sm font-[600] sm:text-base">
            {loading ? "Loading..." : "Refresh"}
          </span>
        </button>
        <button
          onClick={handleExportCSV}
          disabled={checks.length === 0}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-white transition-all duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-200 focus:outline-none disabled:opacity-50 sm:px-5 sm:py-3 lg:min-w-40"
        >
          <FaDownload className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="text-sm font-[600] sm:text-base">Export CSV</span>
        </button>
      </div>
    </div>
  );
};
