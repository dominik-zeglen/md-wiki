import { useState, useCallback } from "react";

export interface GalleryImage {
  alt: string;
  src: string;
}

export function useGallery() {
  const [gallery, setGallery] = useState({
    open: false,
    index: 0,
    images: [] as GalleryImage[],
  });

  const open = !!gallery.open;

  const openGallery = useCallback(
    ({ src, alt }: GalleryImage, images: GalleryImage[]) =>
      setGallery({
        open: true,
        index: images.findIndex((img) => img.src === src && img.alt === alt)!,
        images,
      }),
    []
  );

  const onClose = useCallback(() => {
    setGallery({
      open: false,
      index: 0,
      images: [] as GalleryImage[],
    });
  }, []);

  const previous = useCallback(() => {
    if (gallery.open) {
      setGallery((prevGallery) => ({
        ...prevGallery,
        index:
          (prevGallery.index === 0
            ? prevGallery.images.length
            : prevGallery.index) - 1,
      }));
    }
  }, [gallery.open]);

  const next = useCallback(() => {
    if (gallery.open) {
      setGallery((prevGallery) => ({
        ...prevGallery,
        index: (prevGallery.index + 1) % prevGallery.images.length,
      }));
    }
  }, [gallery.open]);

  return {
    open,
    openGallery,
    onClose,
    next,
    previous,
    current: gallery.images[gallery.index],
    images: gallery.images,
  };
}
