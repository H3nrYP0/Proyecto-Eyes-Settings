import { useRef, useCallback } from "react";

export function useActionBlocker() {
  const isProcessingRef = useRef(false);

  const execute = useCallback(async (action, ...args) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    try {
      return await action(...args);
    } finally {
      isProcessingRef.current = false;
    }
  }, []);

  const isProcessing = useCallback(() => isProcessingRef.current, []);

  return { execute, isProcessing };
}