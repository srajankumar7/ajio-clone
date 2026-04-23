import React, { useState, useEffect } from "react";
import axios from "axios";

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const userId = localStorage.getItem("userId");
    
    useEffect(() => {
        if (!userId) return;
        axios.get(`https://ajio-clone-1v00.onrender.com/orders/${userId}`)
            .then((res) => setOrders(res.data))
            .catch ((err) => console.log(err));
}, [userId]);
    return (
        <div className="orders-container">
            <h2>My orders</h2>
            {orders.length === 0 ? (
                <p>No orders found</p>
            ) : (
                orders.map((order) => (
                    <div key={order._id}
                        className="order-card">
                        <p><b>Order ID:</b>{order._id}</p>
                        <p><b>Total:</b>{order.totalAmount}</p>
                        <p><b>Payment:</b>{order.paymentMethod}</p>
                        <h4>Items:</h4>
                        {order.items.map((item, i) => (
                            <div key={i} className="order-item">
                                <img src={item.image} alt="" width="60" />
                                <span>{item.name}</span>
                                <span>Rs.{item.price}*{item.quantity}</span>
                            </div>    
                        ))}
                    </div>      
                ))
            )}
        </div>
    );
}
export default MyOrders;