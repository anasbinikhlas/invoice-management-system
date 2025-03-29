import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12 },
  section: { marginBottom: 10 },
  header: { fontSize: 20, marginBottom: 10, textAlign: "center", fontWeight: "bold" },
  table: { display: "table", width: "100%", borderCollapse: "collapse", marginTop: 10 },
  tableRow: { flexDirection: "row", borderBottom: "1px solid black" },
  tableCell: { padding: 5, flex: 1, textAlign: "left" },
  total: { fontSize: 14, fontWeight: "bold", marginTop: 10, textAlign: "right" },
});

const InvoicePDF = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/invoices/${id}`);
        if (!response.ok) throw new Error("Failed to fetch invoice");
        const data = await response.json();
        setInvoice(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  if (loading) return <div>Loading invoice...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!invoice) return <div>No invoice found</div>;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>Invoice</Text>
          <Text>Bill From: {invoice.billFrom}</Text>
          <Text>Bill To: {invoice.billTo}</Text>
          <Text>Date: {invoice.date}</Text>
        </View>

        {/* Table Header */}
        <View style={styles.table}>
          <View style={[styles.tableRow, { fontWeight: "bold" }]}>
            <Text style={styles.tableCell}>Description</Text>
            <Text style={styles.tableCell}>Qty</Text>
            <Text style={styles.tableCell}>Price</Text>
            <Text style={styles.tableCell}>Tax</Text>
            <Text style={styles.tableCell}>Discount</Text>
            <Text style={styles.tableCell}>Total</Text>
          </View>

          {/* Table Rows */}
          {invoice.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.description}</Text>
              <Text style={styles.tableCell}>{item.qty}</Text>
              <Text style={styles.tableCell}>${item.price}</Text>
              <Text style={styles.tableCell}>${item.tax}</Text>
              <Text style={styles.tableCell}>${item.discount}</Text>
              <Text style={styles.tableCell}>
                ${item.qty * item.price + item.tax - item.discount}
              </Text>
            </View>
          ))}
        </View>

        {/* Total Section */}
        <View style={styles.total}>
          <Text>Subtotal: ${invoice.subtotal}</Text>
          <Text>Tax: ${invoice.tax}</Text>
          <Text>Discount: ${invoice.discount}</Text>
          <Text>Total: ${invoice.total}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
