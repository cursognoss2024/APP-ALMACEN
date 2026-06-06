"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

interface QRScannerProps {
  onScan: (value: string) => void;
}

export default function QRScanner({ onScan }: QRScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: 250,
      },
      false
    );

    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => {
        console.log("📷 QR DETECTADO:", decodedText);

        onScan(decodedText);

        scanner.clear();
        scannerRef.current = null;
        setActive(false);
      },
      (error) => {
        // ignorar errores normales de cámara
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [active]);

  return (
    <div className="bg-white p-4 rounded-xl text-black">
      {!active ? (
        <button
          onClick={() => setActive(true)}
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