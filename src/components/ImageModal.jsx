import React from 'react';
import { X } from 'lucide-react';

/**
 * ImageModal displays a full‑size image in a centered overlay.
 * Props:
 *  - imageUrl: string (URL or data URI of the image to display)
 *  - onClose: () => void (callback to close the modal)
 */
export default function ImageModal({ imageUrl, onClose }) {
  if (!imageUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative max-w-full max-h-full p-4">
        <button
          onClick={onClose}
          className="absolute -right-2 -top-2 rounded-full bg-white/80 p-1 text-slate-600 hover:bg-white shadow-md"
        >
          <X size={20} />
        </button>
        <img
          src={imageUrl}
          alt="Wishlist item"
          className="max-w-screen-md max-h-screen-md object-contain rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
}
