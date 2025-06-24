"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart2,
  BedDouble,
  Users,
  Wallet,
  CreditCard,
  Info,
} from "lucide-react";
import IncomeExpenseLineChart from "../components/master/dashboard/dual-chart/IncomeExpenseLineChart";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [roomStats, setRoomStats] = useState({ filled: 0, total: 0 });
  const [roles, setRoles] = useState("");
  const [activeUser, setActiveUser] = useState(0);
  const [recordLastPay, setRecordLastPay] = useState([]);
  const { user, loading, logout } = useAuth();
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      // console.log("storeTOken", storedToken); // ✅ log ini muncul
      setToken(storedToken); // ✅ diset
    }
  }, []);

  useEffect(() => {
    if (loading) return; // Tunggu sampai loading selesai
    if (user?.roles) {
      setRoles(user.roles.toUpperCase());
    } else {
      setRoles(""); // Reset roles jika user tidak ada
    }
  }, [user, loading]);

  useEffect(() => {
    if ((roles === "SUPER_ADMIN" || roles === "ADMIN") && token) {
      const fetchData = async () => {
        try {
          const [incomeRes, expenseRes, roomRes, userActRes, lastPayRes] =
            await Promise.all([
              fetch("/api/dashboard/income", {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }),
              fetch("/api/dashboard/expense", {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }),
              fetch("/api/dashboard/fillroom", {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }),
              fetch("/api/dashboard/active-user", {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }),
              fetch("/api/dashboard/last-5-record-pay", {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }),
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
  }, [roles, token]); // ✅ tambahkan 'token' di dependency

  return (
    <section className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="flex gap-2 items-center">
          <Badge
            variant="outline"
            className="bg-slate-100 text-slate-800 border border-slate-300"
          >
            {roles === "ADMIN"
              ? "Pemilik Kost"
              : roles === "MEMBER"
              ? "Penghuni Kost"
              : roles === "OUT_MEMBER"
              ? "Bukan Penghuni Kost"
              : roles}
          </Badge>

          {(roles === "MEMBER" || roles === "OUT_MEMBER") && (
            <>
              {user?.end_rent ? (
                new Date(user.end_rent) < new Date() ? (
                  <Badge className="bg-red-100 text-red-800 border border-red-300">
                    Jatuh Tempo: {formatTanggal(user.end_rent)}
                  </Badge>
                ) : (
                  <Badge className="bg-green-100 text-green-800 border border-green-300">
                    Masa Aktif: {formatTanggal(user.end_rent)}
                  </Badge>
                )
              ) : (
                <Badge className="bg-gray-100 text-gray-800 border border-gray-300">
                  Belum Ada Masa Aktif
                </Badge>
              )}

              <Badge className="bg-blue-100 text-blue-800 border border-blue-300">
                Kamar: {user?.room_number || "-"}
              </Badge>
            </>
          )}
        </div>
      </div>

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
      ) : roles === "MEMBER" || roles === "OUT_MEMBER" ? (
        <>
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Informasi Penting</AlertTitle>
            <AlertDescription className="text-blue-700">
              Silakan baca tata cara pembayaran dan peraturan kost sebelum
              melakukan booking.
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tata Cara Pembayaran</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Untuk Member:</h4>
                  <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
                    <li>Klik tombol Pembayaran di side bar</li>
                    <li>Pilih Kamar yang ingin di sewa</li>
                    <li>Pilih tanggal mulai dan selesai sewa</li>
                    <li>Klik tombol "Lanjut ke Pembayaran"</li>
                    <li>Pilih metode pembayaran yang tersedia</li>
                    <li>Lakukan pembayaran sesuai nominal yang tertera</li>
                    <li>Simpan bukti pembayaran sebagai bukti transaksi</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Untuk Non-Member:</h4>
                  <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
                    <li>Klik tombol Pembayaran di side bar</li>
                    <li>Pilih Kamar yang ingin di booking</li>
                    <li>Pilih tanggal mulai dan selesai sewa</li>
                    <li>Klik tombol "Kirim Permintaan Booking"</li>
                    <li>Tunggu persetujuan dari admin (maksimal 1x24 jam)</li>
                    <li>
                      Setelah disetujui, lakukan pembayaran sesuai instruksi
                    </li>
                    <li>Simpan bukti pembayaran sebagai bukti transaksi</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Peraturan Kost</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Peraturan Kamar:</h4>
                  <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
                    <li>
                      Menempati ruangan/kamar sesuai prosedur kesepakatan yang
                      ada
                    </li>
                    <li>
                      Menjaga kenyamanan bersama dan tidak mengganggu penghuni
                      lain
                    </li>
                    <li>Menjaga kebersihan ruangan/kamar dengan baik</li>
                    <li>
                      Membuang sampah di tempat sampah yang telah disediakan
                    </li>
                    <li>
                      Mematikan lampu/peralatan listrik/air jika tidak digunakan
                    </li>
                    <li>
                      Tamu hanya diperbolehkan berkunjung maksimal sampai pukul
                      21.00 WIB
                    </li>
                    <li>
                      Dilarang menerima tamu lawan jenis yang bukan
                      saudara/Muhrim di dalam kamar (disarankan tetap di luar
                      kamar)
                    </li>
                    <li>
                      Uang dan barang berharga menjadi tanggung jawab
                      masing-masing penghuni
                    </li>
                    <li>
                      Dilarang membawa, menyimpan, atau mengonsumsi
                      barang-barang terlarang (minuman keras, narkoba, dan
                      sejenisnya)
                    </li>
                    <li>Wajib mematuhi semua tata tertib yang berlaku</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-sm">Silakan login terlebih dahulu.</p>
      )}
    </section>
  );
}

const formatRupiah = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const formatTanggal = (value) => {
  return new Date(value).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
