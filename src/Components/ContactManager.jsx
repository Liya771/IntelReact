import React, { useState } from "react";
import "./ContactManager.css"; // Importing CSS
import loginBg from "./Assets/login.jpg";

const ContactManager = () => {
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    company: "",
    photo: null,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const addContact = () => {
    const { name, phone, email, address, company, photo } = formData;
    
    if (name && phone && email && address && company && photo) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newContact = {
          id: contacts.length + 1,
          name,
          phone,
          email,
          address,
          company,
          photo: e.target.result,
        };
        setContacts([newContact, ...contacts]);
      };
      reader.readAsDataURL(photo);

      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        company: "",
        photo: null,
      });

      document.getElementById("photo").value = ""; // Reset file input
    } else {
      alert("Please enter all contact details including a photo");
    }
  };

  return (
    <div className="contact-manager">
      <div id="contactList" className="contact-list">
        {contacts.map((contact) => (
          <div key={contact.id} className="contact-card">
            <img src={contact.photo} alt="Profile" />
            <strong>{contact.name}</strong>
            <p>📞 {contact.phone}</p>
            <p>✉️ {contact.email}</p>
            <p>🏠 {contact.address}</p>
            <p>🏢 {contact.company}</p>
          </div>
        ))}
      </div>

      <div className="con_container">
        <h2>Add Contact</h2>
        <input type="text" id="name" placeholder="Enter Name" value={formData.name} onChange={handleChange} />
        <input type="text" id="phone" placeholder="Enter Phone Number" value={formData.phone} onChange={handleChange} />
        <input type="email" id="email" placeholder="Enter Email" value={formData.email} onChange={handleChange} />
        <input type="text" id="address" placeholder="Enter Address" value={formData.address} onChange={handleChange} />
        <input type="text" id="company" placeholder="Enter Company Name" value={formData.company} onChange={handleChange} />
        <input type="file" id="photo" accept="image/*" onChange={handleFileChange} />
        <button onClick={addContact}>Add Contact</button>
      </div>
    </div>
  );
};

export default ContactManager;
