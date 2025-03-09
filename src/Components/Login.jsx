import React, { useState } from "react";
import "./login.css";
import loginBg from "./Assets/login.jpg"; 
import { useNavigate } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">IntelLogixAI ♔</div>
      <nav className="nav-links">
        <a href="/">Home</a>
        <a href="/services">Service</a>
        <a href="/InvoiceGenerator">Portfolio</a>
        <a href="/contact">Contact Us</a>
      </nav>
    </header>
  );
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const validateLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          navigate("/home");
        }
      } else if (response.status === 404) {
        alert("Email does not exist.");
      } else if (response.status === 401) {
        alert("Incorrect password.");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("Error connecting to the server. Please try again later.");
    }
  };

  return (
    <div 
        className="login-home-container" 
        
    >
      <Header />
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={validateLogin}>
          <label className="label1" htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            className="input1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label className="label1"htmlFor="password">Password:</label>
          <input
          className="input1"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button  className="bu" type="submit">Login</button>
          <p>Don't have an account? <a href="/signup">Sign Up</a></p>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;