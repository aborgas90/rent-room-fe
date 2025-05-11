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
import AddTransactionDialog from "./tambah-transaction/AddTransactionDialog";
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
  pagination,
  setPage,
  pageSize,
}) => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const filtered = Array.isArray(data)
    ? data.filter(
        (item) =>
          item.description?.toLowerCase().includes(search.toLowerCase()) ||
          item.category?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <h2 className="text-xl font-semibold">Laporan Transaksi</h2>
        <div className="flex gap-2">
          {/* Search input jika diperlukan */}
          {/* <Input placeholder="Cari..." value={search} onChange={(e) => onSearchChange(e.target.value)} /> */}
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
                          className="text-blue-600"
                          onClick={() => {
                            setSelectedTransaction(item);
                            setEditOpen(true);
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setSelectedTransaction(item.transaction_id);
                            setDeleteOpen(true);
                          }}
                        >
                          Hapus
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

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
        <div className="text-sm text-muted-foreground text-center sm:text-left">
          Menampilkan {(pagination.currentPage - 1) * pageSize + 1} -{" "}
          {Math.min(pagination.currentPage * pageSize, pagination.totalItems)}{" "}
          dari {pagination.totalItems} transaksi
        </div>

        <div className="flex flex-wrap justify-center sm:justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(1, pagination.currentPage - 1))}
            disabled={pagination.currentPage === 1}
          >
            Sebelumnya
          </Button>

          {Array.from(
            { length: Math.min(5, pagination.totalPages) },
            (_, i) => {
              let pageNum;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (pagination.currentPage <= 3) {
                pageNum = i + 1;
              } else if (pagination.currentPage >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = pagination.currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={
                    pagination.currentPage === pageNum ? "default" : "outline"
                  }
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
              setPage(
                Math.min(pagination.totalPages, pagination.currentPage + 1)
              )
            }
            disabled={pagination.currentPage >= pagination.totalPages}
          >
            Berikutnya
          </Button>
        </div>
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
