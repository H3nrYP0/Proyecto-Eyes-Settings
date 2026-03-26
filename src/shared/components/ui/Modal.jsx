import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";

export default function Modal({
  open,
  type = "info", // "info" | "warning"
  title,
  message,
  confirmText = "Aceptar",
  cancelText = "Cancelar",
  showCancel = true,
  onConfirm,
  onCancel,
  children,
}) {
  const getIconColor = () => {
    switch (type) {
      case "warning":
        return "error";
      case "info":
      default:
        return "primary";
    }
  };

  const IconComponent = type === "warning" ? WarningIcon : InfoIcon;

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        sx: { borderRadius: 3, p: 2, minWidth: 450 },
      }}
    >
      {/* Header con título e ícono de cerrar */}
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconComponent color={getIconColor()} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <IconButton onClick={onCancel} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Contenido del mensaje */}
      <DialogContent dividers sx={{ py: 3 }}>
         {message ? (
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
        ) : (
          children // Aquí se renderiza el formulario
        )}
      </DialogContent>

      {/* Botones de acción */}
      <DialogActions sx={{ px: 3, pb: 2 }}>
        {showCancel && (
          <Button
            onClick={onCancel}
            variant="outlined"
            color="inherit"
            sx={{ borderRadius: 2 }}
          >
            {cancelText}
          </Button>
        )}
        <Button
          onClick={onConfirm}
          variant="contained"
          color={getIconColor()}
          sx={{ borderRadius: 2 }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
