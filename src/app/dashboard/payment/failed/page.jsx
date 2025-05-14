"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentFailed() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/dashboard/riwayat-transaksi"); // or wherever you want
    }, 4000); // wait 4 seconds
  }, []);

  return (
    <div className="container mx-auto text-center py-20">
      <h1 className="text-2xl font-bold text-red-600">Pembayaran Gagal</h1>
      <p className="text-muted-foreground mt-2">
        Kami tidak menerima pembayaran Anda. Anda akan diarahkan kembali...
      </p>
    </div>
  );
}
