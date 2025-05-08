// hooks/useUserForm.js
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";

const userSchema = z.object({
  name: z.string().min(1, { message: "Nama harus diisi" }),
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Password harus minimal 6 karakter" }),
  roles_name: z.enum(["member", "admin", "super_admin", "out_member"], {
    message: "Role yang dipilih tidak valid",
  }),
  telephone: z.string().optional(),
  address: z.string().optional(),
  nik: z.string().optional(),
});

export const useUserForm = (initialData = {}) => {
  const [formData, setFormData] = useState(initialData);

  const validate = () => {
    try {
      return userSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const msg = error.errors.map((e) => e.message).join("\n");
        toast.error(`Form tidak valid:\n${msg}`);
      } else {
        toast.error(error.message);
      }
      throw error;
    }
  };

  return { formData, setFormData, validate };
};
