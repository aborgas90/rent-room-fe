"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function UserFormDialog({
  open,
  setOpen,
  onSubmit,
  formData,
  setFormData,
  mode = "create",
}) {
  const isEdit = mode === "edit";
  const fields = ["name", "email", "password", "telephone", "nik", "address"];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Ubah Akun" : "Tambah Akun"}</DialogTitle>
          {isEdit && (
            <DialogDescription>
              Perbarui informasi pengguna di bawah ini.
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {fields.map((field) => {
            if (isEdit && field === "password") return null; // Hide on edit
            return (
              <div key={field} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={field} className="text-right capitalize">
                  {field}
                </Label>
                <Input
                  id={field}
                  type={field === "password" ? "password" : "text"}
                  value={formData[field] || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [field]: e.target.value,
                    }))
                  }
                  readOnly={isEdit && field === "email"}
                  className={`col-span-3 ${
                    isEdit && field === "email"
                      ? "bg-gray-100 cursor-not-allowed"
                      : ""
                  }`}
                />
              </div>
            );
          })}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Role</Label>
            <Select
              value={formData.roles_name || ""}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, roles_name: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Role" />
              </SelectTrigger>
              <SelectContent>
                {["admin", "super_admin", "member", "out_member"].map(
                  (role) => (
                    <SelectItem key={role} value={role}>
                      {role.replace("_", " ").toUpperCase()}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onSubmit}>
            {isEdit ? "Simpan Perubahan" : "Buat Akun"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
