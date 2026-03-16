// src/features/compras/pages/productos/components/ChatBotPresentational.jsx
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box
} from "@mui/material";
import SmartToyIcon from '@mui/icons-material/SmartToy';

export default function ChatBotPresentational({
  open,
  step,
  onClose,
  onNext,
  onConfirm,
  onNewProduct
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SmartToyIcon color="primary" />
        <span>Asistente de Productos</span>
      </DialogTitle>
      <DialogContent dividers>
        {step === 1 && (
          <Box sx={{ py: 2 }}>
            <Typography variant="body1" gutterBottom>
              🤖 ¿Este producto ya existe físicamente en tu inventario?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              (Ej: Es un producto que ya tienes en la tienda, comprado anteriormente)
            </Typography>
          </Box>
        )}

        {step === 2 && (
          <Box sx={{ py: 2 }}>
            <Typography variant="body1" gutterBottom>
              ✅ Serás redirigido al formulario completo
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Podrás ingresar todos los datos del producto incluyendo stock, precios de compra y venta.
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} size="small">Cancelar</Button>
        {step === 1 ? (
          <>
            <Button onClick={onNewProduct} color="secondary" size="small">
              No, es nuevo
            </Button>
            <Button onClick={onNext} variant="contained" color="primary" size="small">
              Sí, ya existe
            </Button>
          </>
        ) : (
          <Button 
            onClick={onConfirm} 
            variant="contained" 
            color="primary"
            size="small"
          >
            Ir al formulario completo
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}