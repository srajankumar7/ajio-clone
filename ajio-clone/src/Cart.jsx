import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { useNavigate } from "react-router-dom";

function Cart({ userId }) {
  const navigate = useNavigate();
  const [cartItems, setCart] = useState([]);
  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
  }
    axios.get(`https://ajio-clone-1v00.onrender.com/cart/${userId}`)
      .then((res) => setCart(res.data))
      .catch(err => console.log(err))
  }, [userId, navigate]);

  const handleDelete = (id) => {
    axios.delete(`https://ajio-clone-1v00.onrender.com/cart/${id}`)
      .then(() => {
        setCart(cartItems.filter(item => item._id !== id));

      });
  }
    
    const increaseQuantity = (item) => {
      axios.put(`https://ajio-clone-1v00.onrender.com/cart/${item._id}`, {
        quantity: item.quantity + 1
      })
        .then((res) => {
          setCart(cartItems.map(i => i._id === item._id ? res.data : i))
        });
    
    };
    const decreaseQuantity = (item) => {
      if (item.quantity == 1)
        return;
      axios.put(`https://ajio-clone-1v00.onrender.com/cart/${item._id}`, {
        quantity: item.quantity - 1,
      })
        .then((res) => {
          setCart(cartItems.map((i) => i._id === item._id ? res.data : i))
        });
    
    }
  const handleCheckout = () => {
    if (cartItems.length === 0)
    {
      alert("Cart is empty");
      return;
    }
    navigate("/checkout");
    }    


    return (
      <div className="cart-container">
        <h2 className="cart-title">My Cart</h2>

        {cartItems.length === 0 ? (
          <p>Cart Is Empty</p>
        ) : (
          cartItems.map((item, index) => (
            <div key={index} className="cart-item">

              <img
                src={`https://ajio-clone-1v00.onrender.com/images/${item.image}`}
                className="cart-img"
                alt={item.name}
              />

              <div>
                <h3>{item.name}</h3>
                <p>₹{item.price}</p>
                <button className="qty-btn" onClick={() => decreaseQuantity(item)}>-</button>
                <span className="qty-number">{item.quantity}</span>
                <button className="qty-btn" onClick={() => increaseQuantity(item)}>+</button>
                <button className="delete-btn" onClick={() =>
                  handleDelete(item._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
        <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
      </div>
    );
  }


export default Cart;