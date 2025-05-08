// components/ui/user/ChangePasswordDialog.tsx
"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function ChangePasswordDialog({ open, setOpen, onSubmit }) {
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    if (password.length < 6) {
      alert("Password minimal 6 karakter");
      return;
    }
    onSubmit(password);
    setPassword("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ubah Password</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-password" className="text-right">
              Password Baru
            </Label>
            <Input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Simpan Password</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


