import React from "react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <label className="block mb-2">
        <span className="text-lg font-semibold">Currency</span>
        <select className="w-full p-2 border rounded-md mt-1">
          <option>USD ($)</option>
          <option>EUR (€)</option>
          <option>GBP (£)</option>
        </select>
      </label>

      <label className="block mb-2">
        <span className="text-lg font-semibold">Tax Rate</span>
        <input type="number" className="w-full p-2 border rounded-md mt-1" placeholder="Enter tax rate" />
      </label>

      <button
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md"
        onClick={() => navigate("/dashboard")}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default Settings;
