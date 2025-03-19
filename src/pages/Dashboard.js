import React from "react";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Invoice App</h2>
        <ul>
          <li className="py-2 px-4 hover:bg-gray-700 rounded"><a href="/">Dashboard</a></li>
          <li className="py-2 px-4 hover:bg-gray-700 rounded"><a href="/create-invoice">Create Invoice</a></li>
          <li className="py-2 px-4 hover:bg-gray-700 rounded"><a href="/invoices">Invoices</a></li>
          <li className="py-2 px-4 hover:bg-gray-700 rounded"><a href="/clients">Clients</a></li>
          <li className="py-2 px-4 hover:bg-gray-700 rounded"><a href="/reports">Reports</a></li>
          <li className="py-2 px-4 hover:bg-gray-700 rounded"><a href="/settings">Settings</a></li> 
        </ul>
      </div>

      {/* Main Dashboard Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

        {/* Invoice Overview */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 shadow rounded-lg">
            <h3 className="text-lg font-semibold">Paid Invoices</h3>
            <p className="text-2xl font-bold text-green-500">$2,500</p>
          </div>
          <div className="bg-white p-4 shadow rounded-lg">
            <h3 className="text-lg font-semibold">Unpaid Invoices</h3>
            <p className="text-2xl font-bold text-yellow-500">$1,200</p>
          </div>
          <div className="bg-white p-4 shadow rounded-lg">
            <h3 className="text-lg font-semibold">Overdue Invoices</h3>
            <p className="text-2xl font-bold text-red-500">$800</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex gap-4">
          <a href="/create-invoice" className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Create Invoice
          </a>
          <a href="/clients" className="px-4 py-2 bg-green-500 text-white rounded-md">
            View Clients
          </a>
          <a href="/reports" className="px-4 py-2 bg-purple-500 text-white rounded-md">
            Generate Report
          </a>
          <a href="/settings" className="px-4 py-2 bg-gray-500 text-white rounded-md">
            Settings
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
