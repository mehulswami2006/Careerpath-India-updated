"use client";

import { PieChart, Pie, Tooltip, Cell } from "recharts";

export default function DashboardStats() {

  const data = [
    { name: "Technology", value: 40 },
    { name: "Science", value: 25 },
    { name: "Arts", value: 15 },
    { name: "Business", value: 20 }
  ];

  const colors = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444"];

  return (
    <div className="bg-white p-6 shadow rounded">

      <h2 className="text-xl font-bold mb-4">
        Career Interest Distribution
      </h2>

      <PieChart width={300} height={300}>
        <Pie
          data={data}
          dataKey="value"
          outerRadius={100}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={colors[index]} />
          ))}
        </Pie>

        <Tooltip />

      </PieChart>

    </div>
  );
}
