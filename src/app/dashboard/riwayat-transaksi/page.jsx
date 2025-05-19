"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import moment from "moment";

export default function RiwayatTransaksiMemberPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/user/history-payment"); // asumsi endpoint ada
      const json = await res.json();
      setTransactions(json.data || []);
    } catch (err) {
      console.error("Gagal memuat riwayat transaksi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="container mx-auto p-9 space-y-4">
      <h1 className="text-2xl font-bold mb-4 ">Riwayat Transaksi Anda</h1>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Metode</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Nominal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : transactions.length > 0 ? (
              transactions.map((trx, i) => (
                <TableRow key={i}>
                  <TableCell>
                    {moment(trx.transaction_date).format("DD MMM YYYY")}
                  </TableCell>
                  <TableCell>{trx.invoice || "-"}</TableCell>
                  <TableCell>{trx.payment_type || "-"}</TableCell>
                  <TableCell className="capitalize">{trx.status}</TableCell>
                  <TableCell className="text-right">
                    {Number(trx.amount).toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  Tidak ada transaksi ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
