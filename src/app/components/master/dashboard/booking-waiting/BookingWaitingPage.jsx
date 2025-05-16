"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Cookies from "js-cookie";

export default function BookingWaitingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get("room_id");

  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) return router.push("/auth/login");

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setUserRole(decoded.roles);
    } catch {
      setUserRole("out_member");
    }
  }, []);

  useEffect(() => {
    if (!roomId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/user/payment/request-book/get-status/${roomId}`
        );
        const result = await res.json();

        if (result.data === "APPROVED") {
          toast.success("Permintaan booking telah disetujui");
          return router.push(
            `/dashboard/pembayaran-approved?room_id=${roomId}`
          );
        }

        if (result.data === "REJECTED") {
          toast.error("Permintaan booking ditolak oleh admin");
          return router.push("/dashboard");
        }
      } catch (err) {
        console.error("Gagal polling status:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [roomId]);

  return (
    <section className="max-w-md mx-auto p-6">
      <Card className="text-center shadow-md">
        <CardHeader>
          <CardTitle className="text-xl text-yellow-600">
            Menunggu Persetujuan Admin
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Permintaan booking Anda telah dikirim. Halaman ini akan memperbarui
            otomatis jika sudah disetujui.
          </p>
          <p className="text-sm">
            Status akun: <strong>{userRole}</strong>
          </p>
          <div className="animate-pulse text-yellow-700">
            ⏳ Menunggu persetujuan...
          </div>
          <Button onClick={() => router.push("/dashboard")}>
            Kembali ke Dashboard
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
