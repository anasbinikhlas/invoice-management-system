import React, { useState, useEffect } from "react";

const InvoicePage = () => {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const invoicesPerPage = 3;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/invoices");
        if (!response.ok) throw new Error("Failed to fetch invoices");
        const data = await response.json();
        setInvoices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  // Filter invoices based on search input
  const filteredInvoices = invoices.filter((invoice) =>
    invoice.client.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);
  const startIndex = (currentPage - 1) * invoicesPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + invoicesPerPage);

  if (loading) return <div className="p-6">Loading invoices...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Invoices</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by client name..."
        className="p-2 border rounded-md w-full mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Invoice List */}
      <ul>
        {paginatedInvoices.map((invoice) => (
          <li key={invoice._id} className="p-3 border-b flex justify-between">
            <span>{invoice.client}</span>
            <span className={invoice.status === "Paid" ? "text-green-500" : invoice.status === "Unpaid" ? "text-yellow-500" : "text-red-500"}>
              {invoice.status}
            </span>
            <span>${invoice.amount}</span>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="mt-4 flex gap-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            className={`px-3 py-1 rounded-md ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-300"}`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default InvoicePage;
