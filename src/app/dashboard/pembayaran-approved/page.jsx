"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BookingApprovedPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get("room_id");

  const [loading, setLoading] = useState(true);
  const [canPay, setCanPay] = useState(false);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token || !roomId) return router.push("/auth/login");

    async function fetchData() {
      try {
        // 1. Cek status booking
        const statusRes = await fetch(
          `/api/user/payment/request-book/get-status/${roomId}`
        );
        const statusJson = await statusRes.json();
        if (statusJson.data !== "APPROVED") {
          toast.warning("Booking belum disetujui");
          return router.push("/dashboard");
        }

        // 2. Ambil detail booking untuk ditampilkan
        const bookingRes = await fetch(
          `/api/user/payment/request-book/booking-info/${roomId}`
        );
        const bookingJson = await bookingRes.json();
        setBooking(bookingJson.data);
        setCanPay(true);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
        toast.error("Terjadi kesalahan saat mengambil data booking");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [roomId, router]);

  const handlePayment = () => {
    if (!booking?.redirect_url) {
      toast.error("Link pembayaran tidak tersedia");
      return;
    }

    toast.custom((t) => (
      <div className="p-4 bg-white rounded shadow-md w-[300px]">
        <p className="font-semibold text-sm mb-2">Lanjutkan ke pembayaran?</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t)}
            className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700"
          >
            Batal
          </button>
          <button
            onClick={() => {
              toast.dismiss(t);
              window.open(booking.redirect_url, "_blank");
            }}
            className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
          >
            Bayar Sekarang
          </button>
        </div>
      </div>
    ));
  };

  if (loading) {
    return (
      <section className="flex items-center justify-center h-[70vh]">
        <p className="text-sm text-muted-foreground">
          Memuat informasi booking...
        </p>
      </section>
    );
  }

  const dayCount =
    booking?.start_rent && booking?.end_rent
      ? Math.ceil(
          (new Date(booking.end_rent) - new Date(booking.start_rent)) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  return (
    <section className="max-w-md mx-auto mt-10 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-yellow-600">
            Ringkasan Booking Disetujui
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p>
            <strong>Nomor Kamar:</strong> {booking?.room_number}
          </p>
          <p>
            <strong>Detail Kamar:</strong> {booking?.description}
          </p>
          <p>
            <strong>Tanggal Mulai Sewa:</strong>{" "}
            {formatDate(booking?.start_rent)}
          </p>
          <p>
            <strong>Tanggal Selesai Sewa:</strong>{" "}
            {formatDate(booking?.end_rent)}
          </p>
          <p>
            <strong>Durasi Sewa:</strong> {dayCount} hari
          </p>
          <p>
            <strong>Harga Bulanan:</strong> {formatRupiah(booking?.priceMonth)}
          </p>
          <p>
            <strong>Harga Harian:</strong>{" "}
            {formatRupiah(booking?.priceMonth / 30)}
          </p>
          <p>
            <strong>Total Harga yang harus dibayar:</strong>{" "}
            {formatRupiah(booking?.totalPrice)}{" "}
          </p>

          <div className="pt-2">
            <Button onClick={handlePayment} className="w-full">
              Lanjutkan ke Pembayaran
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function formatRupiah(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
