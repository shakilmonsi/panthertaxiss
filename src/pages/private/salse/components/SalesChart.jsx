import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

import { FaCircle } from "react-icons/fa";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
);

const SalesChart = ({ data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Custom manual legend
      },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#ccc",
          callback: (value) => value / 1000 + "k",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
      x: {
        ticks: { color: "#e5e7eb" },
        grid: { display: false },
      },
    },
  };

  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: "Total revenue",
        data: data.map((d) => d.revenue),
        backgroundColor: "#facc15", // Yellow
        barThickness: 20,
      },
      {
        label: "Total purchase",
        data: data.map((d) => d.purchase),
        backgroundColor: "#8b5cf6", // Purple
        barThickness: 20,
      },
    ],
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#2e0c4f65] to-[#3f0c5854] p-6 shadow-md">
      <h3 className="mb-4 text-lg font-semibold text-white">Sales Statistic</h3>
      <div className="h-64">
        <Bar options={options} data={chartData} />
      </div>
      {/* Custom Legend */}
      <div className="mt-4 flex items-center justify-center gap-8 text-sm text-gray-300">
        <div className="flex items-center gap-2">
          <FaCircle className="text-xs text-yellow-400" />
          Total revenue
        </div>
        <div className="flex items-center gap-2">
          <FaCircle className="text-xs text-purple-500" />
          Total purchase
        </div>
      </div>
    </div>
  );
};

export default SalesChart;
