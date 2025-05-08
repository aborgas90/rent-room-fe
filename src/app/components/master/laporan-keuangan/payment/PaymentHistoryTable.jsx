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

const PaymentHistoryTable = ({
  data,
  loading,
  statusFilter,
  onStatusFilterChange,
}) => {
  // Filter berdasarkan status jika bukan "ALL"
  const filteredData =
    statusFilter === "ALL"
      ? data
      : data.filter((item) => item.status === statusFilter);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">Riwayat Pembayaran</h2>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua</SelectItem>
            <SelectItem value="PAID">DIBAYAR</SelectItem>
            <SelectItem value="CANCELLED">DIBATALKAN</SelectItem>
            <SelectItem value="PENDING">TERTUNDA</SelectItem>
            <SelectItem value="EXPIRED">KADALUARSA</SelectItem>
            <SelectItem value="REFUNDED">DANA DIKEMBALIKAN</SelectItem>
            <SelectItem value="CHALLENGE">BUTUH VERIFIKASI</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kamar</TableHead>
              <TableHead>Nama Penyewa</TableHead>
              <TableHead>Email Penyewa</TableHead>
              <TableHead>Nomor Penyewa</TableHead>
              <TableHead>Tanggal</TableHead>
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
    </div>
  );
};

export default PaymentHistoryTable;
