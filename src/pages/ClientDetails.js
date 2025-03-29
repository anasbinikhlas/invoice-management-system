import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ClientDetails = () => {
  const navigate = useNavigate();
  const { clientId } = useParams(); // Get client ID from URL params
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/clients/${clientId}`);
        setClient(response.data);
      } catch (error) {
        console.error("Error fetching client details:", error);
        setError("Failed to fetch client details");
      } finally {
        setLoading(false);
      }
    };

    fetchClientDetails();
  }, [clientId]);

  if (loading) return <p>Loading client details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Client Details</h1>
      <p className="text-lg">Name: {client.name}</p>
      <p className="text-lg">Email: {client.email}</p>
      <p className="text-lg">Total Invoices: {client.totalInvoices}</p>

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
