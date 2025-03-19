import React from "react";
import { useNavigate } from "react-router-dom";

const Reports = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Reports & Analytics</h1>

      <p className="text-lg">Total Revenue: $10,000</p>
      <p className="text-lg">Invoices Generated: 50</p>
      <p className="text-lg">Top Client: John Doe</p>

      <button
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md"
        onClick={() => navigate("/dashboard")}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default Reports;
