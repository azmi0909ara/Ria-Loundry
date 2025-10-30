"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import dynamic from "next/dynamic";

// Import Navbar secara dinamis agar tidak bentrok dengan SSR
const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: false });

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  // Pastikan halaman hanya dirender setelah di client
  useEffect(() => {
    setIsClient(true);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  if (!isClient) {
    // Hindari render di server agar tidak terjadi mismatch
    return (
      <main className="min-h-screen flex items-center justify-center bg-blue-50">
        <p className="text-blue-600 font-semibold animate-pulse">
          Memuat halaman...
        </p>
      </main>
    );
  }

  return (
    <main className="pt-24 min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 text-center flex flex-col items-center justify-center relative overflow-hidden">
  <Navbar />

      {/* ======= Background Pattern ======= */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-200 via-white to-transparent opacity-50 blur-3xl"></div>

      {/* ======= Hero Section ======= */}
      <motion.div
        className="z-10 flex flex-col items-center justify-center px-6 mt-24 md:mt-32"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-700 mb-3 drop-shadow-md">
          RIA Laundry
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mb-8 leading-relaxed">
          Layanan laundry cepat, bersih, dan terpercaya.  
          Pesan dari rumah, kami jemput dan antar kembali cucianmu 💧
        </p>

        {/* Tombol Aksi */}
        <div className="flex gap-4 mb-10">
          <Link href="/order">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Pesan Sekarang
            </motion.button>
          </Link>

          {!user ? (
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-100 transition"
              >
                Login
              </motion.button>
            </Link>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleLogout}
              className="border border-red-500 text-red-500 px-6 py-3 rounded-lg hover:bg-red-100 transition"
            >
              Logout ({user.email})
            </motion.button>
          )}
        </div>

        {/* Gambar Ilustrasi */}
        <motion.img
          src="/laundry.png"
          alt="Laundry Illustration"
          className="w-56 md:w-64 mx-auto opacity-95 drop-shadow-lg"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
      </motion.div>

      {/* ======= Fitur / Keunggulan ======= */}
      <motion.section
        className="z-10 mt-20 max-w-4xl grid md:grid-cols-3 gap-6 px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        {[
          {
            title: "Jemput & Antar",
            desc: "Kami menjemput cucianmu langsung ke rumah dan mengantarnya kembali setelah bersih.",
            icon: "🚚",
          },
          {
            title: "Cepat & Bersih",
            desc: "Layanan cuci cepat dengan hasil bersih, harum, dan rapi setiap kali.",
            icon: "🧺",
          },
          {
            title: "Mudah Dipesan",
            desc: "Pesan langsung dari website ini tanpa ribet, kapan saja dan di mana saja.",
            icon: "📱",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
          >
            <div className="text-4xl mb-3">{item.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-blue-700">
              {item.title}
            </h3>
            <p className="text-gray-600 text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* ======= Footer ======= */}
      <footer className="z-10 mt-20 text-gray-500 text-sm pb-6">
        © {new Date().getFullYear()} RIA Laundry. Semua hak cipta dilindungi.
      </footer>
    </main>
  );
}
