"use client";

import QRCode from "react-qr-code";

interface QRCodeCardProps {
  value: string;
  title: string;
}

export default function QRCodeCard({ value, title }: QRCodeCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 text-center shadow-lg">
      <h3 className="text-black font-bold mb-4">
        {title}
      </h3>

      <div className="mx-auto bg-white p-4 w-fit">
        <QRCode value={value} size={160} />
      </div>

      <p className="mt-4 text-sm text-gray-600">
        {value}
      </p>
    </div>
  );
}