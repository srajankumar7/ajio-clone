import React, { useEffect, useRef } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

function Success() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const userId = params.get("userId");
    const name = params.get("name");
    const email = params.get("email");
    const mobile = params.get("mobile");
    const address = params.get("address");
    const city = params.get("city");
    const pincode = params.get("pincode");

    if (!userId) {
      navigate("/");
      return;
    }

    axios.post("https://ajio-clone-1v00.onrender.com/order", {
      userId,
      name,
      email,
      mobile,
      address,
      city,
      pincode,
      paymentMethod: "online"
    })
    .catch((err) => console.log(err));

  }, [navigate, params]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Payment Successful</h2>
      <p>Your order has been placed successfully.</p>
      <button onClick={() => navigate("/")}>
        Go to Home
      </button>
    </div>
  );
}

export default Success;