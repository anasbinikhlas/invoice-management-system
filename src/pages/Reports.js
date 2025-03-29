import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

const Reports = () => {
  const navigate = useNavigate();
  const [reportData, setReportData] = useState({
    totalRevenue: 0,
    invoicesCount: 0,
    topClient: "",
    monthlyRevenue: [],
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/reports");
        setReportData(response.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Reports & Analytics</h1>

      <p className="text-lg">Total Revenue: ${reportData.totalRevenue}</p>
      <p className="text-lg">Invoices Generated: {reportData.invoicesCount}</p>
      <p className="text-lg">Top Client: {reportData.topClient || "N/A"}</p>

      {/* Chart */}
      <div className="mt-6 w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={reportData.monthlyRevenue}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#3182CE" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <button
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700 transition"
        onClick={() => navigate("/dashboard")}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default Reports;
