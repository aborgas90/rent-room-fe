// pages/dashboard/pembayaran-berhasil.jsx

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  const [data, setData] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    fetch(`/api/user/payment/invoice/${orderId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json?.status) setData(json.data);
      })
      .catch((err) => console.error("❌ Gagal memuat invoice:", err));
  }, [orderId]);

  if (!data) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Memuat data pembayaran...
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-xl mx-auto mt-10 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-green-600">
            Pembayaran Berhasil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="space-y-1">
            <p>
              <strong>Nomor Invoice:</strong> {data.midtrans_order_id}
            </p>
            <p>
              <strong>Nama:</strong> {data.user_name}
            </p>
            <p>
              <strong>Email:</strong> {data.email}
            </p>
            <p>
              <strong>No. Kamar:</strong> {data.room_number}
            </p>
            <p>
              <strong>Metode Pembayaran:</strong> {data.payment_method}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <Badge variant="success">{data.status}</Badge>
            </p>
          </div>

          <hr />

          <div className="space-y-1">
            <p>
              <strong>Harga Total:</strong> {formatRupiah(data.amount)}
            </p>
            <p>
              <strong>Tanggal Sewa:</strong>{" "}
              {format(new Date(data.start_rent), "dd MMMM yyyy", {
                locale: id,
              })}{" "}
              -{" "}
              {format(new Date(data.end_rent), "dd MMMM yyyy", { locale: id })}
            </p>
            <p>
              <strong>Waktu Pembayaran:</strong>{" "}
              {format(new Date(data.settlementTime), "dd MMMM yyyy, HH:mm", {
                locale: id,
              })}
            </p>
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
