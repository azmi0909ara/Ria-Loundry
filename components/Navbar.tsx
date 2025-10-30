"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Menu, X, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // 🔐 Cek user login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 🌫️ Ubah background saat scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    router.push("/");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Service", href: "/service" },
  ];

  return (
    <nav
       className={`fixed top-0 w-full z-50 transition-all duration-300 ${
    scrolled
      ? "bg-white/90 shadow-sm backdrop-blur-md"
      : "bg-white/50 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* 🔷 Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold text-blue-600 tracking-tight"
        >
          RIA Laundry
        </Link>

        {/* 🌐 Menu Desktop */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-gray-700 font-medium hover:text-blue-600 transition ${
                pathname === link.href ? "text-blue-600 font-semibold" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* 🔒 Auth Links */}
          {!user ? (
            <Link
              href="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Login
            </Link>
          ) : (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
              >
                <User size={18} /> Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-500 font-medium hover:text-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* 📱 Tombol Menu Mobile */}
        <button
          className="md:hidden text-blue-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Menu Mobile Dropdown */}
{isOpen && (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="md:hidden bg-white border-t border-blue-100 py-3 space-y-3 w-full text-left"
  >
    {navLinks.map((link) => (
      <Link
        key={link.name}
        href={link.href}
        className={`block px-6 text-gray-700 font-medium hover:text-blue-600 transition ${
          pathname === link.href ? "text-blue-600 font-semibold" : ""
        }`}
        onClick={() => setIsOpen(false)}
      >
        {link.name}
      </Link>
    ))}

    {!user ? (
      <Link
        href="/login"
        className="block px-6 text-blue-600 font-semibold"
        onClick={() => setIsOpen(false)}
      >
        Login
      </Link>
    ) : (
      <>
        <Link
          href="/profile"
          className="block px-6 text-gray-700 hover:text-blue-600"
          onClick={() => setIsOpen(false)}
        >
          Profile
        </Link>
        <button
          onClick={handleLogout}
          className="block text-red-500 px-6"
        >
          Logout
        </button>
      </>
    )}
  </motion.div>
)}

    </nav>
  );
}
