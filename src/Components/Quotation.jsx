import React, { useState } from "react";
import "./Quotation.css"; // Using the same CSS for consistency

const QuotationGenerator = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quotation, setQuotation] = useState({
    date: "",
    number: "",
    customerId: "",
    customerName: "",
    customerAddress: "",
    customerEmail: "",
    employeeName: "",
    employeeId: "",
    items: [{ id: 1, description: "", quantity: 1, unitPrice: 0, total: 0 }],
  });

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleChange = (e) => {
    setQuotation({ ...quotation, [e.target.id]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...quotation.items];
    updatedItems[index][field] = value;
    updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].unitPrice;
    setQuotation({ ...quotation, items: updatedItems });
  };

  const addItem = () => {
    setQuotation({
      ...quotation,
      items: [...quotation.items, { id: quotation.items.length + 1, description: "", quantity: 1, unitPrice: 0, total: 0 }],
    });
  };

  const removeItem = (index) => {
    const updatedItems = quotation.items.filter((_, i) => i !== index);
    setQuotation({ ...quotation, items: updatedItems });
  };

  const calculateTotal = () => {
    return quotation.items.reduce((acc, item) => acc + item.total, 0).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quotation),
      });
      const result = await response.json();
      console.log("Response from server:", result); // Debugging line
      alert(result.success ? "Quotation submitted successfully!" : "Failed to submit quotation");
    } catch (error) {
      console.error("Error submitting quotation:", error);
      alert("An error occurred while submitting the quotation.");
    }
  };
  
  return (
    <div className={`container ${sidebarOpen ? "sidebar-open" : ""}`}>
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

      <nav className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="logo">IntelLogixAI ♔</div>
        <a href="/home">Home</a>
        <a href="/Quotation">New Quotation</a>
        <a href="#">Contacts</a>
        <a href="#">Logout</a>
      </nav>

      <div className="card-body11">
        <h2>Quotation Generation</h2>
        <form onSubmit={handleSubmit}>
          <div className="f">
          <label className="form-control2">Date:</label></div>
          <input type="date" id="date" className="form-control1" value={quotation.date} onChange={handleChange} required />
          <div className="f"><label className="form-control2">Quotation Number:</label></div>
          <input type="text" id="number" className="form-control1" value={quotation.number} onChange={handleChange} required />

          <h5>Customer Information</h5>
          <div className="f"><label className="form-control2">Customer ID:</label></div>
          <input type="text" id="customerId" className="form-control1" placeholder="Customer ID" value={quotation.customerId} onChange={handleChange} required />
          <div className="f"><label className="form-control2">Customer Name:</label></div>
          <input type="text" id="customerName" className="form-control1" placeholder="Customer Name" value={quotation.customerName} onChange={handleChange} required />
          <div className="f"><label className="form-control2">Customer Address:</label></div>
          <textarea id="customerAddress" className="form-control1" placeholder="Customer Address" value={quotation.customerAddress} onChange={handleChange} required />
          <div className="f"><label className="form-control2">Customer Email:</label></div>
          <input type="email" id="customerEmail" className="form-control1" placeholder="Customer Email" value={quotation.customerEmail} onChange={handleChange} required />

          <h5>Employee Details</h5>
          <div className="f"><label className="form-control2">Employee Name:</label></div>
          <input type="text" id="employeeName" className="form-control1" placeholder="Employee Name" value={quotation.employeeName} onChange={handleChange} required />
          <div className="f"><label className="form-control2">Employee ID:</label></div>
          <input type="text" id="employeeId" className="form-control1" placeholder="Employee ID" value={quotation.employeeId} onChange={handleChange} required />

          <h4>Quotation Items</h4>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {quotation.items.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td><input type="text" className="form-control1" value={item.description} onChange={(e) => handleItemChange(index, "description", e.target.value)} required /></td>
                  <td><input type="number" className="form-control1" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value))} min="1" required /></td>
                  <td><input type="number" className="form-control1" value={item.unitPrice} onChange={(e) => handleItemChange(index, "unitPrice", parseFloat(e.target.value))} step="0.01" required /></td>
                  <td>{item.total.toFixed(2)}</td>
                  <td><button type="button" className="btn btn-danger" onClick={() => removeItem(index)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className="btn btn-primary" onClick={addItem}>Add Item</button>
          <div className="invoice-totals">
            <p><strong>Total:</strong> ${calculateTotal()}</p>
          </div>
          <button type="submit" className="btn btn-success">Generate Quotation</button>
        </form>
      </div>
    </div>
  );
};

export default QuotationGenerator;