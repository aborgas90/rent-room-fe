import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const DeleteTransactionDialog = ({
  open,
  setOpen,
  transactionId,
  onSuccess,
}) => {
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `/api/management/laporan-keuangan/transaksi-table/delete/${transactionId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Gagal menghapus transaksi");

      toast.success("Transaksi berhasil dihapus");
      onSuccess();
      setOpen(false);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Gagal menghapus transaksi");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Konfirmasi Hapus</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600">
          Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak
          dapat dibatalkan.
        </p>
        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteTransactionDialog;
