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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PaymentHistoryTable = ({
  data,
  loading,
  search,
  setSearch,
  payment_method,
  setPayment_method,
  month,
  setMonth,
  year,
  setYear,
  statusFilter,
  onStatusFilterChange,
  pagination,
  setPage,
  pageSize,
}) => {
  // Filter berdasarkan status jika bukan "ALL"
  const filteredData =
    statusFilter === "ALL"
      ? data
      : data.filter((item) => item.status === statusFilter);

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h2 className="text-xl font-semibold">Riwayat Pembayaran</h2>

        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="text"
            placeholder="Cari nama, email, atau invoice..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          {/* FILTER BULAN */}
          <Select
            value={month ? String(month) : "ALL"}
            onValueChange={(val) => {
              setMonth(val === "ALL" ? null : parseInt(val));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Bulan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Bulan</SelectItem>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i + 1} value={String(i + 1)}>
                  {new Date(0, i).toLocaleString("id-ID", { month: "long" })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* FILTER TAHUN */}
          <Select
            value={year ? String(year) : "ALL"}
            onValueChange={(val) => {
              setYear(val === "ALL" ? null : parseInt(val));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Tahun" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Tahun</SelectItem>
              {[2023, 2024, 2025, 2026].map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Status</SelectItem>
              <SelectItem value="PAID">DIBAYAR</SelectItem>
              <SelectItem value="CANCELLED">DIBATALKAN</SelectItem>
              <SelectItem value="PENDING">TERTUNDA</SelectItem>
              <SelectItem value="EXPIRED">KADALUARSA</SelectItem>
              <SelectItem value="REFUNDED">DANA DIKEMBALIKAN</SelectItem>
              <SelectItem value="CHALLENGE">BUTUH VERIFIKASI</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={payment_method}
            onValueChange={(val) => {
              setPayment_method(val === "ALL" ? "" : val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter Metode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Metode</SelectItem>
              <SelectItem value="bank_transfer">Transfer Bank</SelectItem>
              <SelectItem value="gopay">GoPay</SelectItem>
              <SelectItem value="shopeepay">ShopeePay</SelectItem>
              <SelectItem value="qris">QRIS</SelectItem>
              <SelectItem value="cstore">Alfamart / Indomaret</SelectItem>
              <SelectItem value="credit_card">Kartu Kredit</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kamar</TableHead>
              <TableHead>Nama Penyewa</TableHead>
              <TableHead>Email Penyewa</TableHead>
              <TableHead>Nomor Penyewa</TableHead>
              <TableHead>Tanggal Pembayaran</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Masa Awal Sewa</TableHead>
              <TableHead>Masa Berakhir Sewa</TableHead>
              <TableHead>Metode</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Nominal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : filteredData.length > 0 ? (
              filteredData.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{item.roomNumber}</TableCell>
                  <TableCell>{item.userName}</TableCell>
                  <TableCell>{item.userEmail}</TableCell>
                  <TableCell>{item.userPhone}</TableCell>
                  <TableCell>
                    {item.waktuPembayaran
                      ? moment(item.waktuPembayaran).format("DD/MM/YYYY HH:mm")
                      : "-"}
                  </TableCell>
                  <TableCell>{item.invoice}</TableCell>
                  <TableCell>
                    {item.start_rent
                      ? moment(item.start_rent).format("DD/MM/YYYY HH:mm")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {item.end_rent
                      ? moment(item.end_rent).format("DD/MM/YYYY HH:mm")
                      : "-"}
                  </TableCell>
                  <TableCell>{item.metodePembayaran}</TableCell>
                  <TableCell className="capitalize">{item.status}</TableCell>
                  <TableCell className="text-right">
                    {Number(item.nominal).toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Tidak ada riwayat pembayaran
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
          dari {pagination.totalItems} pembayaran
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
    </div>
  );
};

export default PaymentHistoryTable;
