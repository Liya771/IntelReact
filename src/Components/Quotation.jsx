import React, { useState } from "react";
import axios from "axios";

const QuotationGenerator = () => {
  const [quotation, setQuotation] = useState({
    date: "",
    number: "",
    customerId: "",
    customerName: "",
    customerAddress: "",
    customerEmail: "",
    employeeName: "",
    employeeId: "",
    items: [{ description: "", quantity: 1, unitPrice: 0 }],
  });

  const handleItemChange = (index, field, value) => {
    const newItems = [...quotation.items];
    newItems[index][field] = value;
    setQuotation({ ...quotation, items: newItems });
  };

  const addItem = () => {
    setQuotation({
      ...quotation,
      items: [...quotation.items, { description: "", quantity: 1, unitPrice: 0 }],
    });
  };

  const removeItem = (index) => {
    const newItems = quotation.items.filter((_, i) => i !== index);
    setQuotation({ ...quotation, items: newItems });
  };

  const calculateTotal = () => {
    return quotation.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0).toFixed(2);
  };

  const handleSubmit = async () => {
    console.log("Sending Quotation Data:", quotation); // Debug output
    try {
      const response = await axios.post("http://localhost:5000/quotations", quotation);
      console.log("Server Response:", response.data); // Log response
      alert("Quotation submitted successfully!");
    } catch (error) {
      console.error("Error submitting quotation:", error.response?.data || error.message);
    }
  };
  

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center">Quotation Generation</h2>
      <div className="mt-4">
        <label>Date:</label>
        <input type="date" value={quotation.date} className="border p-2 w-full" onChange={(e) => setQuotation({ ...quotation, date: e.target.value })} />
        <label>Quotation Number:</label>
        <input type="text" value={quotation.number} className="border p-2 w-full" onChange={(e) => setQuotation({ ...quotation, number: e.target.value })} />
      </div>
      <h3 className="text-xl font-semibold mt-4">Customer Information</h3>
      <input type="text" placeholder="Customer ID" className="border p-2 w-full" value={quotation.customerId} onChange={(e) => setQuotation({ ...quotation, customerId: e.target.value })} />
      <input type="text" placeholder="Customer Name" className="border p-2 w-full" value={quotation.customerName} onChange={(e) => setQuotation({ ...quotation, customerName: e.target.value })} />
      <input type="text" placeholder="Customer Address" className="border p-2 w-full" value={quotation.customerAddress} onChange={(e) => setQuotation({ ...quotation, customerAddress: e.target.value })} />
      <input type="email" placeholder="Customer Email" className="border p-2 w-full" value={quotation.customerEmail} onChange={(e) => setQuotation({ ...quotation, customerEmail: e.target.value })} />
      <h3 className="text-xl font-semibold mt-4">Employee Details</h3>
      <input type="text" placeholder="Employee Name" className="border p-2 w-full" value={quotation.employeeName} onChange={(e) => setQuotation({ ...quotation, employeeName: e.target.value })} />
      <input type="text" placeholder="Employee ID" className="border p-2 w-full" value={quotation.employeeId} onChange={(e) => setQuotation({ ...quotation, employeeId: e.target.value })} />
      <h3 className="text-xl font-semibold mt-4">Quotation Items</h3>
      {quotation.items.map((item, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input type="text" placeholder="Description" className="border p-2 flex-1" value={item.description} onChange={(e) => handleItemChange(index, "description", e.target.value)} />
          <input type="number" placeholder="Quantity" className="border p-2 w-20" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value))} />
          <input type="number" placeholder="Unit Price" className="border p-2 w-20" value={item.unitPrice} onChange={(e) => handleItemChange(index, "unitPrice", parseFloat(e.target.value))} />
          <span className="p-2 w-20">${(item.quantity * item.unitPrice).toFixed(2)}</span>
          <button className="bg-red-500 text-white p-2" onClick={() => removeItem(index)}>Remove</button>
        </div>
      ))}
      <button className="bg-blue-500 text-white p-2 mt-2" onClick={addItem}>Add Item</button>
      <h3 className="text-xl font-semibold mt-4">Total: ${calculateTotal()}</h3>
      <button className="bg-green-500 text-white p-2 mt-4" onClick={handleSubmit}>Submit Quotation</button>
    </div>
  );
};

export default QuotationGenerator;
