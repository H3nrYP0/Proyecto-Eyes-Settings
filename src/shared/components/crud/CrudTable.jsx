import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import CrudActions from "../ui/CrudActions";
import Modal from "../ui/Modal";

export default function UnifiedCrudTable({
  columns = [],
  data = [],
  actions = [],
  loading = false,
  emptyMessage = "No hay registros.",
  onChangeStatus,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [newStatus, setNewStatus] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  if (loading) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress size={24} />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Cargando...
        </Typography>
      </Paper>
    );
  }

  const visibleColumns = columns.filter(col => col.field !== "id");
  const hasActions = actions && actions.length > 0;

  // 🔹 CLICK EN BOTÓN
  const handleStatusClick = (event, row) => {
    const estados = row.estadosDisponibles || ["activo", "inactivo"];

    setSelectedRow(row);

    if (estados.length <= 2) {
      // CAMBIO DIRECTO (SIN MENÚ)
      const nuevoEstado = estados.find(e => e !== row.estado);
      setNewStatus(nuevoEstado);
      setOpenModal(true);
    } else {
      // MÁS DE 2 → ABRE MENÚ
      setAnchorEl(event.currentTarget);
    }
  };

  const handleSelectStatus = (estado) => {
    setNewStatus(estado);
    setAnchorEl(null);
    setOpenModal(true);
  };

  const handleConfirmStatus = () => {
    if (onChangeStatus && selectedRow && newStatus) {
      onChangeStatus(selectedRow, newStatus);
    }
    setOpenModal(false);
    setSelectedRow(null);
    setNewStatus(null);
  };

  const getStatusColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case "activo":
      case "aprobado":
        return "success";
      case "inactivo":
      case "rechazado":
        return "error";
      case "pendiente":
        return "warning";
      default:
        return "primary";
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {visibleColumns.map(col => (
                <TableCell key={col.field}>
                  {col.header}
                </TableCell>
              ))}

              <TableCell align="center">Estado</TableCell>

              {hasActions && (
                <TableCell align="center">Acciones</TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {(!data || data.length === 0) ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumns.length + 2}
                  align="center"
                  sx={{ py: 6 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map(row => (
                <TableRow key={row.id} hover>
                  {visibleColumns.map(col => (
                    <TableCell key={col.field}>
                      {typeof col.render === "function"
                        ? col.render(row)
                        : row[col.field]
                      }
                    </TableCell>
                  ))}

                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="outlined"
                      color={getStatusColor(row.estado)}
                      onClick={(e) => handleStatusClick(e, row)}
                      sx={{
                        textTransform: "capitalize",
                        minWidth: 110
                      }}
                    >
                      {row.estado}
                    </Button>
                  </TableCell>

                  {hasActions && (
                    <TableCell align="center">
                      <CrudActions actions={actions} item={row} />
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 🔹 MENÚ SOLO SI HAY MÁS DE 2 ESTADOS */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {selectedRow?.estadosDisponibles
          ?.filter(e => e !== selectedRow.estado)
          .map((estado) => (
            <MenuItem
              key={estado}
              onClick={() => handleSelectStatus(estado)}
            >
              {estado}
            </MenuItem>
        ))}
      </Menu>

      {/* 🔹 ALERTA CONFIRMACIÓN */}
      <Modal
        open={openModal}
        type="warning"
        title="Confirmar cambio de estado"
        message={`¿Seguro que deseas cambiar el estado a "${newStatus}"?`}
        confirmText="Confirmar"
        cancelText="Cancelar"
        showCancel
        onConfirm={handleConfirmStatus}
        onCancel={() => setOpenModal(false)}
      />
    </>
  );
}
