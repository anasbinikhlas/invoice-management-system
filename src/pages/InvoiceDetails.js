import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Sample invoice data (Replace with API call later)
  const invoices = [
    { id: 1, client: "John Doe", date: "2024-03-16", amount: 250, status: "Paid", items: [
      { description: "Service A", qty: 1, price: 100 },
      { description: "Service B", qty: 2, price: 75 }
    ] },
    { id: 2, client: "Jane Smith", date: "2024-03-15", amount: 400, status: "Unpaid", items: [
      { description: "Service C", qty: 4, price: 100 }
    ] },
    { id: 3, client: "Acme Corp", date: "2024-03-14", amount: 800, status: "Overdue", items: [
      { description: "Service D", qty: 5, price: 160 }
    ] },
  ];

  const invoice = invoices.find((inv) => inv.id === Number(id));

  if (!invoice) {
    return <div className="p-6">Invoice not found.</div>;
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Invoice Details</h1>
      <p><strong>Client:</strong> {invoice.client}</p>
      <p><strong>Date:</strong> {invoice.date}</p>
      <p><strong>Status:</strong> <span className={
        invoice.status === "Paid" ? "text-green-500" :
        invoice.status === "Unpaid" ? "text-yellow-500" : "text-red-500"
      }>{invoice.status}</span></p>
      <h2 className="text-lg font-semibold mt-4">Items</h2>
      <table className="w-full border-collapse border border-gray-300 mt-2">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Description</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={index}>
              <td className="border p-2">{item.description}</td>
              <td className="border p-2">{item.qty}</td>
              <td className="border p-2">${item.price}</td>
              <td className="border p-2">${item.qty * item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xl font-bold mt-4">Total Amount: ${invoice.amount}</p>
      <div className="flex gap-4 mt-4">
        <button className="px-4 py-2 bg-gray-500 text-white rounded-md" onClick={() => navigate("/invoices")}>Back to Invoices</button>
      </div>
    </div>
  );
};

export default InvoiceDetails;
