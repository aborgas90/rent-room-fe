"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

// Schema validasi form
const formSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  category: z.enum(["KERUSAKAN", "KEBERSIHAN", "KEAMANAN", "LAINNYA"]),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  filename: z.instanceof(File).optional(),
});

export default function PengajuanPengaduan() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: undefined,
      description: "",
      filename: undefined,
    },
  });

  // Fetch data pengaduan
  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/user/report-problem/history");

      if (!response.ok) {
        throw new Error("Gagal memuat data pengaduan");
      }

      const { data } = await response.json();
      setReports(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Handle form submission
  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("category", values.category);
      formData.append("description", values.description);

      if (values.filename) {
        formData.append("filename", values.filename); // Using 'file' as field name for backend
      }

      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await fetch("/api/user/report-problem/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal mengirim pengaduan");
      }

      toast.success("Pengaduan berhasil dikirim");
      form.reset();
      await fetchReports(); // Refresh data
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fungsi untuk mendapatkan URL file
  const getFileUrl = (filename) => {
    if (!filename) return null;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    return `${baseUrl.replace(/\/+$/, "")}/${filename.replace(/^\/+/, "")}`;
  };

  return (
    <div className="container mx-auto p-9 space-y-4">
      <h1 className="text-2xl font-bold">Pengajuan Pengaduan</h1>
      <p className="text-muted-foreground">
        Halaman ini digunakan untuk mengajukan pengaduan.
      </p>

      {/* Form Pengajuan */}
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul Pengaduan</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan judul pengaduan"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="KERUSAKAN">Kerusakan</SelectItem>
                        <SelectItem value="KEBERSIHAN">Kebersihan</SelectItem>
                        <SelectItem value="KEAMANAN">Keamanan</SelectItem>
                        <SelectItem value="LAINNYA">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Jelaskan pengaduan Anda..."
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="filename"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lampiran (Opsional)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          field.onChange(file);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Mengirim..." : "Kirim Pengaduan"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Tabel Riwayat Pengaduan */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Riwayat Pengaduan</h2>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p>Memuat data...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Judul</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Pemilik</TableHead>
                  <TableHead>Ruangan</TableHead>
                  <TableHead>Lampiran</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.length > 0 ? (
                  reports.map((report, index) => {
                    const fileUrl = getFileUrl(report.filename);
                    return (
                      <TableRow key={report.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{report.title || "-"}</TableCell>
                        <TableCell>{report.category}</TableCell>
                        <TableCell>{report.owner_name}</TableCell>
                        <TableCell>{report.room_number}</TableCell>
                        <TableCell>
                          {fileUrl ? (
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              Lihat
                            </a>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(report.createdAt).toLocaleDateString(
                            "id-ID"
                          )}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              report.status === "DONE"
                                ? "bg-green-100 text-green-800"
                                : report.status === "PENDING"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {report.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Tidak ada data pengaduan
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
