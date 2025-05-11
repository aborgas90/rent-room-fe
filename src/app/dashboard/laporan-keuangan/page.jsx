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

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPaymentPage, setCurrentPaymentPage] = useState(1);
  const [totalPaymentPages, setTotalPaymentPages] = useState(1);
  const [totalPaymentItems, setTotalPaymentItems] = useState(0);

  const fetchTransactions = async () => {
    try {
      setLoadingTransactions(true);
      const typeQuery = typeFilter === "ALL" ? "" : typeFilter;
      const res = await fetch(
        `/api/management/laporan-keuangan/transaksi-table?type=${typeQuery}&page=${currentPage}&limit=${pageSize}`
      );
      const data = await res.json();
      setTransactions(data.data);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalItems(data.pagination?.total || 0);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoadingTransactions(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [typeFilter, currentPage]);

  // ✅ Fetch payments jika statusFilter berubah
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoadingPayments(true);
        const statusQuery = statusFilter === "ALL" ? "" : statusFilter;
        const res = await fetch(
          `/api/management/laporan-keuangan/payment-table?status=${statusQuery}&page=${currentPaymentPage}&limit=${pageSize}`
        );
        const data = await res.json();
        setPayments(data.data || []);
        setTotalPaymentPages(data.pagination?.totalPages || 1);
        setTotalPaymentItems(data.pagination?.total || 0);
      } catch (err) {
        console.error("Failed to fetch payments:", err);
      } finally {
        setLoadingPayments(false);
      }
    };

    fetchPayments();
  }, [statusFilter, currentPaymentPage]);

  return (
    <div className="container mx-auto p-9 space-y-4">
      <TransactionTable
        data={transactions}
        search={search}
        onSearchChange={setSearch}
        typeFilter={typeFilter}
        onTypeFilterChange={(value) => {
          setCurrentPage(1);
          setTypeFilter(value);
        }}
        loading={loadingTransactions}
        onReload={fetchTransactions}
        pagination={{ currentPage, totalPages, totalItems }}
        pageSize={pageSize}
        setPage={setCurrentPage}
      />
      <PaymentHistoryTable
        data={payments}
        loading={loadingPayments}
        statusFilter={statusFilter}
        onStatusFilterChange={(value) => {
          setCurrentPaymentPage(1);
          setStatusFilter(value);
        }}
        pagination={{
          currentPage: currentPaymentPage,
          totalPages: totalPaymentPages,
          totalItems: totalPaymentItems,
        }}
        setPage={setCurrentPaymentPage}
        pageSize={pageSize}
      />
    </div>
  );
}
