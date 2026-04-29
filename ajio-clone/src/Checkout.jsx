import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Checkout({ userId }) {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    axios
      .get(`https://ajio-clone-1v00.onrender.com/cart/${userId}`)
      .then((res) => {
        setCartItems(res.data);
        const totalAmount = res.data.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        setTotal(totalAmount);
      });
  }, [userId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) return;

    setLoading(true); 

    try {
      await axios.post("https://ajio-clone-1v00.onrender.com/order", {
        userId,
        items: cartItems,
        totalAmount: total,
        name,
        email,
        mobile,
        address,
        city,
        pincode,
        paymentMethod
      });

      setLoading(false);
      setShowPopup(true);

      setTimeout(() => {
        navigate("/my-orders");
      }, 1500);

    } catch (err) {
      setLoading(false);
      console.log(err);
      alert("Order failed");
    }
  };

  return (
    <div className="checkout-container">

      {loading && <div className="loader">Placing Order...</div>}

      {showPopup && (
        <div className="popup">
          <div className="popup-box">
            <h3> Order Placed Successfully</h3>
          </div>
        </div>
      )}

      <h2>Checkout</h2>

      <h3>Order summary</h3>
      {cartItems.map((item) => (
        <div key={item._id} className="checkout-item">
          <span>{item.name}</span>
          <span>₹{item.price} * {item.quantity}</span>
        </div>
      ))}

      <h3>Total: ₹{total}</h3>

      <form onSubmit={handleSubmit}>
        <input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <textarea placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
        <input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
        <input placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} />

        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="cod">Cash On Delivery</option>
          <option value="online">Online Payment</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Placing..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}

export default Checkout;