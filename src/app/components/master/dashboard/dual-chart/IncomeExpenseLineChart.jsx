"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function IncomeExpenseChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [options, setOptions] = useState({});

  useEffect(() => {
    fetch("/api/dashboard/monthly-income-expense")
      .then((res) => res.json())
      .then((res) => {
        const rows = Array.isArray(res.data) ? res.data : [];

        const labels = rows.map((item) => item.month);
        const incomeData = rows.map((item) => item.income);
        const expenseData = rows.map((item) => item.expense);

        setChartData({
          labels,
          datasets: [
            {
              label: "Pemasukan",
              data: incomeData,
              borderColor: "rgb(34,197,94)",
              backgroundColor: "rgba(34,197,94,0.2)",
              yAxisID: "y1",
              tension: 0.4,
            },
            {
              label: "Pengeluaran",
              data: expenseData,
              borderColor: "rgb(239,68,68)",
              backgroundColor: "rgba(239,68,68,0.2)",
              yAxisID: "y2",
              tension: 0.4,
            },
          ],
        });

        setOptions({
          responsive: true,
          interaction: {
            mode: "index",
            intersect: false,
          },
          stacked: false,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              mode: "index",
              intersect: false,
            },
          },
          scales: {
            y1: {
              type: "linear",
              display: true,
              position: "left",
              title: {
                display: true,
                text: "Pemasukan",
              },
            },
            y2: {
              type: "linear",
              display: true,
              position: "right",
              grid: {
                drawOnChartArea: false, // hilangkan garis dobel
              },
              title: {
                display: true,
                text: "Pengeluaran",
              },
            },
          },
        });
      });
  }, []);

  return (
    <div className="w-full h-[350px]">
      <Line data={chartData} options={options} />
    </div>
  );
}
