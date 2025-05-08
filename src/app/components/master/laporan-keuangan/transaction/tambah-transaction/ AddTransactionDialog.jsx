"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function AddTransactionDialog({ onSubmit }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    amount: "",
    type: "",
    category: "",
    description: "",
    transaction_date: new Date().toISOString().slice(0, 16),
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        "/api/management/laporan-keuangan/transaksi-table/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // ⬅️ tambahkan ini
          },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) throw new Error("Gagal simpan");

      const result = await response.json();
      if (onSubmit) onSubmit(result); // callback untuk refetch
      setOpen(false); // tutup dialog
      setForm({
        amount: "",
        type: "",
        category: "",
        description: "",
        transaction_date: new Date().toISOString().slice(0, 16),
      });
    } catch (err) {
      console.error("Error adding transaction:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">+ Tambah Transaksi</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Transaksi</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <Input
            type="number"
            placeholder="Jumlah (Rp)"
            value={form.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
          />
          <Select
            value={form.type}
            onValueChange={(val) => handleChange("type", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Jenis Transaksi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PEMASUKAN">Pemasukan</SelectItem>
              <SelectItem value="PENGELUARAN">Pengeluaran</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Kategori"
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
          />
          <Input
            placeholder="Deskripsi"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
          <Input
            type="datetime-local"
            value={form.transaction_date}
            onChange={(e) => handleChange("transaction_date", e.target.value)}
          />
          <Button className="w-full" onClick={handleSubmit}>
            Simpan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
