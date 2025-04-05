
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
    items: [{ id: 1, description: "", quantity: 1, unitPrice: 0, total: 0, taxPercentages: 0  }],
  });

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleChange = (e) => {
    setInvoice({ ...invoice, [e.target.id]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...invoice.items];
    updatedItems[index][field] = value;
    updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].unitPrice;
    setInvoice({ ...invoice, items: updatedItems });
  };

  const addItem = () => {
    setInvoice({
      ...invoice,
      items: [...invoice.items, { id: invoice.items.length + 1, description: "", quantity: 1, unitPrice: 0, total: 0 }],
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

      const response = await fetch("http://52.22.49.178:5000/add-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoiceData),
      });
      const result = await response.json();
      alert(result.success ? "Invoice submitted successfully!" : "Failed to submit invoice");
    
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

      {/* Company Information */}
      <div className="card1">
        <div className="card-body">
          <h5>Company Information</h5>
          <div className="c">
            <p><strong>IntelLogixAi Pvt. Ltd.</strong></p>
            <p>Block A, 3rd Floor, Silicon Business Park, Outer Ring Road, Marathahalli, Bengaluru, Karnataka, 560103, India.</p>
            <p><strong>Phone:</strong> +91-9876543210</p>
          </div>
        </div>
      </div>

      {/* Invoice Form */}
      <div className="card-body1">
        <h2>Invoice Generation</h2>
        <form onSubmit={handleSubmit}>
          <div className="rowmb">
            <div className="col-md-6 form-group">
              <label className="form-label">Invoice Date</label>
              <input type="date" id="invoiceDate" className="form-control" value={invoice.invoiceDate} onChange={handleChange} required />            
              <label className="form-label">Invoice Number</label>
              <input type="text" id="invoiceNumber" className="form-control" value={invoice.invoiceNumber} onChange={handleChange} required />
            </div>
          </div>

          {/* Customer Info */}
          <h5>Customer Information</h5>
          <div className="row">
            <div className="col-md-6 form-group">
              <label className="form-label">Customer Name</label>
              <input type="text" id="customerName" className="form-control" value={invoice.customerName} onChange={handleChange} required />
            </div>
            <div className="col-md-6 form-group">
              <label className="form-label">Customer Address</label>
              <textarea id="customerAddress" className="form-control" value={invoice.customerAddress} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Customer Email</label>
            <input type="email" id="customerEmail" className="form-control" value={invoice.customerEmail} onChange={handleChange} required />
          </div>
          <div className="tax">
            <label>Tax Rate (%) &nbsp;</label>
            <input type="number" id="taxPercentage" value={invoice.taxPercentage} onChange={handleChange} min="0" step="0.1" required />
          </div>

          <h4>Invoice Items</h4>
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
              {invoice.items.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td><input type="text" className="form-control" value={item.description} onChange={(e) => handleItemChange(index, "description", e.target.value)} required /></td>
                  <td><input type="number" className="form-control" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value))} min="1" required /></td>
                  <td><input type="number" className="form-control" value={item.unitPrice} onChange={(e) => handleItemChange(index, "unitPrice", parseFloat(e.target.value))} step="0.01" required /></td>
                  <td>{item.total.toFixed(2)}</td>
                  <td><button type="button" className="btn btn-danger" onClick={() => removeItem(index)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className="btn btn-primary" onClick={addItem}>Add Item</button>
          <div className="invoice-totals">
            <p><strong>Subtotal:</strong> ${subtotal}</p>
            <p><strong>Tax ({invoice.taxPercentage}%):</strong> ${tax}</p><br></br>
            <p className="pp"><strong>Total:</strong> ${total}</p>
            </div>

          <button type="submit" className="btn btn-success">Generate Invoice</button>
        </form>
      </div>
      {/* Invoice Totals */}


    </div>
  );
};

export default InvoiceGenerator;




