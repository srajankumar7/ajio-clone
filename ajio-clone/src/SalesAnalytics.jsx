import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function SalesAnalytics() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("https://ajio-clone-1v00.onrender.com/orders")
      .then((res) => {
        const grouped = {};

        res.data.forEach(order => {
          if (!order.createdAt) return;

          const date = new Date(order.createdAt).toLocaleDateString();

          grouped[date] = (grouped[date] || 0) + order.totalAmount;
        });

        const result = Object.keys(grouped).map(date => ({
          date,
          sales: grouped[date]
        }));

        setData(result);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div style={{ width: "90%", margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>Sales Analysis</h2>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="sales" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SalesAnalytics;