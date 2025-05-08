"use client";

import PaymentHistoryTable from "@/app/components/master/laporan-keuangan/payment/PaymentHistoryTable";
import TransactionTable from "@/app/components/master/laporan-keuangan/transaction/TransactionTable";
import { useEffect, useState } from "react";

export default function ReportTransactionPage() {
  const [transactions, setTransactions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [loadingPayments, setLoadingPayments] = useState(true);

  const [typeFilter, setTypeFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // ✅ Fetch transaksi jika typeFilter berubah
  const fetchTransactions = async () => {
    try {
      setLoadingTransactions(true);
      const typeQuery = typeFilter === "ALL" ? "" : typeFilter;
      const res = await fetch(
        `/api/management/laporan-keuangan/transaksi-table?type=${typeQuery}`
      );
      const data = await res.json();
      setTransactions(data.data || []);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoadingTransactions(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [typeFilter]);

  // ✅ Fetch payments jika statusFilter berubah
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoadingPayments(true);
        const statusQuery = statusFilter === "ALL" ? "" : statusFilter;
        const res = await fetch(
          `/api/management/laporan-keuangan/payment-table?status=${statusQuery}`
        );
        const data = await res.json();
        setPayments(data.data || []);
      } catch (err) {
        console.error("Failed to fetch payments:", err);
      } finally {
        setLoadingPayments(false);
      }
    };

    fetchPayments();
  }, [statusFilter]);

  return (
    <div className="container mx-auto p-9 space-y-4">
      <TransactionTable
        data={transactions}
        search={search}
        onSearchChange={setSearch}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        loading={loadingTransactions}
        onReload={fetchTransactions}
      />
      <PaymentHistoryTable
        data={payments}
        loading={loadingPayments}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />
    </div>
  );
}
