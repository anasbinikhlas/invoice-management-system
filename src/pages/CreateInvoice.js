import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000"; // Centralized API base URL

const CreateInvoice = () => {
  const navigate = useNavigate();
  const pdfRef = useRef();
  const [items, setItems] = useState([
    { description: "", qty: 1, price: 0, tax: 0, discount: 0, total: 0 },
  ]);
  const [clientName, setClientName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update item fields and calculate totals
  const updateItem = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    
    const subtotal = updatedItems[index].qty * updatedItems[index].price;
    const taxAmount = subtotal * (updatedItems[index].tax / 100);
    const discountAmount = subtotal * (updatedItems[index].discount / 100);
    
    updatedItems[index].total = (subtotal + taxAmount - discountAmount).toFixed(2);
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      { description: "", qty: 1, price: 0, tax: 0, discount: 0, total: 0 },
    ]);
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((acc, item) => acc + (item.qty * item.price), 0);
    const totalTax = items.reduce((acc, item) => {
      const itemSubtotal = item.qty * item.price;
      return acc + (itemSubtotal * (item.tax / 100));
    }, 0);
    const totalDiscount = items.reduce((acc, item) => {
      const itemSubtotal = item.qty * item.price;
      return acc + (itemSubtotal * (item.discount / 100));
    }, 0);
    const grandTotal = subtotal + totalTax - totalDiscount;
    return { subtotal, totalTax, totalDiscount, grandTotal };
  };

  const { subtotal, totalTax, totalDiscount, grandTotal } = calculateTotals();

  const generatePDF = async () => {
    try {
      const element = pdfRef.current;
      if (!element) throw new Error("Invoice element not found");
      
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm"
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice_${new Date().toISOString().slice(0,10)}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      setError(`PDF generation failed: ${error.message}`);
    }
  };

  const validateInvoice = () => {
    if (!clientName.trim()) {
      setError("Please enter client name");
      return false;
    }
    if (!companyName.trim()) {
      setError("Please enter company name");
      return false;
    }
    if (items.some(item => !item.description.trim())) {
      setError("Please enter descriptions for all items");
      return false;
    }
    setError(null);
    return true;
  };

  const saveAsDraft = () => {
    if (!validateInvoice()) return;
    localStorage.setItem("draftInvoice", JSON.stringify({ 
      clientName, 
      companyName, 
      items,
      totals: { subtotal, totalTax, totalDiscount, grandTotal }
    }));
    alert("Invoice saved as draft!");
  };

  const handleInvoiceSubmit = async (status) => {
    if (!validateInvoice()) return;
    setIsLoading(true);
    setError(null);
    
    try {
      // Verify backend connection first
      await axios.get(`${API_BASE_URL}/api/health`, { timeout: 3000 });

      const invoiceData = {
        client: clientName,
        company: companyName,
        items: items.map(item => ({
          description: item.description,
          quantity: item.qty,
          price: item.price,
          taxRate: item.tax,
          discountRate: item.discount,
          total: item.total
        })),
        subtotal,
        totalTax,
        totalDiscount,
        grandTotal,
        status,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/invoices`,
        invoiceData,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
          },
          timeout: 5000
        }
      );

      console.log("Invoice saved:", response.data);
      
      if (status === "Generated") {
        await generatePDF();
        alert("Invoice generated and saved!");
      } else {
        alert("Invoice sent successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      let errorMessage = "Failed to save invoice";
      
      if (error.code === "ECONNABORTED") {
        errorMessage = "Request timeout - backend not responding";
      } else if (error.response) {
        switch (error.response.status) {
          case 404:
            errorMessage = "API endpoint not found. Check backend is running and routes match.";
            break;
          case 401:
            errorMessage = "Unauthorized - please login again";
            break;
          case 500:
            errorMessage = "Server error - check backend logs";
            break;
          default:
            errorMessage = error.response.data?.message || error.message;
        }
      } else if (error.request) {
        errorMessage = "No response from server. Is backend running?";
      } else {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      console.error("API Error:", {
        message: error.message,
        config: error.config,
        response: error.response?.data,
        stack: error.stack
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Invoice</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex justify-between items-center">
          <span>{error}</span>
          <button 
            onClick={() => setError(null)}
            className="text-red-700 font-bold text-lg"
          >
            ×
          </button>
        </div>
      )}

      <div ref={pdfRef} className="p-4 bg-gray-100 rounded-lg">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold">Bill From</h2>
            <input
              type="text"
              placeholder="Your Company Name"
              className="w-full p-2 border rounded-md mt-1"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Bill To</h2>
            <input
              type="text"
              placeholder="Client Name"
              className="w-full p-2 border rounded-md mt-1"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Items</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Description</th>
                <th className="border p-2">Qty</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Tax (%)</th>
                <th className="border p-2">Discount (%)</th>
                <th className="border p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="border p-2">
                    <input
                      type="text"
                      className="w-full p-1 border rounded-md"
                      value={item.description}
                      onChange={(e) => updateItem(index, "description", e.target.value)}
                      required
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      min="1"
                      className="w-full p-1 border rounded-md"
                      value={item.qty}
                      onChange={(e) => updateItem(index, "qty", parseFloat(e.target.value) || 1)}
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full p-1 border rounded-md"
                      value={item.price}
                      onChange={(e) => updateItem(index, "price", parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      className="w-full p-1 border rounded-md"
                      value={item.tax}
                      onChange={(e) => updateItem(index, "tax", parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      className="w-full p-1 border rounded-md"
                      value={item.discount}
                      onChange={(e) => updateItem(index, "discount", parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td className="border p-2 text-center">${item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            onClick={addItem}
          >
            + Add Item
          </button>
        </div>

        <div className="text-right space-y-2">
          <p className="text-lg">
            <span className="font-semibold">Subtotal:</span> ${subtotal.toFixed(2)}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Tax:</span> ${totalTax.toFixed(2)}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Discount:</span> ${totalDiscount.toFixed(2)}
          </p>
          <p className="text-xl font-bold border-t pt-2 mt-2">
            <span>Total:</span> ${grandTotal.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-4 bg-white p-4 shadow-md rounded-lg">
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
          onClick={() => navigate("/dashboard")}
          disabled={isLoading}
        >
          Back to Dashboard
        </button>
        <button
          className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
          onClick={saveAsDraft}
          disabled={isLoading}
        >
          Save as Draft
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          onClick={() => handleInvoiceSubmit("Sent")}
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Invoice"}
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          onClick={() => handleInvoiceSubmit("Generated")}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate Invoice"}
        </button>
        <button
          className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
          onClick={generatePDF}
          disabled={isLoading}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default CreateInvoice;