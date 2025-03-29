import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ paid: 0, unpaid: 0, overdue: 0, revenue: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/dashboard");
        const data = await response.json();
        setStats({
          paid: data.paidInvoices,
          unpaid: data.unpaidInvoices,
          overdue: data.overdueInvoices,
          revenue: data.revenueTrends,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const pieData = [
    { name: "Paid", value: stats.paid, color: "#22C55E" },
    { name: "Unpaid", value: stats.unpaid, color: "#FACC15" },
    { name: "Overdue", value: stats.overdue, color: "#EF4444" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Invoice App</h2>
        <ul>
          <li className="py-2 px-4 hover:bg-gray-700 rounded cursor-pointer" onClick={() => navigate("/dashboard")}>Dashboard</li>
          <li className="py-2 px-4 hover:bg-gray-700 rounded cursor-pointer" onClick={() => navigate("/create-invoice")}>Create Invoice</li>
          <li className="py-2 px-4 hover:bg-gray-700 rounded cursor-pointer" onClick={() => navigate("/invoices")}>Invoices</li>
          <li className="py-2 px-4 hover:bg-gray-700 rounded cursor-pointer" onClick={() => navigate("/clients")}>Clients</li>
          <li className="py-2 px-4 hover:bg-gray-700 rounded cursor-pointer" onClick={() => navigate("/reports")}>Reports</li>
          <li className="py-2 px-4 hover:bg-gray-700 rounded cursor-pointer" onClick={() => navigate("/settings")}>Settings</li>
          <li className="py-2 px-4 hover:bg-gray-700 rounded cursor-pointer" onClick={() => navigate("/expense-sheet")}>Expense Sheet</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {loading ? (
          <p className="text-xl">Loading...</p>
        ) : (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {pieData.map((data) => (
                <div key={data.name} className="bg-white p-6 shadow-lg rounded-lg flex flex-col items-center">
                  <h3 className="text-lg font-semibold">{data.name} Invoices</h3>
                  <p className="text-2xl font-bold" style={{ color: data.color }}>${data.value}</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="bg-white p-6 shadow-lg rounded-lg flex justify-center">
                <PieChart width={300} height={300}>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>

              {/* Bar Chart */}
              <div className="bg-white p-6 shadow-lg rounded-lg">
                <BarChart width={400} height={300} data={stats.revenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#3B82F6" />
                </BarChart>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
