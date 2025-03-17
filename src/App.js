import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Home from "./Components/Home"; 
import Hero from "./Components/Hero"; 
import Signup from "./Components/Signup";
import ContactUs from "./Components/ContactUs";
import Services from "./Components/Services";
import InvoiceGenerator from "./Components/InvoiceGenerator";
import ContactManager from "./Components/ContactManager";
import Dashboard from './Components/Dashboard';
import Quotation from './Components/Quotation';
import Chatbot from './Components/Chatbot';
import TopSaledProducts from './Components/TopSaledProducts';
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/ContactUs" element={<ContactUs />} />
      <Route path="/Services" element={<Services/>} />
      <Route path="/InvoiceGenerator" element={<InvoiceGenerator/>} />
      <Route path="/ContactManager" element={<ContactManager/>} />
      <Route path="/Quotation" element={<Quotation/>} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/Chatbot" element={<Chatbot />} />
      <Route path="/TopSaledProducts" element={<TopSaledProducts />} />
    </Routes>
  );
};

export default App;
