import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const EditTransactionDialog = ({ open, setOpen, transaction, onSuccess }) => {
  const [form, setForm] = useState(transaction || {});

  useEffect(() => {
    setForm(transaction || {});
  }, [transaction]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.description || !form.amount || !form.type || !form.category)
      return;

    try {
      // Kirim ke API update transaksi
      const response = await fetch(
        `/api/management/laporan-keuangan/transaksi-table/update/${form.transaction_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) throw new Error("Gagal update transaksi");

      toast.success("Transaksi berhasil diperbarui");
      onSuccess();
      setOpen(false);
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Terjadi kesalahan saat menyimpan");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Transaksi</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Keterangan
            </label>
            <Input
              placeholder="Keterangan"
              value={form.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Kategori
            </label>
            <Input
              placeholder="Kategori"
              value={form.category || ""}
              onChange={(e) => handleChange("category", e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Jumlah</label>
            <Input
              type="number"
              placeholder="Jumlah"
              value={form.amount || ""}
              onChange={(e) => handleChange("amount", e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Jenis Transaksi
            </label>
            <Select
              value={form.type || ""}
              onValueChange={(val) => handleChange("type", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Jenis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PEMASUKAN">Pemasukan</SelectItem>
                <SelectItem value="PENGELUARAN">Pengeluaran</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button onClick={handleSave}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTransactionDialog;
