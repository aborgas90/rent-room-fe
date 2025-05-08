// components/ui/user/UserTableRow.js
"use client";

import { TableRow, TableCell } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconDotsVertical } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";

const renderRoleBadge = (roles) => {
  if (roles?.includes("super_admin"))
    return <Badge className="bg-purple-500">Super Admin</Badge>;
  if (roles?.includes("admin"))
    return <Badge className="bg-red-500">Admin</Badge>;
  if (roles?.includes("out_member"))
    return <Badge className="bg-gray-400">Out Member</Badge>;
  return <Badge className="bg-blue-500">Member</Badge>;
};

export default function UserTableRow({
  user,
  onEdit,
  onDelete,
  setSelectedUser,
  setPasswordDialogOpen,
}) {
  return (
    <TableRow key={String(user.user_id)}>
      <TableCell>{user.user_id}</TableCell>
      <TableCell>{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.telephone || "N/A"}</TableCell>
      <TableCell>{user.address || "N/A"}</TableCell>
      <TableCell>{user.nik || "N/A"}</TableCell>
      <TableCell>{renderRoleBadge(user.roles)}</TableCell>
      <TableCell className="text-right">
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
            <DropdownMenuItem onClick={() => onEdit(user)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-500"
              onClick={() => onDelete(user.user_id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
