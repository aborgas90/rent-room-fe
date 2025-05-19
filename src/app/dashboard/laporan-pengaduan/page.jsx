"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { IconDotsVertical } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function LaporanPengaduan() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 8,
    totalPages: 1,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/management/laporan-pengajuan?status=${status}&page=${page}&limit=${limit}`
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Terjadi kesalahan saat memuat data");
      }

      setData(result.data || []);
      setPagination(
        result.totalData || {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 1,
        }
      );
    } catch (error) {
      toast.error("Gagal memuat data laporan pengaduan");
    } finally {
      setLoading(false);
    }
  };

  const handleSelesai = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/management/laporan-pengajuan/action/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal memperbarui status laporan");
      }

      toast.success("Laporan berhasil ditandai sebagai selesai");
      fetchData();
    } catch (error) {
      toast.error("Gagal menandai laporan sebagai selesai");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [status, page]);

  // const getFileUrl = (filename) => {
  //   if (!filename) return null;
  //   const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  //   return `${baseUrl.replace(/\/+$/, "")}/${filename.replace(/^\/+/, "")}`;
  // };

  return (
    <div className="container mx-auto p-9 space-y-4">
      <h1 className="text-2xl font-bold">Laporan Pengaduan</h1>
      <p className="text-muted-foreground">
        Halaman ini menampilkan laporan pengaduan yang telah diajukan oleh
        pengguna.
      </p>

      {/* Filter dengan Select dari ShadCN */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Filter Status:</span>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Pilih status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=" ">~ unselect ~</SelectItem>
            <SelectItem value="PENDING">PENDING</SelectItem>
            <SelectItem value="DONE">DONE</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <p>Memuat data ...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="flex justify-center items-center h-40">
              <p>Tidak ada data ditemukan.</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Judul</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Pemilik</TableHead>
                    <TableHead>Ruangan</TableHead>
                    <TableHead>Lampiran</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {(pagination.page - 1) * pagination.limit + index + 1}
                      </TableCell>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.owner_name}</TableCell>
                      <TableCell>{item.room_number || "-"}</TableCell>
                      <TableCell>
                        {item.filename ? (
                          <a
                            href={item.filename}
                            className="text-blue-600 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Lihat
                          </a>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(item.createdAt).toLocaleDateString("id-ID")}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium
      ${
        item.status === "DONE"
          ? "bg-green-100 text-emerald-700"
          : item.status === "PENDING"
          ? "bg-red-100 text-amber-700"
          : "bg-gray-100 text-gray-700"
      }
    `}
                        >
                          {item.status}
                        </span>
                      </TableCell>

                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <IconDotsVertical size={20} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-green-600"
                              onClick={() => handleSelesai(item.id)}
                            >
                              Tandai Selesai
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>
      {/* Pagination Controls */}

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 flex-wrap">
        <div className="text-sm text-muted-foreground">
          Menampilkan {(pagination.page - 1) * pagination.limit + 1}-
          {Math.min(pagination.page * pagination.limit, pagination.total)} dari{" "}
          {pagination.total} laporan
        </div>

        <div className="flex flex-wrap justify-center sm:justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={pagination.page === 1}
          >
            Sebelumnya
          </Button>

          <div className="flex items-center space-x-1">
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
                    variant={
                      pagination.page === pageNum ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              }
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPage((p) => Math.min(pagination.totalPages, p + 1))
            }
            disabled={pagination.page >= pagination.totalPages}
          >
            Berikutnya
          </Button>
        </div>
      </div>
    </div>
  );
}
