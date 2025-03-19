import React from "react";
import { useNavigate } from "react-router-dom";

const ClientDetails = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Client Details</h1>

      <p className="text-lg">Name: John Doe</p>
      <p className="text-lg">Email: john@example.com</p>
      <p className="text-lg">Total Invoices: 5</p>

      <button
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md"
        onClick={() => navigate("/dashboard")}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default ClientDetails;
