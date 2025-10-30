"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const router = useRouter();

  const adminUID = "gfkUKI35DgclN2lrQQYTrurF04g2";

  const fetchOrders = async () => {
    try {
      const snapshot = await getDocs(collection(db, "orders"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
    } catch (err) {
      console.error("Gagal mengambil data orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }
      if (currentUser.uid !== adminUID) {
        router.push("/profile");
        return;
      }
      await fetchOrders();
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const handleProcessOrder = async (orderId: string) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status: "Sedang Diproses" });
    await fetchOrders();
  };

  const handleCompleteOrder = async (orderId: string) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status: "Selesai" });
    await fetchOrders();
  };

  const handleClearOrder = async (order: any) => {
    const orderRef = doc(db, "orders", order.id);
    await addDoc(collection(db, "historyOrders"), {
      ...order,
      clearedAt: serverTimestamp(),
    });
    await deleteDoc(orderRef);
    await fetchOrders();
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700">👑 Admin Dashboard</h1>
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/admin/history")}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              History Pesanan
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Daftar Pesanan */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">📋 Semua Pesanan</h2>

          {orders.length === 0 ? (
            <p className="text-gray-500 text-center">Belum ada pesanan.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:bg-blue-50 transition"
                >
                  <div>
                    <p className="font-semibold text-blue-700">{order.layanan}</p>
                    <p className="text-gray-700 text-sm">{order.nama} • {order.berat} kg</p>
                    <p className="text-gray-600 text-xs mt-1">{order.alamat} • User ID: {order.userId}</p>
                    <p className="text-gray-500 text-xs mt-1">Status: {order.status}</p>
                  </div>
                  <div className="flex gap-2">
                    {order.status === "Menunggu" && (
                      <button
                        onClick={() => handleProcessOrder(order.id)}
                        className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition text-sm"
                      >
                        Proses
                      </button>
                    )}
                    {order.status === "Sedang Diproses" && (
                      <button
                        onClick={() => handleCompleteOrder(order.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition text-sm"
                      >
                        Selesai
                      </button>
                    )}
                    {order.status === "Selesai" && (
                      <button
                        onClick={() => handleClearOrder(order)}
                        className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition text-sm"
                      >
                        Clear
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition text-sm"
                    >
                      Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Detail Pesanan */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-lg relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Detail Pesanan</h2>
              <p><strong>Layanan:</strong> {selectedOrder.layanan}</p>
              <p><strong>Nama:</strong> {selectedOrder.nama}</p>
              <p><strong>Email User:</strong> {selectedOrder.email}</p>
              <p><strong>Berat:</strong> {selectedOrder.berat} kg</p>
              <p><strong>Alamat:</strong> {selectedOrder.alamat}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <p><strong>Dibuat:</strong> {selectedOrder.createdAt?.toDate ? selectedOrder.createdAt.toDate().toLocaleString() : "-"}</p>
              
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Tutup
              </button>
            </motion.div>
          </div>
        )}
      </div>

      <footer className="mt-10 text-gray-500 text-sm text-center">
        © {new Date().getFullYear()} RIA Laundry. Semua hak cipta dilindungi.
      </footer>
    </main>
  );
}
