// src/features/compras/pages/producto/hooks/useChatBot.js
import { useState, useCallback } from "react";

export const useChatBot = ({ onConfirmExisting, onNewProduct }) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);

  const handleOpen = useCallback(() => {
    setOpen(true);
    setStep(1);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setStep(1);
  }, []);

  const handleNext = useCallback(() => {
    if (step === 1) {
      setStep(2);
    }
  }, [step]);

  const handleConfirm = useCallback(() => {
    onConfirmExisting?.();
    handleClose();
  }, [onConfirmExisting, handleClose]);

  const handleNewProduct = useCallback(() => {
    onNewProduct?.();
    handleClose();
  }, [onNewProduct, handleClose]);

  return {
    open,
    step,
    handleOpen,
    handleClose,
    handleNext,
    handleConfirm,
    handleNewProduct
  };
};