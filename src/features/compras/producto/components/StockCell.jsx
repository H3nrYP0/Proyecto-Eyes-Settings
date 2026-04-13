// src/features/compras/pages/producto/components/StockCell.jsx
import { Box, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";

const getStatusColor = (statusType) => {
  switch (statusType) {
    case 'out':
      return { bg: '#ffebee', text: '#c62828' };
    case 'low':
      return { bg: '#fff3e0', text: '#ed6c02' };
    case 'optimal':
      return { bg: '#e8f5e9', text: '#2e7d32' };
    default:
      return { bg: '#f5f5f5', text: '#000000' };
  }
};

const StockNumber = styled(Box)(({ status }) => {
  const colors = getStatusColor(status);
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 500,
    padding: '2px 8px',
    borderRadius: '16px',
    minWidth: '45px',
    fontSize: '0.75rem',
    backgroundColor: colors.bg,
    color: colors.text,
  };
});

const getStockStatus = (stockActual, stockMinimo) => {
  if (stockActual <= 0) return { status: 'out' };
  if (stockActual <= stockMinimo) return { status: 'low' };
  return { status: 'optimal' };
};

const getStatusMessage = (status, stockActual, stockMinimo) => {
  switch (status) {
    case 'out':
      return 'Producto agotado. No hay unidades disponibles.';
    case 'low':
      return `Stock bajo: ${stockActual} unidad(es) restante(s). Mínimo recomendado: ${stockMinimo}.`;
    default:
      return `Stock óptimo: ${stockActual} unidad(es) disponible(s).`;
  }
};

export default function StockCell({ item }) {
  const { stockActual, stockMinimo } = item;
  const { status } = getStockStatus(stockActual, stockMinimo);
  const message = getStatusMessage(status, stockActual, stockMinimo);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Tooltip title={message} arrow placement="top">
        <StockNumber status={status}>{stockActual}</StockNumber>
      </Tooltip>
    </Box>
  );
}