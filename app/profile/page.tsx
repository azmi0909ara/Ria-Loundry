"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }

      setUser(currentUser);

      try {
        const qOrders = query(
          collection(db, "orders"),
          where("userId", "==", currentUser.uid)
        );
        const snapshotOrders = await getDocs(qOrders);
        const activeOrders = snapshotOrders.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        const qHistory = query(
          collection(db, "historyOrders"),
          where("userId", "==", currentUser.uid)
        );
        const snapshotHistory = await getDocs(qHistory);
        const completedOrders = snapshotHistory.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        setOrders([...activeOrders, ...completedOrders]);
      } catch (err) {
        console.error("Gagal mengambil data pesanan:", err);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (!user) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 p-6 flex flex-col items-center pt-24">
        {/* Header */}
        <motion.div
          className="w-full max-w-3xl flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-blue-700">👤 Profil Pengguna</h1>
        </motion.div>

        {/* Informasi Akun */}
        <motion.div
          className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-3xl mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="text-xl font-semibold mb-3 text-gray-700">Informasi Akun</h2>
          <div className="grid md:grid-cols-2 gap-3 text-gray-800">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>ID User:</strong> {user.uid}</p>
          </div>
        </motion.div>

        {/* Riwayat Pesanan */}
        <motion.div
          className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-3xl mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-700">📋 Riwayat Pesanan</h2>
          {orders.length === 0 ? (
            <p className="text-gray-500 text-center">Belum ada pesanan.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:bg-blue-50 transition"
                  whileHover={{ scale: 1.02 }}
                >
                  <div>
                    <p className="font-semibold text-blue-700">{order.layanan || "Beberapa Layanan"}</p>
                    {order.itemOrders ? (
                      <p className="text-gray-700 text-sm">
                        Total Item: {order.itemOrders.length} • Total: Rp {order.totalKeseluruhan?.toLocaleString()}
                      </p>
                    ) : (
                      <p className="text-gray-700 text-sm">{order.nama} • {order.berat || "-"} kg</p>
                    )}
                    <p className="text-gray-600 text-xs mt-1">{order.alamat}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${
                        order.status === "Menunggu"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "Sedang Diproses"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {order.status}
                    </span>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Detail
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/order")}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              + Buat Pesanan Baru
            </button>
          </div>
        </motion.div>

        <footer className="text-gray-500 text-sm">
          © {new Date().getFullYear()} RIA Laundry. Semua hak cipta dilindungi.
        </footer>

        {/* Modal Detail Pesanan */}
        <AnimatePresence>
          {selectedOrder && (
            <motion.div
              className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl p-6 w-full max-w-md text-black relative shadow-xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-bold mb-4 text-black">Detail Pesanan</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="absolute top-4 right-4 text-black font-bold hover:text-gray-700"
                >
                  ✕
                </button>

                <p><strong>Nama:</strong> {selectedOrder.nama}</p>
                <p><strong>Alamat:</strong> {selectedOrder.alamat}</p>
                <p><strong>Status:</strong> {selectedOrder.status}</p>
                <p><strong>Telepon:</strong> {selectedOrder.telp || "-"}</p>

                {selectedOrder.itemOrders ? (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Daftar Layanan:</h3>
                    {selectedOrder.itemOrders.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between mb-1 border-b pb-1">
                        <span>{item.layanan} ({item.tipe})</span>
                        <span>Rp {item.total.toLocaleString()}</span>
                      </div>
                    ))}
                    <p className="mt-2 font-semibold text-right">
                      Total Keseluruhan: Rp {selectedOrder.totalKeseluruhan?.toLocaleString()}
                    </p>
                  </div>
                ) : (
                  <p className="mt-2">Berat: {selectedOrder.berat || "-"} kg</p>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
