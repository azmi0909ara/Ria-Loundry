"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const [loading, setLoading] = useState(true);
  const [historyOrders, setHistoryOrders] = useState<any[]>([]);
  const router = useRouter();

  const adminUID = "gfkUKI35DgclN2lrQQYTrurF04g2";

  // Ambil semua historyOrders
  const fetchHistory = async () => {
    try {
      const snapshot = await getDocs(collection(db, "historyOrders"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setHistoryOrders(data);
    } catch (err) {
      console.error("Gagal mengambil historyOrders:", err);
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

      await fetchHistory();
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700">📦 History Pesanan</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Daftar History Pesanan */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          {historyOrders.length === 0 ? (
            <p className="text-gray-500 text-center">Belum ada history pesanan.</p>
          ) : (
            <div className="space-y-4">
              {historyOrders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 transition"
                >
                  <div>
                    <p className="font-semibold text-blue-700">{order.layanan}</p>
                    <p className="text-gray-700 text-sm">
                      {order.nama} • {order.berat} kg
                    </p>
                    <p className="text-gray-600 text-xs mt-1">
                      {order.alamat} • User ID: {order.userId}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Tanggal Selesai:{" "}
                      {order.completedAt?.toDate
                        ? order.completedAt.toDate().toLocaleString()
                        : "-"}
                    </p>
                  </div>
                  <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">
                    Selesai
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="mt-10 text-gray-500 text-sm text-center">
        © {new Date().getFullYear()} RIA Laundry. Semua hak cipta dilindungi.
      </footer>
    </main>
  );
}
