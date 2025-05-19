"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import moment from "moment";
import { toast } from "sonner";

import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function BookingFormPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [room, setRoom] = useState(null);
  const [role, setRole] = useState("loading");
  const [form, setForm] = useState({
    start_rent: "",
    end_rent: "",
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkPermission() {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/auth/login");

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userRole = payload.roles;
        setRole(userRole); // simpan role lebih dulu

        // hanya fetch status booking jika out_member
        if (userRole === "out_member") {
          const res = await fetch(
            `/api/user/payment/request-book/get-status/${id}`
          );
          const data = await res.json();

          if (data?.data === "PENDING_APPROVAL") {
            toast.warning("Booking Anda sedang menunggu persetujuan admin");
            return router.push(`/dashboard/booking-waiting?room_id=${id}`);
          }

          if (data?.data === "APPROVED") {
            toast.success("Booking disetujui, lanjutkan pembayaran");
            return router.push(`/dashboard/pembayaran/${id}`);
          }
        }
      } catch (err) {
        console.error("Gagal validasi status booking:", err);
        toast.error("Terjadi kesalahan saat validasi akses");
        return router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }

    checkPermission();
  }, [id, router]);

  useEffect(() => {
    if (id) {
      fetch(`/api/user/room/${id}`)
        .then((res) => res.json())
        .then((data) => setRoom(data.data))
        .catch(() => setRoom(null));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!startDate || moment(startDate).isSameOrBefore(moment(), "day")) {
      toast.error("Tanggal mulai harus lebih dari hari ini");
      return;
    }

    if (!endDate || moment(endDate).isSameOrBefore(startDate, "day")) {
      toast.error("Tanggal selesai harus setelah tanggal mulai");
      return;
    }

    setLoading(true);

    const payload = {
      roomId: parseInt(id),
      start_rent: form.start_rent,
      end_rent: form.end_rent,
    };

    try {
      if (role === "out_member") {
        const res = await fetch("/api/user/payment/request-book", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data?.message || "Terjadi kesalahan saat mengirim request."
          );
        }

        toast.success("Permintaan booking dikirim", {
          description: "Silakan tunggu persetujuan admin.",
        });

        router.push(`/dashboard/booking-waiting?room_id=${id}`);
      } else {
        const res = await fetch("/api/user/payment/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok || !data.redirect_url) {
          throw new Error(data?.message || "Gagal membuat pembayaran");
        }

        window.location.href = data.redirect_url;
      }
    } catch (error) {
      toast.error("Gagal memproses", {
        description: error.message || "Terjadi kesalahan.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!room || role === "loading")
    return <div className="p-6 text-center">Memuat data kamar...</div>;

  return (
    <section className="max-w-xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Form Booking</h1>
        <Badge variant="outline">{role}</Badge>
      </div>

      <Card className="p-0 shadow-md rounded-xl overflow-hidden">
        <Image
          src={
            room.bathroomType === "INDOOR"
              ? "/kamar-indor.jpg"
              : "/kamar-outdor.jpg"
          }
          alt={`Kamar ${room.room_number}`}
          width={800}
          height={300}
          className="object-cover w-full h-48"
        />
        <CardHeader className="px-6 pt-4 pb-2">
          <CardTitle>Kamar {room.room_number}</CardTitle>
          <CardDescription>{room.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-6 pb-6">
          <p className="text-indigo-600 font-bold text-lg">
            {formatRupiah(room.price)} / bulan
          </p>

          {room.facilities?.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-1">Fasilitas:</h4>
              <div className="flex flex-wrap gap-2">
                {room.facilities.map((f) => (
                  <Badge key={f.facility_id} variant="secondary">
                    {f.facilities_name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {role === "out_member" && (
            <div className="border-l-4 border-yellow-500 bg-yellow-100 p-3 rounded text-sm text-yellow-800 flex items-start gap-2">
              <svg
                className="w-5 h-5 mt-0.5 text-yellow-600 animate-pulse"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 8a1 1 0 012 0v3a1 1 0 01-2 0V8zm0 5a1 1 0 012 0v1a1 1 0 01-2 0v-1z" />
              </svg>
              <div>
                Anda belum menjadi member. Permintaan booking akan dikirim ke
                admin.
                <br />
                <span className="font-semibold text-yellow-700">
                  Status: Menunggu persetujuan admin
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label>Tanggal Mulai Sewa</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full text-left",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    {startDate
                      ? moment(startDate).format("LL")
                      : "Pilih tanggal"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      setStartDate(date);
                      setForm((prev) => ({
                        ...prev,
                        start_rent: moment(date).format("YYYY-MM-DD"),
                      }));
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label>Tanggal Selesai Sewa</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full text-left",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    {endDate ? moment(endDate).format("LL") : "Pilih tanggal"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      setEndDate(date);
                      setForm((prev) => ({
                        ...prev,
                        end_rent: moment(date).format("YYYY-MM-DD"),
                      }));
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? "Memproses..."
                : role === "out_member"
                ? "Kirim Permintaan Booking"
                : "Lanjut ke Pembayaran"}
            </Button>
          </form>
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
