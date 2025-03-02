import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Home from "./Components/Home"; 
import Hero from "./Components/Hero"; 
import Signup from "./Components/Signup";
import ContactUs from "./Components/ContactUs";
import Services from "./Components/Services";


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/ContactUs" element={<ContactUs />} />
      <Route path="/Services" element={<Services/>} />
    </Routes>
  );
};

export default App;
