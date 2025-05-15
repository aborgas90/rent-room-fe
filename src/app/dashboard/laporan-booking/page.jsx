"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { IconDotsVertical } from "@tabler/icons-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function LaporanPengajuanBookingPage() {
  const [pendingBookings, setPendingBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const fetchPending = async () => {
    try {
      const res = await fetch("/api/management/laporan-booking/pending");
      const json = await res.json();
      setPendingBookings(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      toast.error("Gagal memuat data pending.");
      setPendingBookings([]);
    }
  };

  const fetchAll = async (page = 1) => {
    try {
      const res = await fetch(
        `/api/management/laporan-booking?page=${page}&pageSize=10`
      );
      const json = await res.json();
      setAllBookings(Array.isArray(json.data) ? json.data : []);
      setPagination(json.pagination || { page: 1, totalPages: 1 });
    } catch (err) {
      toast.error("Gagal memuat data semua booking.");
      setAllBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
    fetchAll(page);
  }, [page]);

  const handleConfirmAction = async () => {
    if (actionType === "reject" && note.trim() === "") {
      toast.error("Mohon isi alasan penolakan.");
      return;
    }

    try {
      const endpoint = `/api/management/laporan-booking/action/${actionType}/${selectedId}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: actionType === "reject" ? JSON.stringify({ notes : note }) : undefined,
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(
          `Booking berhasil di${actionType === "approve" ? "setujui" : "tolak"}`
        );
        setOpen(false);
        setNote("");
        await fetchPending();
        await fetchAll(page);
      } else {
        toast.error(
          data.message || "Terjadi kesalahan saat memproses tindakan."
        );
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat mengirim aksi.");
    }
  };

  return (
    <div className="container mx-auto p-9 space-y-8">
      <h1 className="text-xl font-bold text-center">
        Laporan Pengajuan Booking
      </h1>

      {/* Tabel Pending */}
      <section>
        <h2 className="font-semibold text-lg mb-2">
          Pengajuan Menunggu Persetujuan
        </h2>
        {loading ? (
          <p className="text-sm text-muted-foreground">Memuat data...</p>
        ) : pendingBookings.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Tidak ada pengajuan menunggu.
          </p>
        ) : (
          <div className="overflow-x-auto border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>No. Handphone</TableHead>
                  <TableHead>No. Kamar</TableHead>
                  <TableHead>Periode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingBookings.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.user_name || "-"}</TableCell>
                    <TableCell>{item.user_email || "-"}</TableCell>
                    <TableCell>{item.telephone || "-"}</TableCell>
                    <TableCell>{item.room_number}</TableCell>
                    <TableCell>
                      {formatDate(item.start_rent)} -{" "}
                      {formatDate(item.end_rent)}
                    </TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <IconDotsVertical size={20} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedId(item.id);
                              setSelectedBooking(item);
                              setActionType("approve");
                              setOpen(true);
                            }}
                          >
                            Setujui
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedId(item.id);
                              setSelectedBooking(item);
                              setActionType("reject");
                              setOpen(true);
                            }}
                          >
                            Tolak
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>

      {/* Tabel Riwayat */}
      <section>
        <h2 className="font-semibold text-lg mb-2">
          Riwayat Booking yang Diproses
        </h2>
        {allBookings.filter((b) => b.status !== "PENDING_APPROVAL").length ===
        0 ? (
          <p className="text-sm text-muted-foreground">
            Belum ada riwayat booking.
          </p>
        ) : (
          <div className="overflow-x-auto border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>No. Kamar</TableHead>
                  <TableHead>Periode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Alasan Penolakan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allBookings
                  .filter((item) => item.status !== "PENDING_APPROVAL")
                  .map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.user_name || "User"}</TableCell>
                      <TableCell>{item.room_number || item.room_id}</TableCell>
                      <TableCell>
                        {formatDate(item.start_rent)} -{" "}
                        {formatDate(item.end_rent)}
                      </TableCell>
                      <TableCell>{item.status}</TableCell>
                      <TableCell>{item.notes || "-"}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        )}
        <div className="flex flex-wrap justify-center sm:justify-end gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(1, pagination.page - 1))}
            disabled={pagination.page === 1}
          >
            Sebelumnya
          </Button>

          {Array.from(
            { length: Math.min(5, pagination.totalPages) },
            (_, i) => {
              let pageNum;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (pagination.page <= 3) {
                pageNum = i + 1;
              } else if (pagination.page >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = pagination.page - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={pagination.page === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            }
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPage(Math.min(pagination.totalPages, pagination.page + 1))
            }
            disabled={pagination.page >= pagination.totalPages}
          >
            Berikutnya
          </Button>
        </div>
      </section>

      {/* Dialog */}
      <Dialog
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          if (!val) {
            setNote("");
            setSelectedId(null);
            setActionType(null);
            setSelectedBooking(null);
          }
        }}
      >
        <DialogContent>
          <DialogTitle>Konfirmasi Aksi</DialogTitle>
          <DialogDescription className="mb-4">
            Apakah Anda yakin ingin{" "}
            <span className="font-semibold">
              {actionType === "approve" ? "menyetujui" : "menolak"}
            </span>{" "}
            booking kamar{" "}
            <span className="font-semibold">
              {selectedBooking?.room?.room_number || selectedBooking?.room_id}
            </span>{" "}
            oleh{" "}
            <span className="font-semibold">
              {selectedBooking?.user?.name || "User"}
            </span>
            ?
          </DialogDescription>

          {actionType === "reject" && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Alasan Penolakan
              </label>
              <textarea
                className="w-full border rounded-md px-3 py-2 text-sm"
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Tuliskan alasan penolakan di sini..."
              ></textarea>
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button onClick={() => setOpen(false)} variant="outline">
              Batal
            </Button>
            <Button
              onClick={handleConfirmAction}
              variant={actionType === "approve" ? "success" : "destructive"}
            >
              Lanjutkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
