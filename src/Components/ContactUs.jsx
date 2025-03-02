import React, { useState } from "react";
import "./ContactUs.css";
import loginBg from "./Assets/login.jpg"; 
import Header from "./Header"; // Importing Header component

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you, ${formData.name}! Your message has been sent.`);
    setFormData({ name: "", email: "", message: "" }); // Reset form
  };

  return (
    <div>
      <Header /> {/* Header added here */}

      <div className="contact-container"
       style={{ 
        backgroundImage: `url(${loginBg})`, 
        backgroundSize: "cover", 
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    }}
      >
        <h1 style = {{ color : "white "}}>Contact Us</h1>
        <div className="contact-info">
          <p style = {{ color : "white "}}><strong>Email:</strong> support@intellogixai.com</p>
          <p style = {{ color : "white "}}><strong>Phone:</strong> +91 86065777577</p>
          <p style = {{ color : "white "}}><strong>Address:</strong> Thrissur, Kerala, India</p>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="name" 
            placeholder="Your Name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Your Email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
          <textarea 
            name="message" 
            rows="4" 
            placeholder="Your Message" 
            value={formData.message} 
            onChange={handleChange} 
            required 
          />
          <button type="submit">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
