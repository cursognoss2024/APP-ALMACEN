"use client";

import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

interface QRScannerProps {
  onScan: (value: string) => void;
}

export default function QRScanner({ onScan }: QRScannerProps) {
  const [scannerActive, setScannerActive] = useState(false);

  useEffect(() => {
    if (!scannerActive) return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: 250,
      },
      false
    );

    scanner.render(
      (decodedText) => {
        onScan(decodedText);
        scanner.clear();
        setScannerActive(false);
      },
      (error) => {
        // ignoramos errores de lectura continua
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [scannerActive]);

  return (
    <div className="bg-white p-4 rounded-xl text-black">
      {!scannerActive ? (
        <button
          onClick={() => setScannerActive(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Abrir cámara
        </button>
      ) : (
        <div id="qr-reader" className="w-full" />
      )}
    </div>
  );
}