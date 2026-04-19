// src/features/compras/producto/hooks/useImageGallery.js
import { useState, useCallback } from 'react';

export const useImageGallery = (images) => {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = images.map(img => ({ src: img.url }));

  const handleOpen = useCallback((index = 0) => {
    setCurrentIndex(index);
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleViewChange = useCallback(({ index }) => {
    setCurrentIndex(index);
  }, []);

  return {
    open,
    currentIndex,
    slides,
    total: slides.length,
    handleOpen,
    handleClose,
    handleViewChange,
  };
};