import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Checkout({ userId }) {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    if (!userId) {
      alert("Please login first");
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
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to load cart items.");
      });
  }, [userId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!userId) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    if (!name || !email || !mobile || !address || !city || !pincode) {
      setError("Please fill in all fields.");
      return;
    }

    const orderData = {
      userId,
      items: cartItems,
      totalAmount: total,
      name,
      email,
      mobile,
      address,
      city,
      pincode,
      paymentMethod,
    };

    setLoading(true);

    try {
      const response = await axios.post(
        "https://ajio-clone-1v00.onrender.com/order",
        orderData
      );

      if (paymentMethod === "online") {
        if (response.data?.url) {
          window.location.href = response.data.url;
        } else {
          setError("Payment URL not received. Please try again.");
        }
      } else {
        alert("Order placed successfully!");
        navigate("/my-orders");
      }
    } catch (err) {
      console.log(err.response?.data || err.message);
      setError(
        "Order failed: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      <h3>Order Summary</h3>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map((item) => (
          <div key={item._id} className="checkout-item">
            <span>{item.name}</span>
            <span>
              ₹{item.price} × Quantity: {item.quantity}
            </span>
          </div>
        ))
      )}
      <h3>Total: ₹{total}</h3>

      {error && (
        <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <textarea
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <input
          type="text"
          placeholder="Pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
        />

        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="cod">Cash On Delivery</option>
          <option value="online">Online Payment</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}

export default Checkout;