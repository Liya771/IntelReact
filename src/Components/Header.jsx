import React from "react";
import "./Hero.css";
import "./Signup.css";
import "./ContactUs";
import "./Services";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">IntelLogixAI ♔</div>
      <nav className="nav-links">
        <a href="/">Home</a>
        <a href="/Services">Service</a>
        <a href="#">Portfolio</a>
        <a href="/ContactUs">Contact Us</a>
      </nav>
    </header>
  );
};

export default Header;
