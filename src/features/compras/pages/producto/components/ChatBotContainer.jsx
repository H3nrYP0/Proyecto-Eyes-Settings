// src/features/compras/pages/productos/components/ChatBotContainer.jsx
import { useState } from "react";
import ChatBotPresentational from "./ChatBotPresentational";

export default function ChatBotContainer({ open, onClose, onConfirmExisting }) {
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    }
  };

  const handleConfirm = () => {
    onConfirmExisting();
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  const handleNewProduct = () => {
    handleClose();
  };

  return (
    <ChatBotPresentational
      open={open}
      step={step}
      onClose={handleClose}
      onNext={handleNext}
      onConfirm={handleConfirm}
      onNewProduct={handleNewProduct}
    />
  );
}