"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function PaymentPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await fetch("/api/list-rooms");
        const data = await res.json();

        const filtered = data.data
          .filter((room) => room.is_deleted === false)
          .map((room) => ({
            id: room.room_id,
            name: room.room_number,
            desc: room.description,
            price: room.price,
            status: room.status,
            bathroomType: room.bathroomType,
            facilities: room.facilities.map((f) => f.facilities_name),
          }));

        setRooms(filtered);
      } catch (err) {
        setError("Gagal memuat data kamar");
      } finally {
        setLoading(false);
      }
    }

    fetchRooms();
  }, []);

  const handleBookingClick = async (roomId) => {
    try {
      const res = await fetch(
        `/api/user/payment/request-book/get-status/${roomId}`
      );
      const data = await res.json();

      if (data.status === "PENDING_APPROVAL") {
        router.push(`/dashboard/booking-waiting?room_id=${roomId}`);
      } else {
        router.push(`/dashboard/pembayaran/${roomId}`);
      }
    } catch (err) {
      console.error("Gagal cek status booking:", err);
      alert("Terjadi kesalahan saat memproses booking.");
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Memuat data kamar...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500 text-center">{error}</div>;
  }

  return (
    <section className="p-8">
      <h1 className="text-3xl font-bold mb-10 text-center">
        Daftar Kamar untuk Booking
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {rooms.map((room) => (
          <Card
            key={room.id}
            className="p-0 shadow-md rounded-xl overflow-hidden"
            style={{ maxWidth: "100%" }}
          >
            <Image
              src={
                room.bathroomType === "INDOOR"
                  ? "/kamar-indor.jpg"
                  : "/kamar-outdor.jpg"
              }
              alt={`Kamar ${room.name}`}
              width={400}
              height={250}
              className="rounded-t-xl object-cover w-full h-48"
            />
            <CardHeader className="bg-indigo-600 text-white p-4">
              <CardTitle className="text-xl">Kamar {room.name}</CardTitle>
              <CardDescription>{room.desc}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <div>
                <h4 className="text-sm font-semibold mb-1">Status Kamar:</h4>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    room.status === "TERSEDIA"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {room.status}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-1">
                  Tipe Kamar Mandi:
                </h4>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {room.bathroomType}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-1">Fasilitas:</h4>
                <div className="flex flex-wrap gap-2">
                  {room.facilities.map((f, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center p-4 border-t">
              <p className="text-indigo-600 font-bold text-lg">
                {formatRupiah(room.price)}
              </p>
              {room.status === "TERSEDIA" ? (
                <button
                  onClick={() => handleBookingClick(room.id)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Booking
                </button>
              ) : (
                <button
                  disabled
                  className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed"
                  title="Kamar tidak tersedia"
                >
                  Tidak Tersedia
                </button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
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
