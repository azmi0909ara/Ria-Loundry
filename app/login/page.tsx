"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const adminUID = "gfkUKI35DgclN2lrQQYTrurF04g2"; // UID admin

  const handleLogin = async () => {
    setErrorMsg("");
    setLoading(true);

    try {
      // ======= Login Admin via Firebase Auth =======
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (user.uid === adminUID) {
          router.push("/admin");
          return;
        }
      } catch (err) {
        // Admin login gagal, lanjut cek Firestore user
        console.log("Admin login failed:", err);
      }

      // ======= Login User via Firestore =======
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        const firestorePassword = userData.password?.trim();

        if (firestorePassword === password) {
          localStorage.setItem("user", JSON.stringify(userData));
          router.push("/profile");
        } else {
          setErrorMsg("Password salah!");
        }
      } else {
        setErrorMsg("Email tidak ditemukan!");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg("Terjadi kesalahan saat login!");
    }

    setLoading(false);
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#93c5fd,_transparent_50%)] opacity-60 blur-3xl"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_#bfdbfe,_transparent_50%)] opacity-60 blur-3xl"></div>

      {/* Back Button */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-blue-700 font-medium hover:text-blue-900 transition"
      >
        <ArrowLeft size={20} />
        <span>Kembali</span>
      </button>

      {/* Login Card */}
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
          Selamat Datang 👋
        </motion.h1>
        <p className="text-gray-600 mb-8 text-sm">
          Masuk untuk melanjutkan layanan{" "}
          <span className="font-semibold text-blue-700">RIA Laundry</span>
        </p>

        {/* Form Input */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-xl border border-gray-300 text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-xl border border-gray-300 text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            onChange={(e) => setPassword(e.target.value)}
          />

          {errorMsg && <p className="text-red-500 text-sm -mt-2">{errorMsg}</p>}

          <motion.button
            onClick={handleLogin}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-md"
            }`}
          >
            {loading ? "Memproses..." : "Login"}
          </motion.button>
        </motion.div>

        {/* Register Link */}
        <div className="mt-6 text-sm text-gray-600">
          Belum punya akun?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Daftar di sini
          </Link>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 rounded-b-3xl"></div>
      </motion.div>

      {/* Floating Illustration */}
      <motion.img
        src="/laundry.png"
        alt="Laundry Illustration"
        className="absolute bottom-10 right-10 w-40 opacity-70 hidden md:block"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </main>
  );
}
