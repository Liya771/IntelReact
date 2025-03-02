import React, { useState } from "react";
import "./Home.css";
import loginBg from "./Assets/login.jpg"; 

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSearch = () => {
    const pages = {
      home: "/home",
      service: "/service",
      portfolio: "/portfolio",
      "contact us": "/contact",
      invoice: "/invoice",
      contact: "/newcontact",
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
    <div className="home-container"
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
      {/* Header */}
      <header>
        <div className="logo">IntelLogixAI ♔</div>
        <nav className="nav-links">
          <a href="/home">Home</a>
          <a href="/services">Service</a>
          <a href="#">Portfolio</a>
          <a href="/contact">Contact Us</a>
        </nav>
        <button className="toggle-btn" onClick={toggleSidebar}>
          &#9776;
        </button>
      </header>

      {/* Sidebar */}
      <nav className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="logo">IntelLogixAI ♔</div>
        <a href="/home">Home</a>
        <a href="/invoice">New Invoice</a>
        <a href="/newcontact">Contacts</a>
        <a href="#">Logout</a>
      </nav>

      {/* Content */}
      <div className={`content ${sidebarOpen ? "shift" : ""}`}>
        <h1>Welcome to IntelLogixAI</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
