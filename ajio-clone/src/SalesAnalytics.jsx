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

  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {

    axios.get("https://ajio-clone-1v00.onrender.com/users")
      .then(res => setUsers(res.data))
      .catch(err => console.log(err));

    axios.get("https://ajio-clone-1v00.onrender.com/products")
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));

    axios.get("https://ajio-clone-1v00.onrender.com/orders")
      .then((res) => {

        setOrders(res.data);

        const grouped = {};

        res.data.forEach((order) => {

          if (!order.createdAt) return;

          const date = new Date(order.createdAt).toLocaleDateString(
            "en-IN",
            {
              day: "2-digit",
              month: "short"
            }
          );

          grouped[date] =
            (grouped[date] || 0) + Number(order.totalAmount);
        });

        const result = Object.keys(grouped).map((date) => ({
          date,
          sales: Number(grouped[date].toFixed(2))
        }));

        result.sort((a, b) => new Date(a.date) - new Date(b.date));

        setData(result);
      })
      .catch(err => console.log(err));

  }, []);

  const totalRevenue = orders.reduce((sum, order) => {
    return sum + Number(order.totalAmount);
  }, 0);

  return (
    <div className="analytics-container">

      <h1 className="analytics-title">Sales Analytics</h1>

      <div className="analytics-grid">

        <div className="analytics-card">
          <h2>{users.length}</h2>
          <p>Total Users</p>
        </div>

        <div className="analytics-card">
          <h2>{products.length}</h2>
          <p>Total Products</p>
        </div>

        <div className="analytics-card">
          <h2>{orders.length}</h2>
          <p>Total Orders</p>
        </div>

        <div className="analytics-card">
          <h2>₹ {totalRevenue.toFixed(2)}</h2>
          <p>Total Revenue</p>
        </div>

      </div>

      <div className="chart-container">

        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
            <Bar dataKey="sales" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default SalesAnalytics;