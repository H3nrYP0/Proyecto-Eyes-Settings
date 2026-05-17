import { useState, useCallback } from "react";
// Reutilizamos exactamente la misma utilidad que usa el módulo de productos.
// Así no duplicamos la config de Cloudinary.
import { UploadData } from "../../../../lib/data/uploadData";

/**
 * Hook para manejar el comprobante de transferencia (1 sola imagen).
 *
 * Devuelve:
 *  preview        — URL blob (preview local) o URL Cloudinary (ya guardada)
 *  file           — File object pendiente de subir (null si ya está subida)
 *  uploading      — boolean mientras sube
 *  error          — string | null
 *  hasChanges     — true si hay un file nuevo sin subir
 *  handleDrop(files) — llamar cuando el usuario suelta/selecciona archivos
 *  removePreview()   — limpiar todo
 *  uploadAndGetUrl() — sube a Cloudinary y devuelve la URL final
 *  setExistingUrl(url) — precarga una URL ya guardada (edición/vista)
 */
export function useComprobanteUpload() {
  const [file,      setFile]      = useState(null);
  const [preview,   setPreview]   = useState("");
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState(null);

  // Precargar URL existente (modo editar / ver)
  const setExistingUrl = useCallback((url) => {
    if (url) {
      setPreview(url);
      setFile(null);
    }
  }, []);

  // El usuario suelta o selecciona un archivo
  const handleDrop = useCallback((acceptedFiles) => {
    setError(null);
    if (!acceptedFiles || acceptedFiles.length === 0) return;

    const selected = acceptedFiles[0];

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(selected.type)) {
      setError("Solo se aceptan imágenes JPG, PNG o WebP.");
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      setError("El archivo no puede superar 5 MB.");
      return;
    }

    // Revocar blob anterior
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }, [preview]);

  // Limpiar
  const removePreview = useCallback(() => {
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview("");
    setError(null);
  }, [preview]);

  /**
   * Si hay un file pendiente, lo sube con UploadData (mismo que productos)
   * y devuelve la URL de Cloudinary.
   * Si ya es una URL guardada (sin file nuevo), la devuelve directamente.
   * Si no hay nada, devuelve "".
   */
  const uploadAndGetUrl = useCallback(async () => {
    if (!file) return preview; // ya estaba guardada o vacía

    setUploading(true);
    setError(null);
    try {
      // uploadMultipleImages recibe un array de File y devuelve array de URLs
      const urls = await UploadData.uploadMultipleImages([file]);
      const url  = urls[0];
      setPreview(url);
      setFile(null);
      return url;
    } catch (err) {
      const msg = err?.message ?? "Error al subir el comprobante.";
      setError(msg);
      throw err;
    } finally {
      setUploading(false);
    }
  }, [file, preview]);

  return {
    preview,
    file,
    uploading,
    error,
    hasChanges: !!file,
    handleDrop,
    removePreview,
    uploadAndGetUrl,
    setExistingUrl,
  };
}