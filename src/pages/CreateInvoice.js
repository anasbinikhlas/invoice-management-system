import React, { useRef } from "react";
import ReactToPdf from "react-to-pdf";
import { jsPDF } from "jspdf";

const CreateInvoice = () => {
  const pdfRef = useRef();

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Invoice PDF", 10, 10);
    doc.save("invoice.pdf");
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg" ref={pdfRef}>
      <h1 className="text-2xl font-bold mb-4">Create Invoice</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold">Bill From</h2>
          <input type="text" placeholder="Your Company Name" className="w-full p-2 border rounded-md mt-1" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Bill To</h2>
          <input type="text" placeholder="Client Name" className="w-full p-2 border rounded-md mt-1" />
        </div>
      </div>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Items</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Description</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Tax</th>
              <th className="border p-2">Discount</th>
              <th className="border p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2"><input type="text" className="w-full p-1 border rounded-md" /></td>
              <td className="border p-2"><input type="number" className="w-full p-1 border rounded-md" /></td>
              <td className="border p-2"><input type="number" className="w-full p-1 border rounded-md" /></td>
              <td className="border p-2"><input type="number" className="w-full p-1 border rounded-md" /></td>
              <td className="border p-2"><input type="number" className="w-full p-1 border rounded-md" /></td>
              <td className="border p-2 text-center">$0.00</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="text-right">
        <p className="text-lg font-semibold">Subtotal: $0.00</p>
        <p className="text-lg font-semibold">Tax: $0.00</p>
        <p className="text-lg font-semibold">Discount: $0.00</p>
        <p className="text-xl font-bold">Total: $0.00</p>
      </div>
      
      <div className="flex gap-4 mt-4">
        <ReactToPdf targetRef={pdfRef} filename="invoice.pdf">
          {({ toPdf }) => (
            <button className="px-4 py-2 bg-green-500 text-white rounded-md" onClick={toPdf}>Download as PDF</button>
          )}
        </ReactToPdf>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md" onClick={generatePDF}>Generate PDF</button>
      </div>
    </div>
  );
};

export default CreateInvoice;
