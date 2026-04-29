import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;
    axios
      .get(`https://ajio-clone-1v00.onrender.com/orders/${userId}`)
      .then((res) => setOrders(res.data))
      .catch((err) => console.log(err));
  }, [userId]);

  return (
    <div className="orders-container">
      <h2 className="orders-title">My Orders</h2>

      {orders.length === 0 ? (
        <p className="no-orders">No orders found</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">
            
            <div className="order-header">
              <div>
                <p className="order-id">Order ID: {order._id.slice(-6)}</p>
                <p className="order-date">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
                    
                </div>

            <div className="order-items">
              {order.items.map((item, i) => (
                <div key={i} className="order-item">
                  <img src={item.image} alt="" />
                  <div className="item-details">
                    <p className="item-name">{item.name}</p>
                    <p className="item-price">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <p><b>Total:</b> ₹{Number(order.totalAmount).toFixed(2)}</p>
              <p><b>Payment:</b> {order.paymentMethod.toUpperCase()}</p>
            </div>

          </div>
        ))
      )}
    </div>
  );
}

export default MyOrders;