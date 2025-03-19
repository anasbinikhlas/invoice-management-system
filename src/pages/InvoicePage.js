import React from "react";
import { useNavigate } from "react-router-dom";

const InvoicePage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Invoice Details</h1>

      <p className="text-lg">Invoice #: 001</p>
      <p className="text-lg">Client: John Doe</p>
      <p className="text-lg">Amount: $500</p>
      <p className="text-lg text-green-600">Status: Paid</p>

      <button
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md"
        onClick={() => navigate("/dashboard")}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default InvoicePage;
