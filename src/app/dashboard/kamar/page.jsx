"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { IconDotsVertical } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Cookies from "js-cookie";

export default function KamarPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    room_number: "",
    price: "",
    status: "",
    description: "",
    bathType: "",
    facilities: [],
  });
  const [listFacility, setlistFacility] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editRoomId, setEditRoomId] = useState(null);
  const [OwnerName, setOwnerName] = useState("");
  const [tenantList, setTenantList] = useState([]);
  const [userMember, setUserMember] = useState("member");

  const fetchRooms = useCallback(async () => {
    try {
      const res = await fetch("/api/management/rooms");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      const formattedRooms = data.data.map((room) => {
        // Cari payment dengan status PAID
        const paidPayment = room.payments.find(
          (payment) => payment.status === "PAID"
        );

        return {
          room_id: room.room_id,
          room_name: room.room_number,
          description: room.description,
          status: room.status,
          bathroomType: room.bathroomType,
          price: room.price,
          owner_name: room.owner?.name || "-",
          facilities: room.facilities.map((f) => f.facilities_name),
          facility_ids: room.facilities.map((f) => f.facility_id),
          tenant_name: room.tenant?.name || "-",
          is_deleted: room.is_deleted,
          end_rent: paidPayment ? paidPayment.end_rent : null, // Tambahkan end_rent
        };
      });
      setRooms(formattedRooms);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const fetchListFacility = useCallback(async () => {
    if (listFacility.length > 0) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/management/rooms/facility`);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const result = await res.json();
      setlistFacility(result.data);
    } catch (error) {
      setError(error.message);
      toast.error(`Gagal Fetch Fasilitas: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [listFacility]);

  useEffect(() => {
    fetchListFacility();
  }, [fetchListFacility]);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const res = await fetch(`/api/management/users?role=${userMember}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const result = await res.json();
        // console.log("Tenant API data:", result.data);
        setTenantList(result.data);
      } catch (err) {
        toast.error("Gagal fetch penyewa: " + err.message);
      }
    };

    fetchTenants();
  }, []);

  const handleCreateRoom = async () => {
    try {
      setLoading(true);
      const payload = { ...formData };
      const response = await fetch("/api/management/rooms/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      toast.success("Kamar berhasil ditambahkan!");
      setAddDialogOpen(false);
      resetForm();
      fetchRooms();
    } catch (error) {
      toast.error(`Gagal menambahkan kamar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRoom = async (roomId, updatedRoomData) => {
    const payload = {
      room_number: updatedRoomData.room_number,
      price: updatedRoomData.price,
      status: updatedRoomData.status,
      description: updatedRoomData.description,
      facilities: updatedRoomData.facilities,
      bathType: updatedRoomData.bathType,
      owner_id: updatedRoomData.owner_id,
      tenant_id: updatedRoomData.tenant_id,
    };

    try {
      const response = await fetch(`/api/management/rooms/update/${roomId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to update room: ${response.status}`);
      }

      const result = await response.json();
      toast.success("Kamar berhasil diperbarui");
      setEditDialogOpen(false);
      fetchRooms();
    } catch (error) {
      toast.error("Gagal memperbarui kamar: " + error.message);
    }
  };

  const handleDelete = async (roomId) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kamar ini?")) return;
    try {
      const res = await fetch(`/api/management/rooms/delete/${roomId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      toast.success("Kamar berhasil dihapus!");
      fetchRooms();
    } catch (err) {
      toast.error(`Gagal menghapus kamar: ${err.message}`);
    }
  };

  const resetForm = () => {
    setFormData({
      room_number: "",
      price: "",
      status: "",
      description: "",
      bathType: "",
      facilities: [],
    });
    setEditRoomId(null);
  };

  const openEditDialog = (room) => {
    const ownerIdFromCookie = Cookies.get("owner_id");
    setFormData({
      room_number: room.room_name,
      price: room.price,
      status: room.status,
      description: room.description,
      bathType: room.bathroomType,
      facilities: room.facility_ids,
      owner_id: ownerIdFromCookie ? Number(ownerIdFromCookie) : room.owner_id,
      tenant_id: room.tenant_id,
    });
    setOwnerName(room.owner_name);
    setEditRoomId(room.room_id);
    setEditMode(true);
    setEditDialogOpen(true);
  };

  const renderDialogForm = (onSubmit, title) => (
    <>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
          Silakan isi informasi kamar di bawah ini.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        {[
          ["Nomor Kamar", "room_number"],
          ["Harga", "price", "number"],
          ["Deskripsi", "description"],
        ].map(([label, field, type = "text"]) => (
          <div key={field} className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={field}>{label}</Label>
            <Input
              id={field}
              type={type}
              value={formData[field] || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [field]:
                    type === "number" ? Number(e.target.value) : e.target.value,
                }))
              }
              className="col-span-3"
            />
          </div>
        ))}

        {editMode && (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Pemilik</Label>
              <Input
                value={OwnerName}
                disabled
                className="col-span-3 bg-gray-100"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tenant_id">Penyewa</Label>
              <Select
                value={formData.tenant_id?.toString() || ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, tenant_id: Number(value) }))
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih Penyewa" />
                </SelectTrigger>
                <SelectContent>
                  {tenantList.map((tenant) => (
                    <SelectItem
                      key={tenant.user_id}
                      value={tenant.user_id.toString()}
                    >
                      {tenant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        <div className="grid grid-cols-4 items-center gap-4">
          <Label>Status</Label>
          <Select
            value={formData.status || ""}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, status: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TERSEDIA">TERSEDIA</SelectItem>
              <SelectItem value="TERSEWA">TERSEWA</SelectItem>
              <SelectItem value="TERKUNCI">TERKUNCI</SelectItem>
              <SelectItem value="PERBAIKAN">PERBAIKAN</SelectItem>
              <SelectItem value="TIDAK_TERSEDIA">TIDAK TERSEDIA</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label>Tipe Kamar Mandi</Label>
          <Select
            value={formData.bathType || ""}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, bathType: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INDOOR">INDOOR</SelectItem>
              <SelectItem value="OUTDOOR">OUTDOOR</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-4 items-start gap-4">
          <Label className="text-right mt-2">Fasilitas</Label>
          <div className="col-span-3 space-y-2">
            {listFacility.map((facility) => (
              <div
                key={facility.facility_id}
                className="flex items-center gap-2"
              >
                <Checkbox
                  id={`facility-${facility.facility_id}`}
                  checked={formData.facilities.includes(facility.facility_id)}
                  onCheckedChange={(checked) => {
                    const id = facility.facility_id;
                    setFormData((prev) => ({
                      ...prev,
                      facilities: checked
                        ? [...prev.facilities, id]
                        : prev.facilities.filter((f) => f !== id),
                    }));
                  }}
                />
                <label
                  htmlFor={`facility-${facility.facility_id}`}
                  className="text-sm leading-none"
                >
                  {facility.facilities_name}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button onClick={onSubmit}>Simpan</Button>
      </DialogFooter>
    </>
  );

  return (
    <div className="container mx-auto p-9 space-y-4">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-lg font-semibold">Data Kamar</h2>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">Tambah Kamar</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            {renderDialogForm(handleCreateRoom, "Tambah Kamar")}
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="p-4">Loading...</div>
      ) : error ? (
        <div className="p-4 text-red-500">Error: {error}</div>
      ) : (
        <div className="overflow-x-auto rounded-md border shadow-sm">
          <Table className="min-w-full text-sm">
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Nomor Kamar</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tipe Kamar Mandi</TableHead>
                <TableHead>Pemilik</TableHead>
                <TableHead>Penyewa</TableHead>
                <TableHead>Masa Jatuh Tempo</TableHead>
                <TableHead>Fasilitas</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Soft Delete</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room, i) => (
                <TableRow key={room.room_id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{room.room_name}</TableCell>
                  <TableCell>
                    Rp {Number(room.price).toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        room.status === "TERSEDIA"
                          ? "bg-green-500 text-white"
                          : room.status === "TERSEWA"
                          ? "bg-blue-500 text-white"
                          : room.status === "TERKUNCI"
                          ? "bg-orange-500 text-white"
                          : room.status === "PERBAIKAN"
                          ? "bg-purple-500 text-white"
                          : "bg-red-500 text-white"
                      }
                    >
                      {room.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{room.bathroomType}</TableCell>
                  <TableCell>{room.owner_name}</TableCell>
                  <TableCell>{room.tenant_name}</TableCell>
                  <TableCell>
                    {room.end_rent ? (
                      <Badge
                        variant={
                          new Date(room.end_rent) < new Date()
                            ? "destructive"
                            : "default"
                        }
                      >
                        {new Date(room.end_rent).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                        {new Date(room.end_rent) < new Date() &&
                          " (Jatuh Tempo)"}
                      </Badge>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {room.facilities.map((f, i) => (
                        <Badge key={i} variant="outline">
                          {f}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {room.description}
                  </TableCell>
                  <TableCell>{room.is_deleted ? "Ya" : "Tidak"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <IconDotsVertical size={20} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(room)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(room.room_id)}
                        >
                          Hapus
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

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          {renderDialogForm(
            () => handleEditRoom(editRoomId, formData),
            "Edit Kamar"
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
