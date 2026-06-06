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

  const [pendingMove, setPendingMove] = useState<any>(null);
  const [loadingMove, setLoadingMove] = useState(false);

  const handleScan = async (value: string) => {
    try {
      const cleanValue = value
        .replace(/[\n\r\t]/g, "")
        .replace(/\s+/g, "")
        .trim();

      console.log("📷 SCAN:", cleanValue);

      // 📍 UBICACIONES
      if (cleanValue.startsWith("USAC-LOC")) {
        const q = query(
          collection(db, "locations"),
          where("code", "==", cleanValue)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          alert("⚠️ Ubicación no existe");
          return;
        }

        const locationData = snapshot.docs[0].data();

        setLocation(locationData.code);
        setPendingMove(null);

        alert("📍 Ubicación activa: " + locationData.code);

        return;
      }

      // 📦 ITEMS
      if (cleanValue.startsWith("USAC-ITEM")) {
        const q = query(
          collection(db, "items"),
          where("code", "==", cleanValue)
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
          setPendingMove(null);
          alert("✅ Correcto: está en esta ubicación");
        } else {
          setPendingMove({
            ...itemData,
          });

          alert(
            `⚠️ Está en otra ubicación:\n${itemData.locationCode}\nActual: ${currentLocation}`
          );
        }

        return;
      }

      alert("QR no reconocido: " + cleanValue);

    } catch (error: any) {
      console.error(error);
      alert("Error: " + error.message);
    }
  };

  const confirmMove = async () => {
    if (!pendingMove || !currentLocation) return;

    try {
      setLoadingMove(true);

      const q = query(
        collection(db, "items"),
        where("code", "==", pendingMove.code)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        alert("Artículo no encontrado");
        return;
      }

      const docRef = snapshot.docs[0].ref;

      await docRef.update({
        locationCode: currentLocation,
      });

      alert("✅ Artículo movido correctamente");

      setPendingMove(null);

    } catch (error: any) {
      console.error(error);
      alert("Error moviendo artículo: " + error.message);
    } finally {
      setLoadingMove(false);
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

      {pendingMove && (
        <div className="p-4 bg-yellow-700 rounded-xl mt-6">
          <h3 className="text-xl font-bold mb-2">
            ⚠️ Mover artículo
          </h3>

          <p><strong>{pendingMove.name}</strong></p>
          <p>Código: {pendingMove.code}</p>
          <p>Ubicación actual: {pendingMove.locationCode}</p>
          <p>Nueva ubicación: {currentLocation}</p>

          <div className="flex gap-4 mt-4">
            <button
              onClick={confirmMove}
              disabled={loadingMove}
              className="bg-green-600 px-4 py-2 rounded"
            >
              {loadingMove ? "Moviendo..." : "SI, MOVER"}
            </button>

            <button
              onClick={() => setPendingMove(null)}
              className="bg-red-600 px-4 py-2 rounded"
            >
              NO
            </button>
          </div>
        </div>
      )}

    </main>
  );
}