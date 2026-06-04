"use client";

import QRScanner from "../components/QRScanner";

import { useLocationStore } from "../lib/useLocationStore";
import { db } from "../lib/firebase";

function QRCodeCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-slate-300 break-all">{value}</p>
    </div>
  );
}

import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export default function Home() {
  const { currentLocation, setLocation } = useLocationStore();

  const handleScan = async (value: string) => {
    try {
      // 📍 ESCANEAR UBICACIÓN
      if (value.startsWith("USAC-LOC")) {
        const q = query(
          collection(db, "locations"),
          where("code", "==", value)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          alert("⚠️ Ubicación no existe");
          return;
        }

        const locationData = snapshot.docs[0].data();

        setLocation(locationData.code);

        alert("📍 Ubicación activa: " + locationData.code);

        return;
      }

      // 📦 ESCANEAR ARTÍCULO
      if (value.startsWith("USAC-ITEM")) {
        const q = query(
          collection(db, "items"),
          where("code", "==", value)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          alert("⚠️ Artículo no existe");
          return;
        }

        const itemData = snapshot.docs[0].data();

        if (!currentLocation) {
          alert("⚠️ Primero escanea una ubicación");
          return;
        }

        if (itemData.locationCode === currentLocation) {
          alert("✅ Correcto: está en esta ubicación");
        } else {
          alert(
            `⚠️ Está en otra ubicación:\n${itemData.locationCode}\nActual: ${currentLocation}`
          );
        }

        return;
      }

      alert("QR no reconocido: " + value);

    } catch (error) {
      console.error(error);
      alert("Error conectando con Firebase: " + error);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white p-10">

      <h1 className="text-4xl font-bold mb-2">
        USAC Inventario
      </h1>

      <h2 className="text-slate-400 mb-4">
        San Juan de Ribera
      </h2>

      <div className="mb-6 p-4 bg-slate-800 rounded-xl">
        📍 Ubicación activa:{" "}
        <span className="font-bold">
          {currentLocation ?? "Ninguna"}
        </span>
      </div>

      <div className="mb-10">
        <QRScanner onScan={handleScan} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        <QRCodeCard
          title="Ubicación de prueba"
          value="USAC-LOC-000001"
        />

        <QRCodeCard
          title="Artículo de prueba"
          value="USAC-ITEM-000001"
        />

      </div>

    </main>
  );
}