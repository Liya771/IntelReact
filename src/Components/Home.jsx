import React, { useState } from "react";
import "./Home.css";
import ForecastChart from "./ForecastChart"; // Import the ForecastChart component

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Toggle Sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle Search Navigation
  const handleSearch = () => {
    const pages = {
      home: "/home",
      service: "/service",
      portfolio: "/portfolio",
      contactus: "/ContactUs",
      invoice: "/InvoiceGenerator",
      contact: "/ContactManager",
      quotation: "/Quotation",
      topsales: "/TopSaledProducts",
      chatbot: "/Chatbot",
      logout: "/Dashboard",
    };

    if (pages[searchQuery.toLowerCase().trim()]) {
      window.location.href = pages[searchQuery.toLowerCase().trim()];
    } else {
      alert(
        "Page not found! Try searching for: Home, Service, Portfolio, Contact Us, or Invoice."
      );
    }
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header>
        <div className="logo">IntelLogixAI ♔</div>
        <nav className="nav-links">
          <a href="/home">Home</a>
          <a href="/services">Service</a>
          <a href="#">Portfolio</a>
          <a href="/ContactUs">Contact Us</a>
        </nav>
        <button className="toggle-btn" onClick={toggleSidebar}>
          &#9776;
        </button>
      </header>

      {/* Sidebar */}
      <nav className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="logo">IntelLogixAI ♔</div>
        <a href="/home">Home</a>
        <a href="/InvoiceGenerator">New Invoice</a>
        <a href="/Quotation">Quotation</a>
        <a href="/ContactManager">Contacts</a>
        <a href="/TopSaledProducts">Top Sales</a>
        <a href="/Chatbot">ChatBot</a>
        <a href="/Dashboard">Logout</a>
      </nav>

      {/* Main Content */}
      <div className={`content ${sidebarOpen ? "shift" : ""}`}>
        <h1>Welcome to IntelLogixAI</h1>
        
        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        {/* Revenue Forecast Chart */}
        <div className="chart-container">
          <h2>📊 Revenue Forecast Chart</h2>
          <ForecastChart />
        </div>

        
      </div>
    </div>
  );
};

export default Home;