"use client";

import { useState } from "react";
import QRScanner from "../components/QRScanner";
import { useLocationStore } from "../lib/useLocationStore";
import { db } from "../lib/firebase";

import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export default function Home() {
  const { currentLocation, setLocation } = useLocationStore();
  const [pendingMove, setPendingMove] = useState<any | null>(null);

  const handleScan = async (value: string) => {
    try {
      // 🧼 LIMPIEZA ROBUSTA DEL QR
      const rawValue = value;

      const cleanValue = value
        .replace(/[\n\r\t]/g, "")
        .replace(/\s+/g, "")
        .trim();

      console.log("📷 RAW:", rawValue);
      console.log("📷 CLEAN:", cleanValue);

      // 📍 UBICACIONES
      if (cleanValue.startsWith("USAC-LOC")) {
        const q = query(
          collection(db, "locations"),
          where("code", "==", cleanValue)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          alert("⚠️ Ubicación no existe: " + cleanValue);
          return;
        }

        const locationData = snapshot.docs[0].data();

        setLocation(locationData.code);

        console.log("📍 LOCATION OK:", locationData);

        alert("📍 Ubicación activa: " + locationData.code);

        return;
      }

      // 📦 ARTÍCULOS
      if (cleanValue.startsWith("USAC-ITEM")) {
        console.log("📦 BUSCANDO ITEM:", cleanValue);

        const q = query(
          collection(db, "items"),
          where("code", "==", cleanValue)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          alert("⚠️ Artículo no existe: " + cleanValue);
          return;
        }

        const itemData = snapshot.docs[0].data();

        console.log("📦 ITEM ENCONTRADO:", itemData);

        if (!currentLocation) {
          alert("⚠️ Primero escanea una ubicación");
          return;
        }

        console.log("📍 UBICACIÓN ACTUAL:", currentLocation);

        if (itemData.locationCode === currentLocation) {
           setPendingMove(null);

            alert("✅ Correcto: está en esta ubicación");
        }  else {
           setPendingMove({
           ...itemData,
          currentLocation,
        });

  alert(
    `⚠️ Está en otra ubicación:\n${itemData.locationCode}\nActual: ${currentLocation}`
  );
}

        return;
      }

      alert("QR no reconocido: " + cleanValue);

    } catch (error: any) {
      console.error("🔥 ERROR FIREBASE:", error);
      alert("Error: " + error.message);
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

      <p>PRUEBA</p>
    </main>
  );
}