import React from "react";
import { useNavigate } from "react-router-dom";

const ClientsList = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">All Clients</h1>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Client Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Total Invoices</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">John Doe</td>
            <td className="border p-2">john@example.com</td>
            <td className="border p-2">5</td>
          </tr>
        </tbody>
      </table>

      <button
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md"
        onClick={() => navigate("/dashboard")}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default ClientsList;
