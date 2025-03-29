import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const InvoiceList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [invoices, setInvoices] = useState([]); // Ensure it's always an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch invoices from backend
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/invoices"); // Ensure API URL is correct

        // Ensure data is an array
        if (Array.isArray(response.data)) {
          setInvoices(response.data);
        } else {
          setError("Invalid data format from API");
        }
      } catch (err) {
        setError("Failed to load invoices. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  // Ensure invoices is an array before filtering
  const filteredInvoices = Array.isArray(invoices)
    ? invoices.filter(
        (invoice) =>
          (filter === "All" || invoice.status === filter) &&
          invoice.clientName?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Invoices</h1>

      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}

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

      {/* Loading State */}
      {loading ? (
        <p>Loading invoices...</p>
      ) : (
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
              <tr key={invoice._id}>
                <td className="border p-2">{invoice.clientName || "Unknown"}</td>
                <td className="border p-2">{new Date(invoice.date).toLocaleDateString()}</td>
                <td className="border p-2">${invoice.totalAmount}</td>
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
                    onClick={() => navigate(`/invoice/${invoice._id}`)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

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
