import React, { useState } from "react";
import SalesFilterBar from "./components/SalesFilterBar";
import SummaryCard from "./components/SummaryCard";
import SalesChart from "./components/SalesChart";
import { RiBarChartBoxLine } from "react-icons/ri";
import { CiShoppingTag } from "react-icons/ci";

const salesDataAPI = {
  summary: {
    revenue: 1342890,
    revenueChange: "+12.4%",
    purchases: 4321,
    purchaseChange: "-3.1%",
    periodLabel: "This Year",
  },

  filters: ["24 hours", "7 days", "30 days", "12 months"],
  dateR: {
    start: "2025-01-01",
    end: "2025-12-31",
  },
  chartData: [
    { label: "Monday", revenue: 14000, purchase: 13000 },
    { label: "Tuesday", revenue: 12000, purchase: 16000 },
    { label: "Wednesday", revenue: 22000, purchase: 5000 },
    { label: "Thursday", revenue: 6000, purchase: 15000 },
    { label: "Friday", revenue: 12000, purchase: 11000 },
    { label: "Saturday", revenue: 13000, purchase: 15000 },
    { label: "Sunday", revenue: 11000, purchase: 17000 },
  ],
};

const SalseAnalysis = () => {
  const [activeFilter, setFilter] = useState("7 days");
  const [dateRange, setDateRange] = useState(salesDataAPI.dateR);

  return (
    <div className="space-y-4 p-10">
      <h1 className="text-xl font-bold text-white">Sales Analysis</h1>

      <SalesFilterBar
        activeFilter={activeFilter}
        filters={salesDataAPI.filters}
        setFilter={setFilter}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <SummaryCard
          icon={<RiBarChartBoxLine className="text-lg" />}
          value={`$${salesDataAPI.summary.revenue.toLocaleString()}`}
          title="Today’s revenue"
          change="+8% from yesterday"
          bgColor="bg-amber-400"
          textColor="text-black"
          iconColor=""
        />
        <SummaryCard
          icon={<CiShoppingTag className="text-xl" />}
          value={salesDataAPI.summary.purchases.toLocaleString()}
          title="Today’s purchase"
          change="+10% from yesterday"
          bgColor="bg-violet-500"
          textColor="text-white"
        />
      </div>

      <SalesChart data={salesDataAPI.chartData} />
    </div>
  );
};

export default SalseAnalysis;
