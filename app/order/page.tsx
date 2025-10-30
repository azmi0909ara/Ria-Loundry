"use client";

import { useState, useEffect } from "react";
import { db, auth } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ItemOrder {
  tipe: "Menerima" | "Melayani";
  layanan: string;
  jumlah: number; // kg untuk Menerima, pcs untuk Melayani
  hargaSatuan: number;
  total: number;
}

export default function OrderPage() {
  const router = useRouter();

  const [nama, setNama] = useState("");
  const [alamat, setAlamat] = useState("");
  const [telp, setTelp] = useState("");

  const [tipe, setTipe] = useState<"Menerima" | "Melayani">("Menerima");
  const [layanan, setLayanan] = useState("");
  const [jumlah, setJumlah] = useState<number>(1);
  const [hargaSatuan, setHargaSatuan] = useState<number>(0);
  const [itemOrders, setItemOrders] = useState<ItemOrder[]>([]);
  const [statusMsg, setStatusMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 cek login
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) router.push("/login");
    });
    return () => unsubscribe();
  }, [router]);

  // Daftar layanan & harga
  const menerima = [
    { name: "Cuci + Setrika", price: 6000 },
    { name: "Cuci Kering", price: 5000 },
    { name: "Cuci Basah", price: 4000 },
    { name: "Setrika Saja", price: 5000 },
  ];

  const melayani = [
    { name: "Badcover Besar Tebal", price: 30000 },
    { name: "Badcover Sedang Tebal", price: 25000 },
    { name: "Seprei + Sarung Bantal Besar", price: 15000 },
    { name: "Seprei + Sarung Bantal Sedang", price: 10000 },
  ];

  const handleLayananChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLayanan(e.target.value);
    let harga = 0;
    if (tipe === "Menerima") {
      const found = menerima.find((l) => l.name === e.target.value);
      if (found) harga = found.price;
    } else {
      const found = melayani.find((l) => l.name === e.target.value);
      if (found) harga = found.price;
    }
    setHargaSatuan(harga);
  };

  const handleAddItem = () => {
    if (!layanan || jumlah <= 0) return;

    const total = hargaSatuan * jumlah;
    const newItem: ItemOrder = { tipe, layanan, jumlah, hargaSatuan, total };
    setItemOrders([...itemOrders, newItem]);

    // reset input
    setLayanan("");
    setJumlah(1);
    setHargaSatuan(0);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...itemOrders];
    newItems.splice(index, 1);
    setItemOrders(newItems);
  };

  const totalKeseluruhan = itemOrders.reduce((acc, item) => acc + item.total, 0);

  const handleOrder = async () => {
    if (!nama || !alamat || !telp || itemOrders.length === 0) {
      setStatusMsg("⚠️ Lengkapi semua data dan tambahkan layanan!");
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, "orders"), {
        nama,
        alamat,
        telp,
        itemOrders,
        totalKeseluruhan,
        status: "Menunggu",
        createdAt: serverTimestamp(),
        userId: auth.currentUser?.uid,
      });
      // redirect ke profile
      router.push("/profile");
    } catch (err) {
      console.error(err);
      setStatusMsg("❌ Terjadi kesalahan, coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  // Live preview total per item
  const liveTotal = hargaSatuan * jumlah;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6 flex justify-center">
      <div className="w-full max-w-6xl flex gap-8">
        {/* Tombol Kembali */}
        <Link
          href="/"
          className="absolute top-4 left-4 text-blue-600 hover:underline font-semibold"
        >
          ← Kembali
        </Link>

        {/* ===== KIRI: Ringkasan & Total ===== */}
        <div className="w-1/2 bg-white shadow-xl rounded-2xl p-6 flex flex-col">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Ringkasan Pesanan</h2>
          {itemOrders.length === 0 ? (
            <p className="text-gray-500">Belum ada layanan ditambahkan.</p>
          ) : (
            <div className="space-y-2 flex-1 overflow-y-auto">
              {itemOrders.map((item, index) => (
                <div key={index} className="flex justify-between items-center border p-2 rounded">
                  <div>
                    <p className="font-semibold">{item.layanan}</p>
                    <p className="text-sm text-gray-600">
                      {item.tipe} • {item.jumlah} {item.tipe === "Menerima" ? "kg" : "pcs"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">Rp {item.total.toLocaleString()}</p>
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 border-t pt-4 text-right">
            <p className="text-xl font-bold">
              Total Keseluruhan: Rp {totalKeseluruhan.toLocaleString()}
            </p>
          </div>
        </div>

        {/* ===== KANAN: Form Input ===== */}
        <div className="w-1/2 bg-white shadow-xl rounded-2xl p-6 flex flex-col">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Tambah Layanan</h2>

          <input
            className="border border-gray-300 p-3 w-full mb-3 rounded focus:ring-2 focus:ring-blue-400 text-black"
            placeholder="Nama Lengkap"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
          />
          <input
            className="border border-gray-300 p-3 w-full mb-3 rounded focus:ring-2 focus:ring-blue-400 text-black"
            placeholder="Alamat Lengkap"
            value={alamat}
            onChange={(e) => setAlamat(e.target.value)}
          />
          <input
            className="border border-gray-300 p-3 w-full mb-3 rounded focus:ring-2 focus:ring-blue-400 text-black"
            placeholder="Nomor Telepon"
            value={telp}
            onChange={(e) => setTelp(e.target.value)}
          />

          <select
            className="border border-gray-300 p-3 w-full mb-3 rounded focus:ring-2 focus:ring-blue-400 text-black"
            value={tipe}
            onChange={(e) => setTipe(e.target.value as any)}
          >
            <option value="Menerima">Menerima</option>
            <option value="Melayani">Melayani</option>
          </select>

          <select
            className="border border-gray-300 p-3 w-full mb-3 rounded focus:ring-2 focus:ring-blue-400 text-black"
            value={layanan}
            onChange={handleLayananChange}
          >
            <option value="">Pilih Layanan</option>
            {(tipe === "Menerima" ? menerima : melayani).map((l, i) => (
              <option key={i} value={l.name}>
                {l.name} - Rp {l.price.toLocaleString()}
                {tipe === "Menerima" ? "/kg" : ""}
              </option>
            ))}
          </select>

          <input
            type="number"
            className="border border-gray-300 p-3 w-full mb-1 rounded focus:ring-2 focus:ring-blue-400 text-black"
            placeholder={tipe === "Menerima" ? "Berat (kg)" : "Jumlah (pcs)"}
            value={jumlah}
            onChange={(e) => setJumlah(Number(e.target.value))}
            min={1}
          />
          {layanan && (
            <p className="text-right text-gray-600 mb-3">
              Total sementara: Rp {liveTotal.toLocaleString()}
            </p>
          )}

          <button
            onClick={handleAddItem}
            className="w-full py-3 mb-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Tambah Layanan
          </button>

          <button
            onClick={handleOrder}
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Mengirim..." : "Kirim Pesanan"}
          </button>

          {statusMsg && (
            <p className="mt-3 text-center text-sm text-gray-700 animate-pulse">{statusMsg}</p>
          )}
        </div>
      </div>
    </div>
  );
}
