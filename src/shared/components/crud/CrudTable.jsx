import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Typography,
  CircularProgress,
  Button,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import { useState, useRef } from "react";
import CrudActions from "../ui/CrudActions";
import Modal from "../ui/Modal";

export default function UnifiedCrudTable({
  columns = [],
  data = [],
  actions = [],
  loading = false,
  emptyMessage = "No hay registros.",
  onChangeStatus,
  // Nuevas props para paginación externa (opcionales)
  totalCount = null,
  page = 0,
  onPageChange = null,
  rowsPerPage = 10,
  onRowsPerPageChange = null,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [newStatus, setNewStatus] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  // Estados internos (usados solo si no hay paginación externa)
  const [internalPage, setInternalPage] = useState(0);
  const [internalRowsPerPage, setInternalRowsPerPage] = useState(10);

  const scrollRef = useRef(null);

  // Determinar si se usa paginación externa
  const useExternalPagination = totalCount !== null && onPageChange !== null;

  const activePage = useExternalPagination ? page : internalPage;
  const activeRowsPerPage = useExternalPagination ? rowsPerPage : internalRowsPerPage;

  const handleChangePage = (event, newPage) => {
    if (useExternalPagination) {
      onPageChange(event, newPage);
    } else {
      setInternalPage(newPage);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    const newRows = parseInt(event.target.value, 10);
    if (useExternalPagination) {
      onRowsPerPageChange(event);
    } else {
      setInternalRowsPerPage(newRows);
      setInternalPage(0);
    }
  };

  const handleWheel = (e) => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const canScrollH = el.scrollWidth > el.clientWidth;
    if (!canScrollH) return;
    e.preventDefault();
    el.scrollLeft += e.deltaY;
  };

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

  const visibleColumns = columns.filter((col) => col.field !== "id");
  const hasActions = actions && actions.length > 0;

  const handleStatusClick = (event, row) => {
    const estados = row.estadosDisponibles || ["activa", "inactiva"];
    setSelectedRow(row);
    if (estados.length <= 2) {
      const nuevoEstado = estados.find((e) => e !== row.estado);
      setNewStatus(nuevoEstado);
      setOpenModal(true);
    } else {
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
      case "activa":
      case "aprobado":
      case "completada":
        return "success";
      case "inactivo":
      case "inactiva":
      case "anulada":
      case "rechazado":
        case "cancelado":
          case "cancelada":
        return "error";
      case "pendiente":
        return "warning";
      default:
        return "primary";
    }
  };

  // Datos a mostrar: si hay paginación externa, no se aplica slice (ya vienen paginados del backend)
  // Si no, se aplica slice para paginación interna
  const displayData = useExternalPagination
    ? data
    : data.slice(activePage * activeRowsPerPage, activePage * activeRowsPerPage + activeRowsPerPage);

  const totalItems = useExternalPagination ? totalCount : data.length;

  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Box
          ref={scrollRef}
          onWheel={handleWheel}
          sx={{
            overflowX: "auto",
            overflowY: "hidden",
            "&::-webkit-scrollbar": { height: 6 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,0.2)",
              borderRadius: 3,
            },
          }}
        >
          <Table size="small" sx={{ minWidth: 500, tableLayout: "auto" }}>
            <TableHead>
              <TableRow>
                {visibleColumns.map((col) => (
                  <TableCell
                    key={col.field}
                    sx={{ whiteSpace: "nowrap", fontWeight: 600 }}
                  >
                    {col.header}
                  </TableCell>
                ))}
                <TableCell align="center" sx={{ whiteSpace: "nowrap", fontWeight: 600 }}>
                  Estado
                </TableCell>
                {hasActions && (
                  <TableCell align="center" sx={{ whiteSpace: "nowrap", fontWeight: 600 }}>
                    Acciones
                  </TableCell>
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {!data || data.length === 0 ? (
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
                displayData.map((row) => (
                  <TableRow key={row.id} hover>
                    {visibleColumns.map((col) => (
                      <TableCell key={col.field}>
                        {typeof col.render === "function"
                          ? col.render(row)
                          : row[col.field]}
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
                          minWidth: 85,
                          fontSize: "0.75rem",
                          whiteSpace: "nowrap",
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
        </Box>

        {/* Paginación siempre visible dentro del Paper */}
        {totalItems > 0 && (
          <TablePagination
            component="div"
            count={totalItems}
            page={activePage}
            onPageChange={handleChangePage}
            rowsPerPage={activeRowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25, 50]}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} de ${count}`
            }
            sx={{
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          />
        )}
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {selectedRow?.estadosDisponibles
          ?.filter((e) => e !== selectedRow.estado)
          .map((estado) => (
            <MenuItem key={estado} onClick={() => handleSelectStatus(estado)}>
              {estado}
            </MenuItem>
          ))}
      </Menu>

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