"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RoomCard() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await fetch("/api/list-rooms");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        const formattedRooms = data.data
          .filter((room) => !room.is_deleted)
          .map((room) => ({
            room_id: room.room_id,
            room_name: room.room_number,
            description: room.description,
            status: room.status,
            bathroomType: room.bathroomType,
            price: room.price,
            facilities: room.facilities.map((f) => f.facilities_name),
          }));
        setRooms(formattedRooms);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRooms();
  }, []);

  if (loading)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-72 h-96 bg-gray-100 rounded-2xl animate-pulse"
          ></div>
        ))}
      </div>
    );

  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 p-6"
        id="room"
      >
        {rooms.map((room) => (
          <Card
            key={room.room_id}
            className="w-72 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden border border-gray-200"
          >
            <CardHeader className="bg-indigo-600 text-white p-4">
              <CardTitle className="text-xl">Kamar {room.room_name}</CardTitle>
              <CardDescription className="text-indigo-100 line-clamp-2">
                {room.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    room.status === "TERSEWA" || room.status === "TERKUNCI"
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {room.status}
                </span>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {room.bathroomType}
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Facilities:</h4>
                <div className="flex flex-wrap gap-2">
                  {room.facilities.map((facility, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center p-4 border-t">
              <p className="text-lg font-bold text-indigo-600">
                {room.price ? formatRupiah(room.price) : "Contact for price"}
              </p>
              {room.status === "TERSEWA" || room.status === "TERKUNCI" ? (
                <button
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
                  disabled
                >
                  Booked
                </button>
              ) : (
                <Link href="/auth/login">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Book Now
                  </button>
                </Link>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}

function formatRupiah(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}
