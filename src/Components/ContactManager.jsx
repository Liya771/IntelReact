import React, { useState, useEffect } from "react";
import "./ContactManager.css";

const ContactManager = () => {
    const [contacts, setContacts] = useState([]);

    const [newContact, setNewContact] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        company: "",
        photo: null,
    });

    // ✅ Load contacts from localStorage on page load
    useEffect(() => {
        const savedContacts = localStorage.getItem("contacts");
        if (savedContacts) {
            setContacts(JSON.parse(savedContacts));
        }
    }, []);

    // ✅ Save contacts to localStorage whenever contacts change
    useEffect(() => {
        localStorage.setItem("contacts", JSON.stringify(contacts));
    }, [contacts]);

    // ✅ Handle Input Change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewContact({ ...newContact, [name]: value });
    };

    // ✅ Handle Photo Upload
    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setNewContact({ ...newContact, photo: event.target.result });
            };
            reader.readAsDataURL(file);
        }
    };

    // ✅ Add Contact
    const addContact = (e) => {
        e.preventDefault();
        if (
            newContact.name &&
            newContact.phone &&
            newContact.email &&
            newContact.address &&
            newContact.company &&
            newContact.photo
        ) {
            const updatedContacts = [newContact, ...contacts];
            setContacts(updatedContacts); // Update contacts state
            setNewContact({
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
        <div className="contact-page">
            <div id="contactList" className="contact-list">
                {contacts.length > 0 ? (
                    contacts.map((contact, index) => (
                        <div key={index} className="contact-card">
                            <img src={contact.photo} alt="Profile" />
                            <strong>{contact.name}</strong>
                            <p>📞 {contact.phone}</p>
                            <p>📧 {contact.email}</p>
                            <p>🏠 {contact.address}</p>
                            <p>🏢 {contact.company}</p>
                        </div>
                    ))
                ) : (
                    <p>No contacts available</p>
                )}
            </div>

            <div className="h_container">
                <h2>Add Contact</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="Enter Name"
                    value={newContact.name}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="phone"
                    placeholder="Enter Phone Number"
                    value={newContact.phone}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    value={newContact.email}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="address"
                    placeholder="Enter Address"
                    value={newContact.address}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="company"
                    placeholder="Enter Company Name"
                    value={newContact.company}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="file"
                    id="photo"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    required
                />
                <button onClick={addContact}>Add Contact</button>
            </div>
        </div>
    );
};

export default ContactManager;
