"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface QRCodeCardProps {
  value: string;
  title: string;
}

export default function QRCodeCard({
  value,
  title,
}: QRCodeCardProps) {
  const [qrImage, setQrImage] = useState<string>("");

  useEffect(() => {
    let active = true;

    QRCode.toDataURL(value)
      .then((url) => {
        if (active) setQrImage(url);
      })
      .catch((err) => console.error(err));

    return () => {
      active = false;
    };
  }, [value]);

  return (
    <div className="bg-white rounded-xl p-6 text-center shadow-lg">
      <h3 className="text-black font-bold mb-4">
        {title}
      </h3>

      {qrImage ? (
        <img
          src={qrImage}
          alt={title}
          className="mx-auto"
        />
      ) : (
        <p className="text-black">Generando QR...</p>
      )}

      <p className="mt-4 text-sm text-gray-600">
        {value}
      </p>
    </div>
  );
}