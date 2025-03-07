import React, { useState } from "react";
import "./InvoiceGenerator.css"; // Importing CSS

const InvoiceGenerator = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [invoice, setInvoice] = useState({
    invoiceDate: "",
    invoiceNumber: "",
    customerName: "",
    customerAddress: "",
    customerEmail: "",
    taxPercentage: 0,
    items: [{ id: 1, description: "", quantity: 1, unitPrice: 0, total: 0, taxPercentages: 0 }],
  });

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleChange = (e) => {
    setInvoice({ ...invoice, [e.target.id]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    
    const updatedItems = [...invoice.items];
    updatedItems[index][field] = value;
    updatedItems[index].total =
      updatedItems[index].quantity * updatedItems[index].unitPrice;
    setInvoice({ ...invoice, items: updatedItems });
  };

  const addItem = () => {
    setInvoice({
      ...invoice,
      items: [
        ...invoice.items,
        { id: invoice.items.length + 1, description: "", quantity: 1, unitPrice: 0, total: 0 },
      ],
    });
  };

  const removeItem = (index) => {
    const updatedItems = invoice.items.filter((_, i) => i !== index);
    setInvoice({ ...invoice, items: updatedItems });
  };

  const calculateTotals = () => {
    const subtotal = invoice.items.reduce((acc, item) => acc + item.total, 0);
    const tax = (subtotal * invoice.taxPercentage) / 100;
    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: (subtotal + tax).toFixed(2),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totals = calculateTotals();
    const invoiceData = { ...invoice, ...totals };

    try {
      const response = await fetch("http://localhost:5000/add-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoiceData),
      });
      const result = await response.json();
      alert(result.success ? "Invoice submitted successfully!" : "Failed to submit invoice");
    } catch (error) {
      console.error("Error submitting invoice:", error);
      alert("An error occurred while submitting the invoice.");
    }
  };

  const { subtotal, tax, total } = calculateTotals();

  return (
    <div className={`container ${sidebarOpen ? "sidebar-open" : ""}`}>
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
        <a href="/InvoiceGenerator">New Invoice</a>
        <a href="#">Contacts</a>
        <a href="#">Logout</a>
      </nav>

      {/*!-- Company Information --*/}
      <div class="card mb-4">
      <div class="card-body">
        <h5>Company Information</h5>
        <p><strong>IntelLogixAi Pvt. Ltd.</strong></p>
        <p>Block A, 3rd Floor, Silicon Business Park, Outer Ring Road, Marathahalli, Bengaluru, Karnataka, 560103, India.</p>
        <p><strong>Phone:</strong> +91-9876543210</p>
      </div>
    </div>

      {/* Invoice Form */}

      <div className="invoice-container">
        <h2>Invoice Generation</h2>
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-6">
              <label>Invoice Date</label>
              <input type="date" id="invoiceDate" value={invoice.invoiceDate} onChange={handleChange} required />
            </div>

            <div className="col-md-6">
              <label>Invoice Number</label>
              <input type="text" id="invoiceNumber" value={invoice.invoiceNumber} onChange={handleChange} required />
            </div>
          </div>


        <div className="mb-4">
        <h5 style={{ color: "#000000" }}>Customer Information</h5>
        <div className="row">
          <div className="col-md-6">
            <label>Customer Name</label>
            <input type="text" id="customerName" value={invoice.customerName} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label>Customer Address</label>
            <textarea id="customerAddress" value={invoice.customerAddress} onChange={handleChange} required />
          </div>
          </div>
        </div>



          <div className="mb-4">
            <label>Customer Email</label>
            <input type="email" id="customerEmail" value={invoice.customerEmail} onChange={handleChange} required />
          </div>



          <div className="mb-4">
            <label>Tax Rate (%)</label>
            <input type="number" id="taxPercentage" value={invoice.taxPercentage} onChange={handleChange} min="0" step="0.1" required />
          </div>

          <h4>Invoice Items</h4>
          <table>
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
              {invoice.items.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>
                    <input type="text" value={item.description} onChange={(e) => handleItemChange(index, "description", e.target.value)} required />
                  </td>
                  <td>
                    <input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value))} min="1" required />
                  </td>
                  <td>
                    <input type="number" value={item.unitPrice} onChange={(e) => handleItemChange(index, "unitPrice", parseFloat(e.target.value))} step="0.01" required />
                  </td>
                  <td>{item.total.toFixed(2)}</td>
                  <td>
                    <button type="button" onClick={() => removeItem(index)}>-</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" onClick={addItem}>➕ Add Item</button>

          <div className="totals">
            <p>Subtotal: ${subtotal}</p>
            <p>Tax: ${tax}</p>
            <h3>Total: ${total}</h3>
          </div>

          <button type="submit">Generate Invoice</button>
        </form>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
