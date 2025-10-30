"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Import Navbar secara dinamis agar tidak error SSR
const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: false });

export default function AboutPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 text-gray-800 relative overflow-hidden flex flex-col items-center justify-start">
      <Navbar />

      {/* ======= Background Pattern ======= */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-200 via-white to-transparent opacity-40 blur-3xl"></div>

      {/* ======= Hero Section ======= */}
      <motion.div
        className="z-10 mt-24 md:mt-32 text-center px-6 max-w-3xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-700 mb-6 drop-shadow-md">
          Tentang Kami
        </h1>

        <p className="text-gray-600 text-lg leading-relaxed mb-10">
          <strong>RIA Laundry</strong> adalah layanan digital yang menghadirkan solusi
          laundry cepat, bersih, dan terpercaya. Kami memahami kesibukanmu — 
          karena itu, kami hadir untuk menjemput cucian dari rumahmu dan mengantarkannya kembali dalam kondisi rapi dan wangi.
        </p>

        <p className="text-gray-600 text-lg leading-relaxed mb-10">
          Dengan pengalaman lebih dari <strong>5 tahun</strong> di bidang laundry profesional,
          kami berkomitmen untuk memberikan layanan terbaik, menggunakan detergen berkualitas, 
          serta teknologi cuci modern agar pakaianmu tetap awet dan nyaman dipakai.
        </p>

        {/* Gambar Ilustrasi */}
        <motion.img
          src="/laundry.png"
          alt="About Laundry"
          className="w-56 md:w-64 mx-auto opacity-95 drop-shadow-lg"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
      </motion.div>

      {/* ======= Misi & Nilai ======= */}
      <motion.section
        className="z-10 mt-16 grid md:grid-cols-3 gap-6 max-w-5xl px-6 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        {[
          {
            title: "🧼 Bersih & Higienis",
            desc: "Kami menggunakan detergen ramah lingkungan dan air bersih terfilter untuk menjaga kualitas pakaian.",
          },
          {
            title: "⚡ Cepat & Efisien",
            desc: "Layanan antar jemput yang cepat, dengan waktu pengerjaan maksimal 24 jam.",
          },
          {
            title: "💙 Kepuasan Pelanggan",
            desc: "Kepuasan pelanggan adalah prioritas kami. Kami selalu terbuka terhadap saran dan masukan.",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
          >
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
