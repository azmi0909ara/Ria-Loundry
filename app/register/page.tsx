"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    setErrorMsg("");

    // Validasi form
    if (!name || !email || !password || !confirmPass) {
      setErrorMsg("Semua kolom harus diisi!");
      return;
    }
    if (password !== confirmPass) {
      setErrorMsg("Password dan konfirmasi tidak cocok!");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Buat akun di Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2️⃣ Update displayName di Auth
      await updateProfile(user, { displayName: name });

      // 3️⃣ Simpan data lengkap di Firestore
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name,
        email,
        password, // Simpan password plaintext (lebih aman pakai hash jika produksi)
        role: "user",
        createdAt: serverTimestamp(),
      });

      router.push("/login");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Gagal mendaftar, coba lagi!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#93c5fd,_transparent_50%)] opacity-60 blur-3xl"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_#bfdbfe,_transparent_50%)] opacity-60 blur-3xl"></div>

      {/* Tombol Back */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-blue-700 font-medium hover:text-blue-900 transition"
      >
        <ArrowLeft size={20} />
        <span>Kembali</span>
      </button>

      {/* Register Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-8 md:p-10 w-full max-w-sm text-center"
      >
        <motion.h1
          className="text-3xl font-bold text-blue-700 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Buat Akun Baru 🧺
        </motion.h1>
        <p className="text-gray-600 mb-8 text-sm">
          Daftar dan nikmati kemudahan layanan{" "}
          <span className="font-semibold text-blue-700">RIA Laundry</span>
        </p>

        {/* Form Input */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <input type="text" placeholder="Nama Lengkap" className="w-full p-3 rounded-xl border border-gray-300 text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none" onChange={(e) => setName(e.target.value)} />
          <input type="email" placeholder="Email" className="w-full p-3 rounded-xl border border-gray-300 text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" className="w-full p-3 rounded-xl border border-gray-300 text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none" onChange={(e) => setPassword(e.target.value)} />
          <input type="password" placeholder="Konfirmasi Password" className="w-full p-3 rounded-xl border border-gray-300 text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none" onChange={(e) => setConfirmPass(e.target.value)} />

          {errorMsg && <p className="text-red-500 text-sm -mt-2">{errorMsg}</p>}

          <motion.button
            onClick={handleRegister}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold transition ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-md"}`}
          >
            {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
          </motion.button>
        </motion.div>

        <div className="mt-6 text-sm text-gray-600">
          Sudah punya akun? <Link href="/login" className="text-blue-600 hover:underline">Masuk di sini</Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 rounded-b-3xl"></div>
      </motion.div>

      <motion.img src="/laundry.png" alt="Laundry Illustration" className="absolute bottom-10 right-10 w-40 opacity-70 hidden md:block" animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
    </main>
  );
}
