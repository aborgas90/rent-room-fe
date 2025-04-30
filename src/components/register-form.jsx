"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@radix-ui/react-checkbox";
import { CheckboxTerms } from "./ui/checkbox-term";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const registerSchema = z.object({
  name: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  telephone: z.string().min(1, "Telephone is required"),
  address: z.string().min(1, "Address is required"),
});

export function RegisterForm({ className, ...props }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    telephone: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      registerSchema.parse(formData);
      setErrors({});
      setLoading(true);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      console.log(res, " APANICHH");

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Registration failed");
      }

      toast.success("Registered successfully");
      router.push("/auth/login");
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors(err.flatten().fieldErrors);
      } else {
        toast.error(err.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <div className="flex flex-col items-center gap-4">
            {/* <Image src="/logo.png" alt="Logo" width={60} height={60} /> */}
            <div className="text-center">
              <CardTitle className="text-3xl">Create Account</CardTitle>
              <CardDescription>
                Let's get started. Fill in the details below to create your
                account.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name[0]}</p>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email[0]}</p>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="telephone">Telephone</Label>
                <Input
                  id="telephone"
                  type="text"
                  placeholder="e.g. 08123456789"
                  value={formData.telephone}
                  onChange={handleChange}
                />
                {errors.telephone && (
                  <p className="text-sm text-red-500">{errors.telephone[0]}</p>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Jl. Harapan Bangsa"
                  value={formData.address}
                  onChange={handleChange}
                />
                {errors.address && (
                  <p className="text-sm text-red-500">{errors.address[0]}</p>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password[0]}</p>
                )}
              </div>
              <CheckboxTerms />
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Registering..." : "Register"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have account?{" "}
                <a href="/auth/login" className="underline underline-offset-4">
                  Sign in
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
