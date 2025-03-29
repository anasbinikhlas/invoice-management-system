import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ClientsList = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/clients");
        setClients(response.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">All Clients</h1>

      {loading ? (
        <p>Loading clients...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Client Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Total Invoices</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr
                key={client._id}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => navigate(`/client-details/${client._id}`)}
              >
                <td className="border p-2">{client.name}</td>
                <td className="border p-2">{client.email}</td>
                <td className="border p-2">{client.totalInvoices}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

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
