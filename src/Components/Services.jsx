import React from "react";
import "./Services.css";
import loginBg from "./Assets/login.jpg"; 
import Header from "./Header"; // Import Header component

const Services = () => {
  const services = [
    {
      title: "AI-Powered Logistics",
      description: "Optimize your supply chain with cutting-edge AI technology.",
    },
    {
      title: "Smart Invoicing",
      description: "Automate and streamline your invoicing process for better efficiency.",
    },
    {
      title: "Real-Time Tracking",
      description: "Monitor your shipments with precision and real-time updates.",
    },
    {
      title: "Data Analytics",
      description: "Gain insights from your logistics data with advanced analytics.",
    },
  ];

  return (
    <div>
      <Header /> {/* Navigation bar */}

      <div className="services-container"
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
        <h1 style = {{ color : "white "}}>Our Services</h1>
        <div className="services-list">
          {services.map((service, index) => (
            <div className="service-card" key={index}>
              <h2>{service.title}</h2>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>

      <footer>
        &copy; 2025 IntelLogixAI - All Rights Reserved
      </footer>
    </div>
  );
};

export default Services;
