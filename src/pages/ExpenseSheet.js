import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ExpenseSheet = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([
    { date: "", description: "", income: "", expense: "", balance: 0 },
  ]);
  const [initialBalance, setInitialBalance] = useState(0);

  // Fetch existing data from backend
  useEffect(() => {
    axios.get("http://localhost:5000/api/expenses")
      .then(response => {
        setEntries([...response.data.entries, { date: "", description: "", income: "", expense: "", balance: 0 }]);
        setInitialBalance(response.data.initialBalance);
      })
      .catch(error => console.error("Error fetching expenses:", error));
  }, []);

  useEffect(() => {
    calculateBalances();
  }, [initialBalance]);

  const handleChange = (index, field, value) => {
    const updatedEntries = [...entries];
    updatedEntries[index][field] = value;
    if (index === entries.length - 1) {
      updatedEntries.push({ date: "", description: "", income: "", expense: "", balance: 0 });
    }
    setEntries(sortEntries(updatedEntries));
  };

  const sortEntries = (entries) => {
    const sorted = entries.filter(entry => entry.date).sort((a, b) => new Date(a.date) - new Date(b.date));
    return [...sorted, { date: "", description: "", income: "", expense: "", balance: 0 }];
  };

  const calculateBalances = () => {
    let balance = initialBalance;
    const updatedEntries = entries.map(entry => {
      const income = parseFloat(entry.income) || 0;
      const expense = parseFloat(entry.expense) || 0;
      balance += income - expense;
      return { ...entry, balance };
    });
    setEntries(updatedEntries);
  };

  const handleSave = () => {
    axios.post("http://localhost:5000/api/expenses", { entries })
      .then(() => alert("Expenses saved successfully!"))
      .catch(error => console.error("Error saving expenses:", error));
  };

  const totalIncome = entries.reduce((sum, entry) => sum + (parseFloat(entry.income) || 0), 0);
  const totalExpense = entries.reduce((sum, entry) => sum + (parseFloat(entry.expense) || 0), 0);
  const finalBalance = entries.length > 0 ? entries[entries.length - 1].balance : initialBalance;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Daily Expense Sheet</h1>
      <button onClick={() => navigate("/dashboard")} className="mb-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-700">← Back to Dashboard</button>
      <div className="mb-4">
        <label className="font-semibold">Initial Balance:</label>
        <input type="number" value={initialBalance} onChange={(e) => setInitialBalance(parseFloat(e.target.value) || 0)} className="ml-2 p-2 border rounded" />
      </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Date</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">In</th>
            <th className="border p-2">Out</th>
            <th className="border p-2">Remaining</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={index}>
              <td className="border p-2">
                <input type="date" value={entry.date} onChange={(e) => handleChange(index, "date", e.target.value)} className="p-1 border rounded" />
              </td>
              <td className="border p-2">
                <input type="text" value={entry.description} onChange={(e) => handleChange(index, "description", e.target.value)} className="p-1 border rounded w-full" />
              </td>
              <td className="border p-2">
                <input type="number" value={entry.income} onChange={(e) => handleChange(index, "income", e.target.value)} className="p-1 border rounded w-full" />
              </td>
              <td className="border p-2">
                <input type="number" value={entry.expense} onChange={(e) => handleChange(index, "expense", e.target.value)} className="p-1 border rounded w-full" />
              </td>
              <td className="border p-2">{entry.balance}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gray-300 font-bold">
            <td className="border p-2" colSpan="2">Total</td>
            <td className="border p-2">{totalIncome}</td>
            <td className="border p-2">{totalExpense}</td>
            <td className="border p-2">{finalBalance}</td>
          </tr>
        </tfoot>
      </table>
      <button onClick={handleSave} className="mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-700">Save Expenses</button>
    </div>
  );
};

export default ExpenseSheet;
