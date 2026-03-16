// src/features/compras/pages/productos/components/StockCell.jsx
import { Chip, Box } from "@mui/material";
import "../Products.css";

export default function StockCell({ item }) {
  const isLowStock = item.stockActual <= item.stockMinimo;
  
  return (
    <Box className="stock-cell">
      <span>{item.stockActual}</span>
      {isLowStock && (
        <Chip
          label="Bajo stock"
          size="small"
          className="stock-badge"
        />
      )}
    </Box>
  );
}