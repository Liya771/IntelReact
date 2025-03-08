import React, { useState, useEffect } from "react";
import "./ContactManager.css"; 
import loginBg from "./Assets/login.jpg";

const ContactManager = ({ invoiceData }) => {
  const [contacts, setContacts] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    company: "",
    department: "",
    photo: null,
  });

  useEffect(() => {
    if (invoiceData) {
      const newContact = {
        id: contacts.length + 1,
        name: invoiceData.name || "",
        email: invoiceData.email || "",
        address: invoiceData.address || "",
        phone: "",
        company: "",
        department: "",
        photo: null,
      };
      setContacts((prev) => [newContact, ...prev]);
    }
  }, [invoiceData]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const addContact = () => {
    const { name, phone, email, address, company, department, photo } = formData;

    if (name && email && address) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newContact = {
          id: contacts.length + 1,
          name,
          phone,
          email,
          address,
          company,
          department,
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
        department: "",
        photo: null,
      });

      document.getElementById("photo").value = "";
    } else {
      alert("Please enter at least name, email, and address");
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setFormData({ ...contacts[index] });
  };

  const saveEdit = () => {
    const updatedContacts = [...contacts];
    updatedContacts[editingIndex] = { ...formData };
    setContacts(updatedContacts);
    setEditingIndex(null);
    setFormData({
      name: "",
      phone: "",
      email: "",
      address: "",
      company: "",
      department: "",
      photo: null,
    });
  };

  return (
    <div className="contact-manager">
      <div id="contactList" className="contact-list">
        {contacts.map((contact, index) => (
          <div key={contact.id} className="contact-card">
            <img src={contact.photo || "https://via.placeholder.com/100"} alt="Profile" />
            <strong>{contact.name}</strong>
            <p>📞 {contact.phone || "Not added"}</p>
            <p>✉️ {contact.email}</p>
            <p>🏠 {contact.address}</p>
            <p>🏢 {contact.company || "Not added"}</p>
            <p>🛠 {contact.department || "Not added"}</p>
            <button onClick={() => handleEdit(index)}>Edit</button>
          </div>
        ))}
      </div>

      <div className="con_container">
        <h2>{editingIndex !== null ? "Edit Contact" : "Add Contact"}</h2>
        <input type="text" id="name" placeholder="Enter Name" value={formData.name} onChange={handleChange} />
        <input type="text" id="phone" placeholder="Enter Phone Number" value={formData.phone} onChange={handleChange} />
        <input type="email" id="email" placeholder="Enter Email" value={formData.email} onChange={handleChange} />
        <input type="text" id="address" placeholder="Enter Address" value={formData.address} onChange={handleChange} />
        <input type="text" id="company" placeholder="Enter Company Name" value={formData.company} onChange={handleChange} />
        <input type="text" id="department" placeholder="Enter Department" value={formData.department} onChange={handleChange} />
        <input type="file" id="photo" accept="image/*" onChange={handleFileChange} />
        {editingIndex !== null ? (
          <button onClick={saveEdit}>Save</button>
        ) : (
          <button onClick={addContact}>Add Contact</button>
        )}
      </div>
    </div>
  );
};

export default ContactManager;
