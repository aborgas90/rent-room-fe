"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart2, BedDouble, Users, Wallet, CreditCard } from "lucide-react";
import IncomeExpenseLineChart from "../components/master/dashboard/dual-chart/IncomeExpenseLineChart";

export default function DashboardPage() {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [roomStats, setRoomStats] = useState({ filled: 0, total: 0 });
  const [roles, setRoles] = useState("");
  const [activeUser, setActiveUser] = useState(0);
  const [recordLastPay, setRecordLastPay] = useState([]);

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      console.warn("Token tidak ditemukan di cookies.");
      return;
    }

    try {
      const payloadBase64 = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));

      const role = decodedPayload.roles || "";
      setRoles(role.toUpperCase());
    } catch (err) {
      console.error("❌ Gagal decode token:", err);
    }
  }, []);

  useEffect(() => {
    if (roles === "SUPER_ADMIN" || roles === "ADMIN") {
      const fetchData = async () => {
        try {
          const [incomeRes, expenseRes, roomRes, userActRes, lastPayRes] =
            await Promise.all([
              fetch("/api/dashboard/income"),
              fetch("/api/dashboard/expense"),
              fetch("/api/dashboard/fillroom"),
              fetch("/api/dashboard/active-user"),
              fetch("/api/dashboard/last-5-record-pay"),
            ]);

          const incomeData = await incomeRes.json();
          const expenseData = await expenseRes.json();
          const roomData = await roomRes.json();
          const userActData = await userActRes.json();
          const lastPayData = await lastPayRes.json();

          setIncome(incomeData.data.amount ?? 0);
          setExpense(expenseData.data.amount ?? 0);
          setActiveUser(userActData.data.count ?? 0);
          setRoomStats(roomData.data);
          setRecordLastPay(lastPayData.data ?? []);
        } catch (error) {
          console.error("Error loading dashboard data:", error);
        }
      };

      fetchData();
    }
  }, [roles]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Selamat Datang di Dashboard</h1>

      {roles === "SUPER_ADMIN" || roles === "ADMIN" ? (
        <>
          <p className="text-muted-foreground">
            Berikut ringkasan administrasi keuangan kos Anda hari ini.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Pemasukan */}
            <Card className="h-full">
              <CardContent className="py-4">
                <div className="flex gap-4 items-center">
                  <div className="flex-shrink-0">
                    <BarChart2 className="w-10 h-10 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-medium text-muted-foreground">
                      Total Pemasukan Bulan Ini
                    </h2>
                    <p className="text-xl font-bold text-green-600">
                      {formatRupiah(income)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Pengeluaran */}
            <Card className="h-full">
              <CardContent className="py-4">
                <div className="flex gap-4 items-center">
                  <div className="flex-shrink-0">
                    <Wallet className="w-10 h-10 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-medium text-muted-foreground">
                      Total Pengeluaran Bulan Ini
                    </h2>
                    <p className="text-xl font-bold text-red-600">
                      {formatRupiah(expense)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Kamar Terisi */}
            <Card className="h-full">
              <CardContent className="py-4">
                <div className="flex gap-4 items-center">
                  <div className="flex-shrink-0">
                    <BedDouble className="w-10 h-10 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-medium text-muted-foreground">
                      Jumlah Kamar Terisi
                    </h2>
                    <p className="text-xl font-bold">
                      {roomStats.filled} / {roomStats.total}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pengguna Aktif */}
            <Card className="h-full">
              <CardContent className="py-4">
                <div className="flex gap-4 items-center">
                  <div className="flex-shrink-0">
                    <Users className="w-10 h-10 text-yellow-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-medium text-muted-foreground">
                      Pengguna yang Aktif
                    </h2>
                    <p className="text-xl font-bold text-yellow-600">
                      {activeUser}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Grafik */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Chart - 2 kolom */}
            <div className="col-span-1 lg:col-span-2">
              <Card className="h-full">
                <CardContent className="py-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Grafik Pemasukan & Pengeluaran di Tahun 2025
                  </h3>
                  <IncomeExpenseLineChart />
                </CardContent>
              </Card>
            </div>

            {/* eslint-disable-next-line react/no-unescaped-entities */}
            {/* Riwayat Pembayaran - 1 kolom */}
            <div className="col-span-1">
              <Card className="h-full">
                <CardContent className="py-4">
                  <h3 className="text-lg font-semibold mb-4">
                    5 Pembayaran Terakhir
                  </h3>
                  <ul className="text-sm space-y-2">
                    {recordLastPay.map((item) => (
                      <li
                        key={item.payment_id}
                        className="flex items-start gap-4"
                      >
                        <CreditCard className="w-5 h-5 mt-1 text-primary" />
                        <div>
                          <p className="font-medium">
                            {/* eslint-disable-next-line react/no-unescaped-entities */}
                            {item.user.name} membayar{" "}
                            {formatRupiah(item.amount)} untuk kamar{" "}
                            {item.room.room_number}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(item.payment_date).toLocaleDateString(
                              "id-ID",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      ) : roles === "MEMBER" || roles === "OUT" ? (
        <>
          <p className="text-muted-foreground">Panduan Pembayaran Kos</p>
          <Card>
            <CardContent className="py-4 space-y-2 text-sm">
              <p>1. Transfer ke rekening: BCA 123456789 a/n Kos Amanah</p>
              <p>2. Konfirmasi pembayaran ke admin via WhatsApp</p>
              <p>3. Simpan bukti transfer untuk keamanan</p>
            </CardContent>
          </Card>
        </>
      ) : (
        <p className="text-gray-500 text-sm">Silakan login terlebih dahulu.</p>
      )}
    </div>
  );
}

const formatRupiah = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};
