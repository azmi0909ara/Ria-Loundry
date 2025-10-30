"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Import Navbar secara dinamis agar tidak error SSR
const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: false });

export default function ServicePage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-blue-50">
        <p className="text-blue-600 font-semibold animate-pulse">
          Memuat halaman...
        </p>
      </main>
    );
  }

  // Daftar layanan
  const menerimaServices = [
    { name: "Cuci + Setrika", price: 6000 },
    { name: "Cuci Kering", price: 5000 },
    { name: "Cuci Basah", price: 4000 },
    { name: "Setrika Saja", price: 5000 },
  ];

  const melayaniServices = [
    { name: "Badcover Besar Tebal", price: 30000 },
    { name: "Badcover Sedang Tebal", price: 25000 },
    { name: "Seprei + Sarung Bantal Besar", price: 15000 },
    { name: "Seprei + Sarung Bantal Sedang", price: 10000 },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 text-gray-800 relative overflow-hidden flex flex-col items-center justify-start">
      <Navbar />

      {/* ======= Background Pattern ======= */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-200 via-white to-transparent opacity-40 blur-3xl"></div>

      {/* ======= Hero Section ======= */}
      <motion.div
        className="z-10 mt-24 md:mt-32 text-center px-6 max-w-3xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-700 mb-6 drop-shadow-md">
          Layanan Kami
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed mb-10">
          Kami menawarkan layanan laundry profesional dengan harga transparan.
          Pilih layanan sesuai kebutuhanmu!
        </p>
        <motion.img
          src="/laundry.png"
          alt="Laundry Services"
          className="w-56 md:w-64 mx-auto opacity-95 drop-shadow-lg"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
      </motion.div>

      {/* ======= Daftar Layanan ======= */}
      <motion.section
        className="z-10 mt-16 grid md:grid-cols-2 gap-6 max-w-5xl px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        {/* MENERIMA */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-2xl font-semibold text-blue-700 mb-4">MENERIMA</h3>
          <ul className="space-y-3">
            {menerimaServices.map((item, i) => (
              <li
                key={i}
                className="flex justify-between border-b pb-2 text-gray-700 font-medium"
              >
                <span>{item.name}</span>
                <span>Rp {item.price.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* MELAYANI */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-2xl font-semibold text-blue-700 mb-4">MELAYANI</h3>
          <ul className="space-y-3">
            {melayaniServices.map((item, i) => (
              <li
                key={i}
                className="flex justify-between border-b pb-2 text-gray-700 font-medium"
              >
                <span>{item.name}</span>
                <span>Rp {item.price.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.section>

      {/* ======= CTA ======= */}
      <motion.div
        className="z-10 mt-20 text-center px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">
          Siap merasakan layanan laundry terbaik?
        </h2>
        <a
          href="/contact"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition"
        >
          Hubungi Kami Sekarang
        </a>
      </motion.div>

      {/* ======= Footer ======= */}
      <footer className="z-10 mt-20 text-gray-500 text-sm pb-6">
        © {new Date().getFullYear()} RIA Laundry. Semua hak cipta dilindungi.
      </footer>
    </main>
  );
}
