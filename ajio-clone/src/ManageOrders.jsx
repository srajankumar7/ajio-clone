import React, { useEffect, useState } from "react";
import axios from "axios";

function ManageOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/orders")
      .then((res) => setOrders(res.data))
      .catch(err => console.log(err));
  }, []);

  const updateStatus = (id, status) => {
    axios.put(`http://localhost:3001/order/${id}`, { status })
      .then((res) => {
        setOrders(orders.map(o => o._id === id ? res.data : o));
      });
  };

  return (
  <div className="admin-orders-container">
    <h2>Manage Orders</h2>

    {orders.map((order) => (
      <div key={order._id} className="order-card">

        <h4>Customer: {order.name}</h4>

        <p><strong>Mobile:</strong> {order.mobile}</p>
        <p><strong>City:</strong> {order.city}</p>
        <p><strong>Total:</strong> ₹{order.totalAmount}</p>
        <p><strong>Payment:</strong> {order.paymentMethod}</p>

        <p>
          <strong>Status:</strong>
          <span className={`status ${order.status}`}>
            {order.status}
          </span>
        </p>

        <div className="order-buttons">
          <button onClick={() => updateStatus(order._id, "Shipped")}>
            Shipped
          </button>

          <button onClick={() => updateStatus(order._id, "Delivered")}>
            Delivered
          </button>
        </div>

      </div>
    ))}
  </div>
);
}

export default ManageOrders;