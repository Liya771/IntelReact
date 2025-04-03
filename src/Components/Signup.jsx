import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import "./Signup.css"; // Import the CSS file

const Signup = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Send OTP
  const sendOtp = async () => {
    if (!formData.email || !formData.full_name) {
      alert("Please enter your full name and email before sending OTP.");
      return;
    }

    try {
      const response = await fetch("http://52.22.49.178:5000/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, fullname: formData.full_name }),
      });
    

      if (response.ok) {
        alert("OTP sent to your email!");
        setOtpSent(true);
      } else {
        alert("Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      alert("An error occurred. Please try again.");
    }
  };

  // Handle signup form submission
  const handleSignup = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://52.22.49.178:5000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Account created successfully!");
        navigate("/login"); // Redirect to login page
      } else {
        alert("OTP verification failed.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("An error occurred during signup.");
    }
  };

  return (
    <div 
    className="signup-page" 
    
    >
      <Header /> {/* Include Header component */}
      <div className="signup-container">
        <form onSubmit={handleSignup} className="signup-form">
          <h2>Create an Account</h2>

          <label>Full Name:</label>
          <input type="text" name="full_name" placeholder="Enter your full name" required onChange={handleChange} />

          <label>Email:</label>
          <input type="email" name="email" placeholder="Enter your email address" required onChange={handleChange} />

          <label>Username:</label>
          <input type="text" name="username" placeholder="Choose a username" required onChange={handleChange} />

          <label>Password:</label>
          <input type="password" name="password" placeholder="Create a password" required onChange={handleChange} />

          <label>Confirm Password:</label>
          <input type="password" name="confirmPassword" placeholder="Re-enter your password" required onChange={handleChange} />

          {/* OTP Section */}
          {!otpSent ? (
            <button type="button" onClick={sendOtp}>Send OTP</button>
          ) : (
            <>
              <label>Enter OTP:</label>
              <input type="text" name="otp" placeholder="Enter OTP" required onChange={handleChange} />
              <button type="submit">Verify & Sign Up</button>
            </>
          )}

          <p>Already have an account? <a href="/Login">Log In</a></p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
