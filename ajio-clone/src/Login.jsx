import React from "react";
import "./App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login({ setUserRole, setUserId }) {
  const [mobile, setMobile] = React.useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post("https://ajio-clone-1v00.onrender.com/signin", { mobile })
      .then((res) => {

        localStorage.setItem("role", res.data.role);
        if (res.data._id) {
          localStorage.setItem("userId", res.data._id);
        }

        setUserId(res.data._id);
        setUserRole(res.data.role);

        if (res.data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }

      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="login-body">
      <div className="container">
        <h1>Welcome to Ajio</h1>
        <p>Enter Mobile Number *</p>
        <input
          type="tel"
          placeholder="Enter mobile number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
        <button onClick={handleSubmit}>Signin</button>
      </div>
    </div>
  );
}

export default Login;