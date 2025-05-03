"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { IconAlertTriangle, IconDotsVertical } from "@tabler/icons-react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/management/users?role=${roleFilter === "all" ? "" : roleFilter}`
        );
        const data = await response.json();
        setUsers(data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [roleFilter]);

  const handleDeleteUser = async (userId) => {
    try {
      // 1. Get token from cookies
      const token = Cookies.get("token");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      // 2. Decode token to get current user info
      const decodedToken = jwtDecode(token);
      const currentUserId = decodedToken.user_id;
      const currentUserRoles = decodedToken.roles || [];

      // 3. Check if user has delete privileges
      const isAdmin = currentUserRoles.includes("admin");
      const isSuperAdmin = currentUserRoles.includes("super_admin");

      if (!isAdmin && !isSuperAdmin) {
        toast.error("You need admin privileges to delete users");
        return;
      }

      // 4. Prevent deleting self
      if (currentUserId === userId) {
        toast.error("You cannot delete your own account");
        return;
      }

      // 5. Get target user data
      const userToDelete = users.find((user) => user.user_id === userId);
      if (!userToDelete) {
        toast.error("User not found");
        return;
      }

      // 6. Prevent deleting super admin
      if (userToDelete.roles?.includes("super_admin")) {
        toast.error("Super admin accounts cannot be deleted");
        return;
      }

      // 7. Ask for confirmation
      const confirmDelete = await new Promise((resolve) => {
        toast.custom((t) => (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <IconAlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Delete User Account
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  Are you sure you want to permanently delete{" "}
                  {userToDelete.name}'s account ({userToDelete.email})?
                </p>
                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toast.dismiss(t);
                      resolve(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      toast.dismiss(t);
                      resolve(true);
                    }}
                  >
                    Confirm Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ));
      });

      if (!confirmDelete) return;

      // 8. Proceed with deletion
      const response = await fetch(`/api/management/users/delete/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete user");
      }

      // 9. Update UI
      setUsers((prev) => prev.filter((user) => user.user_id !== userId));
      toast.success(`${userToDelete.name} was deleted successfully`);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.message || "An error occurred while deleting the user");
    }
  };

  const filteredUsers = users.filter((user) => {
    const roleMatch =
      roleFilter === "all" ||
      (roleFilter === "super_admin" && user.roles?.includes("super_admin")) ||
      (roleFilter === "admin" && user.roles?.includes("admin")) ||
      (roleFilter === "member" && user.roles?.includes("member")) ||
      (roleFilter === "out_member" && user.roles?.includes("out_member"));

    const searchMatch =
      searchTerm === "" ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.telephone && user.telephone.includes(searchTerm));

    return roleMatch && searchMatch;
  });

  const renderRoleBadge = (roles) => {
    if (roles?.includes("super_admin")) {
      return <Badge className="bg-purple-500 text-white">Super Admin</Badge>;
    }
    if (roles?.includes("admin")) {
      return <Badge className="bg-red-500 text-white">Admin</Badge>;
    }
    if (roles?.includes("out_member")) {
      return <Badge className="bg-gray-200 text-gray-800">Out Member</Badge>;
    }
    return <Badge className="bg-blue-500 text-white">Member</Badge>;
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="super_admin">Super Admins</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
              <SelectItem value="member">Members</SelectItem>
              <SelectItem value="out_member">Out Members</SelectItem>
            </SelectContent>
          </Select>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="whitespace-nowrap">Add New User</Button>
            </DialogTrigger>
            <DialogContent>
              <div className="p-4">User creation form would appear here</div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="p-4 text-center">Loading users...</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.telephone || "N/A"}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {user.address || "N/A"}
                    </TableCell>
                    <TableCell>{renderRoleBadge(user.roles)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <IconDotsVertical size={20} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
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
                  <TableCell colSpan={6} className="h-24 text-center">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default UserListPage;
