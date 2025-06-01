import React, { useState } from "react";
import "./index.css";

const Login = () => {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("jobseeker");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    companyLinkedIn: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = mode === "login" ? "login" : "register";
    const url = `https://job-backend-fdm2.onrender.com/api/auth/${endpoint}`;

    const payload =
      mode === "register"
        ? {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role,
            username: formData.email.split("@")[0],
            number: "0000000000", // placeholder
          }
        : {
            email: formData.email,
            password: formData.password,
          };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error occurred");
        return;
      }

      localStorage.setItem("userId", data.userId);
      alert(`${mode === "login" ? "Logged in" : "Registered"} successfully`);
      window.location.href = "/profile";
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong");
    }
  };

  const isRegister = mode === "register";
  const isEmployer = role === "employer";

  return (
    <div className="auth-form-container">
      <h2>{mode === "login" ? "Login" : "Register"}</h2>

      <div className="dropdowns">
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="login">Login</option>
          <option value="register">Register</option>
        </select>

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="jobseeker">Jobseeker</option>
          <option value="employer">Employer</option>
        </select>
      </div>

      <form onSubmit={handleSubmit}>
        {isRegister && (
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {isRegister && isEmployer && (
          <>
            <input
              type="text"
              placeholder="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
            <input
              type="url"
              placeholder="Company LinkedIn URL"
              name="companyLinkedIn"
              value={formData.companyLinkedIn}
              onChange={handleChange}
              required
            />
          </>
        )}

        <button type="submit">{mode === "login" ? "Login" : "Register"}</button>
      </form>
    </div>
  );
};

export default Login;
