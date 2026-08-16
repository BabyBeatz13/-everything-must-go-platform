"use client";

import { useMemo, useState } from "react";

type ProductImageGalleryProps = {
  images: string[];
  alt: string;
};

export function ProductImageGallery({ images, alt }: ProductImageGalleryProps) {
  const normalizedImages = useMemo(() => {
    const unique = new Set<string>();
    for (const image of images) {
      const value = String(image || "").trim();
      if (value) unique.add(value);
    }
    return Array.from(unique);
  }, [images]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const safeIndex = normalizedImages.length > 0 ? Math.min(currentIndex, normalizedImages.length - 1) : 0;
  const currentImage = normalizedImages[safeIndex] ?? "";

  const goPrevious = () => {
    if (normalizedImages.length <= 1) return;
    setCurrentIndex((previous) => (previous - 1 + normalizedImages.length) % normalizedImages.length);
  };

  const goNext = () => {
    if (normalizedImages.length <= 1) return;
    setCurrentIndex((previous) => (previous + 1) % normalizedImages.length);
  };

  if (!currentImage) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <img src={currentImage} alt={alt} className="h-[520px] w-full rounded-[28px] border border-white/10 object-cover" />
        {normalizedImages.length > 1 ? (
          <>
            <button
              type="button"
              onClick={goPrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/55 px-3 py-2 text-sm font-semibold text-white"
              aria-label="Previous image"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/55 px-3 py-2 text-sm font-semibold text-white"
              aria-label="Next image"
            >
              Next
            </button>
          </>
        ) : null}
      </div>

      {normalizedImages.length > 1 ? (
        <div className="grid gap-3 grid-cols-4 sm:grid-cols-5">
          {normalizedImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`overflow-hidden rounded-[16px] border ${safeIndex === index ? "border-amber-300/70" : "border-white/10"}`}
              aria-label={`View image ${index + 1}`}
            >
              <img src={image} alt={`${alt} detail ${index + 1}`} className="h-20 w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
