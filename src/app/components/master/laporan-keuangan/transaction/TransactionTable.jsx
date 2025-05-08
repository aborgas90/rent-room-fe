import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import moment from "moment";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDotsVertical } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AddTransactionDialog from "./tambah-transaction/ AddTransactionDialog";
import EditTransactionDialog from "./edit-transaction/EditTransactionDialog";
import DeleteTransactionDialog from "./delete-transaction/DeleteTransactionDialog";

const TransactionTable = ({
  data,
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  loading,
  onReload,
}) => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const filtered = data.filter(
    (item) =>
      item.description?.toLowerCase().includes(search.toLowerCase()) ||
      item.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <h2 className="text-xl font-semibold">Laporan Transaksi</h2>
        <div className="flex gap-2">
          {/* <Input
            placeholder="Cari keterangan atau kategori..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          /> */}
          <Select value={typeFilter} onValueChange={onTypeFilterChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter Jenis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua</SelectItem>
              <SelectItem value="PEMASUKAN">Pemasukan</SelectItem>
              <SelectItem value="PENGELUARAN">Pengeluaran</SelectItem>
            </SelectContent>
          </Select>
          <AddTransactionDialog onSubmit={onReload} />
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Jenis</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Keterangan</TableHead>
              <TableHead>Jumlah (Rp)</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : filtered.length > 0 ? (
              filtered.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    {moment(item.transaction_date).format("DD/MM/YYYY HH:mm")}
                  </TableCell>
                  <TableCell className="capitalize">{item.type}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>
                    {Number(item.amount).toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
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
                          className="text-red-600"
                          onClick={() => {
                            setSelectedTransaction(item.transaction_id);
                            setDeleteOpen(true);
                          }}
                        >
                          Hapus
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="text-blue-600"
                          onClick={() => {
                            setSelectedTransaction(item);
                            setEditOpen(true);
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Tidak ada data ditemukan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <EditTransactionDialog
        open={editOpen}
        setOpen={setEditOpen}
        transaction={selectedTransaction}
        onSuccess={() => {
          setEditOpen(false);
          setSelectedTransaction(null);
          onReload();
        }}
      />

      <DeleteTransactionDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        transactionId={selectedTransaction}
        onSuccess={() => {
          setDeleteOpen(false);
          setSelectedTransaction(null);
          onReload();
        }}
      />
    </div>
  );
};

export default TransactionTable;
