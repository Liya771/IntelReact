import React, { useEffect, useState } from "react";
import "./ContactManager.css";

const ContactManager = () => {
    const [contacts, setContacts] = useState([]);
    const [editingContact, setEditingContact] = useState(null);
    const [updatedDetails, setUpdatedDetails] = useState({});

    // Fetch contacts from the database
    const fetchContacts = () => {
      console.log("Fetching contacts..."); // ✅ Check if this runs
      fetch("http://localhost:5000/get-contacts")
          .then(response => response.json())
          .then(data => {
              console.log("Updated contacts:", data); // ✅ Check received data
              setContacts([...data]); // 🔄 Ensure re-render
          })
          .catch(error => console.error("Error fetching contacts:", error));
  };

    useEffect(() => {
        fetchContacts(); // Fetch contacts on component mount
    }, []);

    // Handle edit button click
    const handleEditClick = (contact) => {
        setEditingContact(contact.id);
        setUpdatedDetails(contact); // Pre-fill form with existing details
    };

    // Handle input changes
    const handleInputChange = (e) => {
        setUpdatedDetails({ ...updatedDetails, [e.target.name]: e.target.value });
    };

    // Save edited contact details
    const handleSave = () => {
        fetch(`http://localhost:5000/update-contact/${editingContact}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedDetails),
        })
        .then(response => response.json())
        .then(() => {
            fetchContacts(); // Refresh contacts list
            setEditingContact(null); // Exit edit mode
        })
        .catch(error => console.error("Error updating contact:", error));
    };

    return (
        <div className="contact-container">
            <h2 className="title">📇 Contact Manager</h2>
            <table className="contact-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Company</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.length > 0 ? (
                        contacts.map(contact => (
                            <tr key={contact.id}>
                                {editingContact === contact.id ? (
                                    <>
                                        <td>{contact.name}</td>
                                        <td>
                                            <input type="text" name="phone" value={updatedDetails.phone} onChange={handleInputChange} />
                                        </td>
                                        <td>{contact.email || "N/A"}</td>
                                        <td>
                                            <input type="text" name="department" value={updatedDetails.department || ""} onChange={handleInputChange} />
                                        </td>
                                        <td>
                                            <input type="text" name="company" value={updatedDetails.company || ""} onChange={handleInputChange} />
                                        </td>
                                        <td>
                                            <button onClick={handleSave} className="save-btn">Save</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{contact.name}</td>
                                        <td>{contact.phone}</td>
                                        <td>{contact.email || "N/A"}</td>
                                        <td>{contact.department || "N/A"}</td>
                                        <td>{contact.company || "N/A"}</td>
                                        <td>
                                            <button onClick={() => handleEditClick(contact)} className="edit-btn">Edit</button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="no-data">No contacts available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ContactManager;
