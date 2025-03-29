import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CreateInvoice from "./pages/CreateInvoice";
import InvoiceList from "./pages/InvoiceList";
import InvoiceDetails from "./pages/InvoiceDetails";
import ClientsList from "./pages/ClientsList";
import ClientDetails from "./pages/ClientDetails";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ExpenseSheet from "./pages/ExpenseSheet"; 
import PrivateRoute from "./pages/PrivateRoute"; // ✅ Import Private Route

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-invoice" element={<CreateInvoice />} />
            <Route path="/invoices" element={<InvoiceList />} />
            <Route path="/invoice/:id" element={<InvoiceDetails />} />
            <Route path="/clients" element={<ClientsList />} />
            <Route path="/client/:id" element={<ClientDetails />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/expense-sheet" element={<ExpenseSheet />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
