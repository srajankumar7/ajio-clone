import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

function Success() {

  const [params] = useSearchParams();
  const navigate = useNavigate();
  const called = useRef(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (called.current) return;
    called.current = true;

    const placeOrder = async () => {

      try {

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

        await axios.post(
          "https://ajio-clone-1v00.onrender.com/order",
          {
            userId,
            name,
            email,
            mobile,
            address,
            city,
            pincode,
            paymentMethod: "online"
          }
        );

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }
    };

    placeOrder();

  }, [navigate, params]);

  return (
    <div className="success-container">

      <div className="success-box">

        {loading ? (
          <>
            <h2>Processing Order...</h2>
            <p>Please wait while we confirm your payment.</p>
          </>
        ) : (
          <>
            <h2>Payment Successful ✅</h2>

            <p>Your order has been placed successfully.</p>

            <p>Invoice has been sent to your email.</p>

            <button
              className="success-btn"
              onClick={() => navigate("/")}
            >
              Go to Home
            </button>
          </>
        )}

      </div>

    </div>
  );
}

export default Success;