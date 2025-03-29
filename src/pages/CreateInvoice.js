import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios"; // ✅ Import Axios

const CreateInvoice = () => {
  const navigate = useNavigate();
  const pdfRef = useRef();
  const [items, setItems] = useState([
    { description: "", qty: 1, price: 0, tax: 0, discount: 0, total: 0 },
  ]);
  const [clientName, setClientName] = useState("");
  const [companyName, setCompanyName] = useState("");

  const updateItem = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    updatedItems[index].total = (
      updatedItems[index].qty * updatedItems[index].price +
      updatedItems[index].tax -
      updatedItems[index].discount
    ).toFixed(2);
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { description: "", qty: 1, price: 0, tax: 0, discount: 0, total: 0 }]);
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((acc, item) => acc + parseFloat(item.total), 0);
    const totalTax = items.reduce((acc, item) => acc + parseFloat(item.tax), 0);
    const totalDiscount = items.reduce((acc, item) => acc + parseFloat(item.discount), 0);
    const grandTotal = subtotal + totalTax - totalDiscount;
    return { subtotal, totalTax, totalDiscount, grandTotal };
  };

  const { subtotal, totalTax, totalDiscount, grandTotal } = calculateTotals();

  const generatePDF = async () => {
    const element = pdfRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save("invoice.pdf");
  };

  const saveAsDraft = () => {
    localStorage.setItem("draftInvoice", JSON.stringify({ clientName, companyName, items }));
    alert("Invoice saved as draft!");
  };

  const sendInvoice = async () => {
    try {
      const invoiceData = {
        clientName,
        companyName,
        items,
        subtotal,
        totalTax,
        totalDiscount,
        grandTotal,
      };

      const response = await axios.post("http://localhost:5000/api/invoices", invoiceData);
      alert("Invoice sent successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error sending invoice:", error);
      alert("Failed to send invoice. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Create Invoice</h1>

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
                <th className="border p-2">Tax</th>
                <th className="border p-2">Discount</th>
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
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      className="w-full p-1 border rounded-md"
                      value={item.qty}
                      onChange={(e) => updateItem(index, "qty", parseFloat(e.target.value) || 1)}
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      className="w-full p-1 border rounded-md"
                      value={item.price}
                      onChange={(e) => updateItem(index, "price", parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      className="w-full p-1 border rounded-md"
                      value={item.tax}
                      onChange={(e) => updateItem(index, "tax", parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
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
          <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md" onClick={addItem}>
            + Add Item
          </button>
        </div>

        <div className="text-right">
          <p className="text-lg font-semibold">Subtotal: ${subtotal.toFixed(2)}</p>
          <p className="text-lg font-semibold">Tax: ${totalTax.toFixed(2)}</p>
          <p className="text-lg font-semibold">Discount: ${totalDiscount.toFixed(2)}</p>
          <p className="text-xl font-bold">Total: ${grandTotal.toFixed(2)}</p>
        </div>
      </div>

      {/* ✅ Buttons Section Fixed */}
      <div className="flex gap-4 mt-4 bg-white p-4 shadow-md">
        <button className="px-4 py-2 bg-gray-500 text-white rounded-md" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
        <button className="px-4 py-2 bg-yellow-500 text-white rounded-md" onClick={saveAsDraft}>
          Save as Draft
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded-md" onClick={sendInvoice}>
          Send Invoice
        </button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md" onClick={generatePDF}>
          Download as PDF
        </button>
      </div>
    </div>
  );
};

export default CreateInvoice;
