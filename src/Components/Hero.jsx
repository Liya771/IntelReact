import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./Hero.css";
import HeroBg from "./Assets/home.webp";
import Header from "./Header"; // Import the Header component

const Hero = () => {
  const navigate = useNavigate(); // React Router hook for navigation

  return (
    <div>
      <Header /> {/* Include the Header at the top */}
      <div
        className="hero"
      >
        <div className="hero-text">
          <h1>Business Manager</h1>
          <h3>Secure and Modern Account Management</h3>
          <p>
            Reclaim control of your accounts with our intuitive, easy-to-use
            platform. Simplify your financial life today.
          </p>
          <div className="hero-buttons">
            <a href="#" className="learn-more">
              Learn More
            </a>
            <button onClick={() => navigate("/Signup")} className="sign-in">
              Sign Up
            </button>
          </div>
          <p>Explore our solutions tailored for your needs.</p>
        </div>

        <div className="hero-footer">
          <span>www.BManager.com</span>
          <div className="social-icons">
            <a href="#">
              <img src="/assets/fb.png" alt="Facebook" width="40" height="40" />
            </a>
            <a href="#">
              <img src="/assets/twitter.png" alt="Twitter" width="40" height="40" />
            </a>
            <a href="#">
              <img src="/assets/insta.png" alt="Instagram" width="40" height="40" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
