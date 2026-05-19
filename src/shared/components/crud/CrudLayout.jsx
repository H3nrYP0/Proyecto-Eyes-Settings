import { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  TextField,
  IconButton,
  Button,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";

const BRAND_COLOR = "#1a2540";
const BRAND_HOVER = "#2d3a6b";

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
}) {
  const [internalSearch, setInternalSearch] = useState("");
  const [internalFilter, setInternalFilter] = useState("");

  const useInternalState = !onSearchChange && !onFilterChange;
  const searchTerm = useInternalState ? internalSearch : searchValue;
  const filterValue = useInternalState ? internalFilter : filterEstado;

  const handleSearchChange = (value) => {
    onSearchChange ? onSearchChange(value) : setInternalSearch(value);
  };

  const handleFilterChange = (value) => {
    onFilterChange ? onFilterChange(value) : setInternalFilter(value);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, overflow: "hidden" }}>
      {/* ── HEADER ── */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",           // permite salto de línea natural
          alignItems: "center",
          gap: 1.5,
          mb: description ? 1 : 3,
          minWidth: 0,                // evita que flex-children desborden
        }}
      >
        {/* Título: nunca se encoge, siempre ocupa su espacio */}
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, flexShrink: 0 }}
        >
          {title}
        </Typography>

        {showSearch && (
          <>
            {/* Spacer: empuja los controles a la derecha en pantallas grandes */}
            <Box sx={{ flexGrow: 1 }} />

            {/* Bloque de controles: se apila verticalmente en móvil */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 1.5,
                // En móvil ocupa todo el ancho disponible
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
                sx={{
                  flex: "1 1 160px",   // crece/encoge pero mínimo 160 px
                  minWidth: 0,
                }}
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

              {/* Select de filtro */}
              {searchFilters && (
                <Select
                  value={filterValue}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  displayEmpty
                  size="small"
                  sx={{
                    flexShrink: 0,
                    minWidth: 120,
                  }}
                >
                  {searchFilters.map((filter) => (
                    <MenuItem key={filter.value} value={filter.value}>
                      {filter.label}
                    </MenuItem>
                  ))}
                </Select>
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
                    // En móvil ocupa todo el ancho si está solo en su "línea"
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

        {/* Botón Agregar cuando NO hay buscador */}
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

      {children}
    </Box>
  );
}