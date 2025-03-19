import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const InvoiceList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // Sample invoices (replace with API or state management later)
  const invoices = [
    { id: 1, client: "John Doe", date: "2024-03-16", amount: 250, status: "Paid" },
    { id: 2, client: "Jane Smith", date: "2024-03-15", amount: 400, status: "Unpaid" },
    { id: 3, client: "Acme Corp", date: "2024-03-14", amount: 800, status: "Overdue" },
  ];

  // Filtered invoices
  const filteredInvoices = invoices.filter(
    (invoice) =>
      (filter === "All" || invoice.status === filter) &&
      invoice.client.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Invoices</h1>

      {/* Search & Filters */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by client name"
          className="p-2 border rounded-md flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="p-2 border rounded-md"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>

      {/* Invoices Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Client</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredInvoices.map((invoice) => (
            <tr key={invoice.id}>
              <td className="border p-2">{invoice.client}</td>
              <td className="border p-2">{invoice.date}</td>
              <td className="border p-2">${invoice.amount}</td>
              <td className="border p-2 font-bold text-center">
                <span
                  className={
                    invoice.status === "Paid"
                      ? "text-green-500"
                      : invoice.status === "Unpaid"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }
                >
                  {invoice.status}
                </span>
              </td>
              <td className="border p-2 text-center">
                <button
                  className="px-3 py-1 bg-blue-500 text-white rounded-md"
                  onClick={() => navigate(`/invoice/${invoice.id}`)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-4">
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded-md"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-md"
          onClick={() => navigate("/create-invoice")}
        >
          + New Invoice
        </button>
      </div>
    </div>
  );
};

export default InvoiceList;
