"use client";

import Image from "next/image";

/**
 * The 3-image banner shown at the top of each menu category. If no images are
 * provided (none in /public/menu/<slug>/) it renders a clean gradient
 * placeholder so the layout always looks intentional.
 */
export function CategoryBanner({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  if (images.length === 0) {
    return (
      <div
        className="flex h-24 items-center justify-center rounded-2xl text-3xl opacity-90"
        style={{
          background:
            "linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%)",
        }}
      >
        🧇
      </div>
    );
  }

  return (
    <div className="grid h-24 grid-cols-3 gap-1.5">
      {images.map((src, i) => (
        <div
          key={src}
          className="relative overflow-hidden rounded-2xl bg-gray-100"
        >
          <Image
            src={src}
            alt={`${alt} ${i + 1}`}
            fill
            sizes="(max-width: 768px) 33vw, 160px"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
