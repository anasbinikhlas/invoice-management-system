import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CreateInvoice from "./pages/CreateInvoice";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create-invoice" element={<CreateInvoice />} />
      </Routes>
    </Router>
  );
};

export default App;
