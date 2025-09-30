'use client';

import { useState } from 'react';

async function compressImage(file: File, maxDim = 512, quality = 0.35): Promise<Blob> {
  const img = document.createElement('img');
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = dataUrl;
  });

  const { width, height } = img;
  const scale = Math.min(1, maxDim / Math.max(width, height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const blob: Blob = await new Promise((resolve) => canvas.toBlob(b => resolve(b as Blob), 'image/jpeg', quality));
  return blob;
}

export default function ProfileImageUploader({ currentUrl }: { currentUrl?: string | null }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | undefined>(currentUrl || undefined);

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      // Compress heavily on the client
      const compressed = await compressImage(file, 512, 0.35);
      const uploadFile = new File([compressed], 'profile.jpg', { type: 'image/jpeg' });
      const form = new FormData();
      form.append('file', uploadFile);

      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Upload failed');

      const url = data.url as string;
      // Server already saved the image URL to the user's profile.
      setPreview(url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="vercel-card p-4 rounded-[10px] flex items-center gap-4">
      <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <span className="text-white/70 text-sm">No image</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <label className="vercel-button inline-flex items-center justify-center px-4 py-2 cursor-pointer">
          <input type="file" accept="image/*" className="hidden" onChange={onChange} />
          {uploading ? 'Uploading…' : 'Upload new image'}
        </label>
        {error && <p className="text-red-400 text-xs mt-2 truncate">{error}</p>}
      </div>
    </div>
  );
}
