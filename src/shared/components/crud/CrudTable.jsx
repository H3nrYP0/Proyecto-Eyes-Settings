import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Button,
  Menu,
  MenuItem,
  Box,
  Pagination,
  Stack,
} from "@mui/material";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import CrudActions from "../ui/CrudActions";
import Modal from "../ui/Modal";

export default function UnifiedCrudTable({
  columns = [],
  data = [],
  actions = [],
  loading = false,
  emptyMessage = "No hay registros.",
  onChangeStatus,
  showStatusColumn = true,
  // Paginación externa (server-side)
  totalCount = null,
  page = 1,           // 1-indexado
  onPageChange = null,
  rowsPerPage = 10,
  totalPages = null,  // opcional, si no se da se calcula
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [newStatus, setNewStatus] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const scrollRef = useRef(null);

  // Determinar si usamos paginación externa (server-side)
  const useExternalPagination = totalCount !== null && onPageChange !== null;

  // Calcular total de páginas
  const computedTotalPages = useMemo(() => {
    if (totalPages !== null) return totalPages;
    if (useExternalPagination && totalCount !== null) {
      return Math.ceil(totalCount / rowsPerPage);
    }
    // Paginación interna (cliente)
    return Math.ceil(data.length / rowsPerPage);
  }, [totalPages, totalCount, rowsPerPage, data.length, useExternalPagination]);

  // Manejo de cambio de página
  const handlePageChange = (event, newPage) => {
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  // Scroll horizontal con rueda
  const handleWheel = useCallback((e) => {
    const el = scrollRef.current;
    if (!el) return;
    const canScrollH = el.scrollWidth > el.clientWidth;
    if (!canScrollH) return;
    e.preventDefault();
    el.scrollLeft += e.deltaY;
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

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

  // Los datos ya vienen paginados si es externo, si es interno los cortamos
  const displayData = useExternalPagination
    ? data
    : data.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalItems = useExternalPagination ? totalCount : data.length;

  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Box
          ref={scrollRef}
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
                {visibleColumns.map((col, idx) => (
                  <TableCell
                    key={col.field || col.header || idx}
                    sx={{ whiteSpace: "nowrap", fontWeight: 600 }}
                  >
                    {col.header}
                  </TableCell>
                ))}
                {showStatusColumn && (
                  <TableCell key="header-status" align="center" sx={{ whiteSpace: "nowrap", fontWeight: 600 }}>
                    Estado
                  </TableCell>
                )}
                {hasActions && (
                  <TableCell key="header-actions" align="center" sx={{ whiteSpace: "nowrap", fontWeight: 600 }}>
                    Acciones
                  </TableCell>
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {!data || data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={visibleColumns.length + (showStatusColumn ? 1 : 0) + (hasActions ? 1 : 0)}
                    align="center"
                    sx={{ py: 6 }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {emptyMessage}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                displayData.map((row, rowIndex) => {
                  const rowKey = row.id !== undefined && row.id !== null ? `row-${row.id}` : `row-${rowIndex}`;
                  return (
                    <TableRow key={rowKey} hover>
                      {visibleColumns.map((col, colIndex) => (
                        <TableCell key={`${rowKey}-col-${col.field || colIndex}`}>
                          {typeof col.render === "function"
                            ? col.render(row)
                            : row[col.field]}
                        </TableCell>
                      ))}

                      {showStatusColumn && (
                        <TableCell key={`${rowKey}-status`} align="center">
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
                      )}

                      {hasActions && (
                        <TableCell key={`${rowKey}-actions`} align="center">
                          <CrudActions actions={actions} item={row} />
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Box>

        {totalItems > 0 && computedTotalPages > 1 && (
          <Stack alignItems="center" sx={{ py: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
            <Pagination
              count={computedTotalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="small"
              showFirstButton={false}
              showLastButton={false}
              siblingCount={1}
              boundaryCount={1}
            />
          </Stack>
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