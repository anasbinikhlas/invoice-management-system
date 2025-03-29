import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const InvoiceDetails = () => {
  const { id } = useParams(); // Get invoice ID from URL
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/invoices/${id}`); // Backend API
        if (!response.ok) throw new Error("Failed to fetch invoice details");
        const data = await response.json();
        setInvoice(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  if (loading) return <p className="text-center mt-5">Loading invoice details...</p>;
  if (error) return <p className="text-center text-red-500 mt-5">Error: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-semibold mb-4">Invoice Details</h2>

      <p><strong>Invoice ID:</strong> {invoice._id}</p>
      <p><strong>Client:</strong> {invoice.client.name}</p>
      <p><strong>Status:</strong> {invoice.status}</p>
      <p><strong>Total Amount:</strong> ${invoice.totalAmount}</p>

      <h3 className="text-xl font-semibold mt-6">Items</h3>
      <ul className="list-disc pl-6">
        {invoice.items.map((item, index) => (
          <li key={index}>
            {item.description} - {item.quantity} x ${item.price}
          </li>
        ))}
      </ul>

      <div className="flex gap-4 mt-4">
        <button className="px-4 py-2 bg-gray-500 text-white rounded-md" onClick={() => navigate("/invoices")}>
          Back to Invoices
        </button>
      </div>
    </div>
  );
};

export default InvoiceDetails;
