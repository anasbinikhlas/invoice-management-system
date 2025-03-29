import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  
  // Load settings from localStorage or set defaults
  const [settings, setSettings] = useState(() => {
    return JSON.parse(localStorage.getItem("appSettings")) || {
      currency: "USD ($)",
      taxRate: 5,
    };
  });

  // Update localStorage when settings change
  useEffect(() => {
    localStorage.setItem("appSettings", JSON.stringify(settings));
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <label className="block mb-2">
        <span className="text-lg font-semibold">Currency</span>
        <select
          name="currency"
          value={settings.currency}
          onChange={handleChange}
          className="w-full p-2 border rounded-md mt-1"
        >
          <option>USD ($)</option>
          <option>EUR (€)</option>
          <option>GBP (£)</option>
        </select>
      </label>

      <label className="block mb-2">
        <span className="text-lg font-semibold">Tax Rate (%)</span>
        <input
          type="number"
          name="taxRate"
          value={settings.taxRate}
          onChange={handleChange}
          className="w-full p-2 border rounded-md mt-1"
          placeholder="Enter tax rate"
        />
      </label>

      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-800 transition"
        onClick={() => alert("Settings saved!")}
      >
        Save Settings
      </button>

      <button
        className="mt-4 ml-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700 transition"
        onClick={() => navigate("/dashboard")}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default Settings;
