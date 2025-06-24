"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { IconAlertTriangle, IconDotsVertical } from "@tabler/icons-react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { z } from "zod";
import UserFormDialog from "../../components/master/user/UserFormDialog"; // you can split dialog into a separate file
import ChangePasswordDialog from "@/app/components/master/user/resetPasswordDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const baseSchema = z.object({
  name: z.string().min(1, { message: "Nama harus diisi" }),
  email: z.string().email({ message: "Email tidak valid" }),
  roles_name: z.enum(["member", "admin", "super_admin", "out_member"], {
    message: "Role yang dipilih tidak valid",
  }),
  telephone: z.string().optional(),
  address: z.string().optional(),
  nik: z.string().optional(),
});

const createUserSchema = baseSchema.extend({
  password: z.string().min(6, { message: "Password harus minimal 6 karakter" }),
});

const editUserSchema = baseSchema.extend({
  password: z.string().optional(),
});

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [formData, setFormData] = useState({});
  const [dialogState, setDialogState] = useState({
    open: false,
    mode: "create",
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const debouncedSearch = useDebounce(searchTerm, 1000);

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, debouncedSearch, currentPage]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        role: roleFilter === "all" ? "" : roleFilter,
        search: searchTerm,
        page: currentPage.toString(),
        limit: pageSize.toString(),
      }).toString();

      const res = await fetch(`/api/management/users?${query}`);
      const data = await res.json();
      setUsers(data.data);
      setTotalPages(data.pagination.totalPages || 1);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUser = async () => {
    try {
      setLoading(true);
      const schema =
        dialogState.mode === "edit" ? editUserSchema : createUserSchema;
      const payload = schema.parse(formData);
      if (dialogState.mode === "edit" && !payload.password) {
        delete payload.password; // remove empty password field
      }
      const url =
        dialogState.mode === "edit"
          ? `/api/management/users/update/${selectedUser.user_id}`
          : "/api/management/users/create";
      const method = dialogState.mode === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Gagal menyimpan pengguna");

      toast.success(
        `Pengguna berhasil ${
          dialogState.mode === "edit" ? "diperbarui" : "ditambahkan"
        }`
      );
      await fetchUsers();
      closeDialog();
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(err.errors.map((e) => e.message).join("\n"));
      } else {
        toast.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return toast.error("Authentication required");
      const decoded = jwtDecode(token);
      const currentUserRoles = decoded.roles || [];
      const isPrivileged =
        currentUserRoles.includes("admin") ||
        currentUserRoles.includes("super_admin");
      if (!isPrivileged || decoded.user_id === userId)
        return toast.error("Tidak diizinkan");

      const userToDelete = users.find((u) => u.user_id === userId);
      if (userToDelete?.roles?.includes("super_admin"))
        return toast.error("Tidak bisa hapus super admin");

      const confirmed = await new Promise((resolve) => {
        toast.custom((t) => (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border">
            <div className="flex gap-3 items-start">
              <IconAlertTriangle className="text-red-500 mt-1" />
              <div>
                <p className="font-semibold">Hapus {userToDelete.name}?</p>
                <p className="text-sm text-gray-500">Yakin ingin menghapus?</p>
                <div className="flex justify-end gap-2 mt-3">
                  <Button
                    onClick={() => {
                      toast.dismiss(t);
                      resolve(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      toast.dismiss(t);
                      resolve(true);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ));
      });
      if (!confirmed) return;

      const res = await fetch(`/api/management/users/delete/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Gagal menghapus");
      setUsers((prev) => prev.filter((u) => u.user_id !== userId));
      toast.success("User deleted");
    } catch (e) {
      toast.error(e.message || "Error deleting user");
    }
  };

  const handleChangePassword = async (newPassword) => {
    try {
      console.log(newPassword);
      if (!selectedUser) return;

      const res = await fetch(
        `/api/management/users/reset-password/${selectedUser.user_id}`,
        {
          method: "PUT", // ✅ Tambahkan ini
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: newPassword }),
        }
      );

      if (!res.ok) throw new Error("Gagal mengubah password");
      toast.success("Password berhasil diubah");
    } catch (err) {
      toast.error(err.message || "Gagal mengubah password");
    }
  };

  const filteredUsers = users.filter((u) => {
    const roleMatch = roleFilter === "all" || u.roles?.includes(roleFilter);
    const searchMatch =
      searchTerm === "" ||
      [u.name, u.email, u.telephone].some((field) =>
        field?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return roleMatch && searchMatch;
  });

  const openDialog = (mode, user = null) => {
    setDialogState({ open: true, mode });
    setSelectedUser(user);
    setFormData(
      user
        ? {
            name: user.name,
            email: user.email,
            password: "",
            roles_name: user.roles?.[0] || "",
            telephone: user.telephone || "",
            address: user.address || "",
            nik: user.nik || "",
          }
        : {}
    );
  };

  const closeDialog = () => {
    setDialogState({ open: false, mode: "create" });
    setFormData({});
    setSelectedUser(null);
  };

  const renderRoleBadge = (roles) => {
    const role = roles?.[0];

    const colorMap = {
      super_admin: "bg-purple-500",
      admin: "bg-red-500",
      out_member: "bg-gray-400",
      member: "bg-blue-500",
    };

    const roleLabelMap = {
      super_admin: "Pengembang Aplikasi",
      admin: "Pemilik Kost",
      member: "Penghuni Kost",
      out_member: "Bukan Penghuni Kost",
    };

    return (
      <Badge className={`${colorMap[role] || "bg-slate-300"} text-white`}>
        {roleLabelMap[role] || role?.replace("_", " ")}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-9 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => {
              setCurrentPage(1);
              setSearchTerm(e.target.value);
            }}
          />
          <Select
            onValueChange={(value) => {
              setCurrentPage(1);
              setRoleFilter(value);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="super_admin">Pengembang Aplikasi</SelectItem>
              <SelectItem value="admin">Pemilik Kost</SelectItem>
              <SelectItem value="member">Penghuni Kost</SelectItem>
              <SelectItem value="out_member">Bukan Penghuni Kost</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => openDialog("create")}>Tambah Akun Baru</Button>
        </div>
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="rounded-md border">
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Id</TableHead>
                <TableHead className="w-[140px]">Name</TableHead>
                <TableHead className="w-[180px]">Email</TableHead>
                <TableHead className="w-[120px]">Phone</TableHead>
                <TableHead className="w-[200px]">Address</TableHead>
                <TableHead className="w-[120px]">NIK</TableHead>
                <TableHead className="w-[100px]">Peran</TableHead>
                <TableHead className="w-[90px] text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell>{user.user_id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.telephone || "N/A"}</TableCell>
                    <TableCell className="max-w-[160px] truncate">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>{user.address || "N/A"}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{user.address || "N/A"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>{user.nik || "N/A"}</TableCell>
                    <TableCell>{renderRoleBadge(user.roles)}</TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <IconDotsVertical size={20} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
                              setPasswordDialogOpen(true);
                            }}
                          >
                            Ubah Password
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDialog("edit", user)}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500"
                            onClick={() => handleDeleteUser(user.user_id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      {/* Pagination responsif */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
        <div className="text-sm text-muted-foreground text-center sm:text-left">
          Menampilkan {(currentPage - 1) * pageSize + 1}-
          {Math.min(currentPage * pageSize, totalPages * pageSize)} dari{" "}
          {totalPages * pageSize} pengguna
        </div>

        <div className="flex flex-wrap justify-center sm:justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Sebelumnya
          </Button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
          >
            Berikutnya
          </Button>
        </div>
      </div>

      <UserFormDialog
        open={dialogState.open}
        setOpen={(open) => setDialogState((prev) => ({ ...prev, open }))}
        mode={dialogState.mode}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSaveUser}
        onClose={closeDialog}
      />
      <ChangePasswordDialog
        open={passwordDialogOpen}
        setOpen={setPasswordDialogOpen}
        onSubmit={handleChangePassword}
      />
    </div>
  );
};

export default UserListPage;
