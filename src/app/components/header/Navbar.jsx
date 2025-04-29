"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border- px-5 py-2 shadow-sm bg-sky-500 text-white">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo & Brand Name */}
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src="/homelogo.png" alt="Logo" />
            <AvatarFallback>PK</AvatarFallback>
          </Avatar>
          <h1 className="text-lg font-bold">Poniran Kost</h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-4">
              {[
                { label: "Home", href: "/" },
                { label: "Room", href: "/room" },
                { label: "Fasility", href: "/fasility" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.href}
                      className="text-sm font-medium hover:underline"
                    >
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Auth Buttons */}
          <div className="flex items-center gap-2 ml-4">
            <Link href="/auth/login">
              <Button
                variant="outline"
                className="bg-white text-sky-500 hover:bg-sky-100"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-white text-sky-500 hover:bg-sky-100">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white focus:outline-none"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-2 space-y-2 px-4">
          {[
            { label: "Home", href: "/" },
            { label: "Room", href: "/room" },
            { label: "Fasility", href: "/fasility" },
            { label: "About Us", href: "/about" },
            { label: "Contact", href: "/contact" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block text-sm font-medium hover:underline"
            >
              {item.label}
            </Link>
          ))}
          <div className="flex gap-2 mt-2">
            <Link href="/login" className="w-full">
              <Button
                variant="outline"
                className="w-full bg-white text-sky-500 hover:bg-sky-100"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/register" className="w-full">
              <Button className="w-full bg-white text-sky-500 hover:bg-sky-100">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
