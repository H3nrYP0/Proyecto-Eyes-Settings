// src/shared/components/crud/CrudLayout.jsx
import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Select,
  MenuItem,
  InputAdornment,
  FormControl,
  InputLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";

const BRAND_COLOR = "#1a2540";
const BRAND_HOVER = "#2d3a6b";

// Opciones de ordenamiento por defecto
const DEFAULT_SORT_OPTIONS = [
  { value: "alfabetico_asc", label: "Alfabético A → Z" },
  { value: "alfabetico_desc", label: "Alfabético Z → A" },
  { value: "nuevo", label: "Más nuevo primero" },
  { value: "viejo", label: "Más viejo primero" },
  { value: "precio_asc", label: "Precio (menor a mayor)" },
  { value: "precio_desc", label: "Precio (mayor a menor)" },
];

export default function CrudLayout({
  title,
  description,
  onAddClick,
  children,

  showSearch = false,
  searchPlaceholder = "Buscar...",
  searchValue = "",
  onSearchChange = null,
  searchFilters = null,
  filterEstado = "",
  onFilterChange = null,

  // Nuevas props para ordenamiento (se muestra al lado del filtro)
  showSort = false,
  sortValue = "",
  onSortChange = null,
  sortOptions = DEFAULT_SORT_OPTIONS,
}) {
  const [internalSearch, setInternalSearch] = useState("");
  const [internalFilter, setInternalFilter] = useState("");
  const [internalSort, setInternalSort] = useState("");

  const useInternalState = !onSearchChange && !onFilterChange;
  const searchTerm = useInternalState ? internalSearch : searchValue;
  const filterValue = useInternalState ? internalFilter : filterEstado;
  const sortTerm = onSortChange ? sortValue : internalSort;

  const handleSearchChange = (value) => {
    onSearchChange ? onSearchChange(value) : setInternalSearch(value);
  };

  const handleFilterChange = (value) => {
    onFilterChange ? onFilterChange(value) : setInternalFilter(value);
  };

  const handleSortChange = (value) => {
    if (onSortChange) {
      onSortChange(value);
    } else {
      setInternalSort(value);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, overflow: "hidden" }}>
      {/* ── HEADER ── */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 1.5,
          mb: description ? 1 : 3,
          minWidth: 0,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, flexShrink: 0 }}>
          {title}
        </Typography>

        {showSearch && (
          <>
            <Box sx={{ flexGrow: 1 }} />

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 1.5,
                width: { xs: "100%", sm: "auto" },
                minWidth: 0,
              }}
            >
              {/* Campo de búsqueda */}
              <TextField
                size="small"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                sx={{ flex: "1 1 160px", minWidth: 0 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => handleSearchChange("")}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
              />

              {/* Select de filtro (estado) */}
              {searchFilters && (
                <Select
                  value={filterValue}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  displayEmpty
                  size="small"
                  sx={{ flexShrink: 0, minWidth: 120 }}
                >
                  {searchFilters.map((filter) => (
                    <MenuItem key={filter.value} value={filter.value}>
                      {filter.label}
                    </MenuItem>
                  ))}
                </Select>
              )}

              {/* NUEVO: Select de ordenamiento (al lado del filtro) */}
              {showSort && (
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel>Ordenar</InputLabel>
                  <Select
                    value={sortTerm}
                    onChange={(e) => handleSortChange(e.target.value)}
                    label="Ordenar"
                  >
                    {sortOptions.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {/* Botón Agregar */}
              {onAddClick && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={onAddClick}
                  sx={{
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                    width: { xs: "100%", sm: "auto" },
                    backgroundColor: BRAND_COLOR,
                    "&:hover": { backgroundColor: BRAND_HOVER },
                  }}
                >
                  Agregar
                </Button>
              )}
            </Box>
          </>
        )}

        {!showSearch && onAddClick && (
          <>
            <Box sx={{ flexGrow: 1 }} />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAddClick}
              sx={{
                flexShrink: 0,
                whiteSpace: "nowrap",
                backgroundColor: BRAND_COLOR,
                "&:hover": { backgroundColor: BRAND_HOVER },
              }}
            >
              Agregar
            </Button>
          </>
        )}
      </Box>

      {description && (
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {description}
        </Typography>
      )}

      {/* Contenido principal (tabla, etc.) */}
      {children}
    </Box>
  );
}