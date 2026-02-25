// src/features/compras/pages/productos/components/ProductoForm.jsx
import { useState, useEffect } from "react";
import { FormHelperText, TextField, Button, Grid, Paper, IconButton, Typography } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";

import BaseFormLayout from "../../../../../shared/components/base/BaseFormLayout";
import BaseFormSection from "../../../../../shared/components/base/BaseFormSection";
import BaseFormField from "../../../../../shared/components/base/BaseFormField";
import BaseFormActions from "../../../../../shared/components/base/BaseFormActions";
import BaseInputField from "../../../../../shared/components/base/BaseInputField";

import { MarcaData } from "../../../../../lib/data/marcasData";
import { getAllCategorias } from "../../../../../lib/data/categoriasData";
import { ProductoData } from "../../../../../lib/data/productosData";

// Formateador de moneda colombiana
const formatCOP = (value) => {
  if (!value && value !== 0) return "";
  const numero = typeof value === "string" ? parseInt(value.replace(/[^0-9]/g, ""), 10) : value;
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numero);
};

export default function ProductoForm({
  mode = "create",
  title,
  initialData,
  onSubmit,
  onCancel,
  onEdit
}) {
  const isView = mode === "view";

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precioVenta: "",
    precioCompra: "",
    stockActual: "",
    stockMinimo: "",
    categoria: "",
    marca: "",
    estado: "activo"
  });

  const [imagenes, setImagenes] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nombreExists, setNombreExists] = useState(false);
  const [precioError, setPrecioError] = useState("");

  // Cargar marcas y categorías activas
  useEffect(() => {
    const loadData = async () => {
      try {
        const [marcasData, categoriasData] = await Promise.all([
          MarcaData.getAllMarcas(),
          getAllCategorias()
        ]);

      const marcasActivas = marcasData.filter(m => m.estado === true);
      
        if (initialData?.marca) {
        const marcaActual = marcasData.find(
          m => m.id.toString() === initialData.marca
        );

        if (marcaActual && !marcaActual.estado) {
          setMarcas([...marcasActivas, marcaActual]);
        } else {
          setMarcas(marcasActivas);
        }
      } else {
        // En modo creación, solo marcas activas
        setMarcas(marcasActivas);
      }
      
        const categoriasActivas = categoriasData.filter(c => c.estado === true);
      
      // Si estamos en modo edición/vista y hay initialData
      if (initialData?.categoria) {
        const categoriaActual = categoriasData.find(
          c => c.id.toString() === initialData.categoria
        );
        
        // Si la categoría actual está inactiva, la agregamos a la lista
        if (categoriaActual && !categoriaActual.estado) {
          setCategorias([...categoriasActivas, categoriaActual]);
        } else {
          setCategorias(categoriasActivas);
        }
      } else {
        // En modo creación, solo categorías activas
        setCategorias(categoriasActivas);
      }

      if (initialData) {
        setFormData({
          nombre: initialData.nombre || "",
          descripcion: initialData.descripcion || "",
          precioVenta: initialData.precioVenta?.toString() || "",
          precioCompra: initialData.precioCompra?.toString() || "",
          stockActual: initialData.stockActual?.toString() || "",
          stockMinimo: initialData.stockMinimo?.toString() || "",
          categoria: initialData.categoria?.toString() || "",
          marca: initialData.marca?.toString() || "",
          estado: initialData.estado ? 'activo' : 'inactivo'
        });

        if (initialData.imagenes) {
          setImagePreviews(initialData.imagenes.map(img => img.url));
        }
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, [initialData]);

  // Formatear nombre
  const formatNombre = (text) => {
    if (!text) return "";
    const trimmed = text.trim().replace(/\s+/g, " ");
    if (trimmed.length === 0) return "";
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  };

  // Validación de precios en tiempo real
  const validarPrecios = (compra, venta) => {
    const compraNum = parseInt(compra, 10) || 0;
    const ventaNum = parseInt(venta, 10) || 0;
    
    if (compraNum > 0 && ventaNum > 0 && ventaNum <= compraNum) {
      setPrecioError("El precio de venta debe ser mayor al precio de compra");
      return false;
    } else {
      setPrecioError("");
      return true;
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    
    let processedValue = value;

    if (["precioVenta", "precioCompra"].includes(name)) {
      processedValue = value.replace(/[^0-9]/g, "");
    }

    if (["stockActual", "stockMinimo"].includes(name)) {
      processedValue = value.replace(/[^0-9]/g, "");
    }

    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: processedValue
      };

      // Validar precios en tiempo real
      if (name === "precioVenta" || name === "precioCompra") {
        const compra = name === "precioCompra" ? processedValue : prev.precioCompra;
        const venta = name === "precioVenta" ? processedValue : prev.precioVenta;
        validarPrecios(compra, venta);
      }

      return newData;
    });

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }

    // Verificar duplicados en tiempo real
    if (name === "nombre" && mode === "create") {
      const trimmedValue = value.trim();
      if (trimmedValue.length >= 3) {
        try {
          const exists = await ProductoData.checkProductoExists(trimmedValue);
          setNombreExists(exists);
        } catch (error) {
          h.error("Error verificando duplicado:", error);
        }
      } else {
        setNombreExists(false);
      }
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (imagenes.length + files.length > 5) {
      setErrors(prev => ({ ...prev, imagenes: "Máximo 5 imágenes permitidas" }));
      return;
    }

    files.forEach(file => {
      if (!["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(file.type)) {
        setErrors(prev => ({ ...prev, imagenes: "Solo se permiten imágenes JPG, PNG o WebP" }));
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, imagenes: "Cada imagen debe ser menor a 2MB" }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenes(prev => [...prev, file]);
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const removeImage = (index) => {
    setImagenes(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    // Nombre
    const nombreTrimmed = formData.nombre.trim().replace(/\s+/g, " ");
    
    if (!nombreTrimmed) {
      newErrors.nombre = "El nombre es requerido";
    } else if (nombreTrimmed.length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres";
    } else if (nombreTrimmed.length > 20) {
      newErrors.nombre = "El nombre no puede exceder 20 caracteres";
    } else if (nombreExists && mode === "create") {
      newErrors.nombre = "Ya existe un producto con este nombre";
    }

    // Categoría y Marca
    if (!formData.categoria) {
      newErrors.categoria = "La categoría es requerida";
    }

    if (!formData.marca) {
      newErrors.marca = "La marca es requerida";
    }

    // Precios
    const precioCompraNum = parseInt(formData.precioCompra, 10);
    const precioVentaNum = parseInt(formData.precioVenta, 10);

    if (!formData.precioCompra) {
      newErrors.precioCompra = "El precio de compra es requerido";
    } else if (isNaN(precioCompraNum) || precioCompraNum <= 0) {
      newErrors.precioCompra = "Debe ser un número mayor a 0";
    }

    if (!formData.precioVenta) {
      newErrors.precioVenta = "El precio de venta es requerido";
    } else if (isNaN(precioVentaNum) || precioVentaNum <= 0) {
      newErrors.precioVenta = "Debe ser un número mayor a 0";
    }

    // Validación comercial
    if (precioCompraNum > 0 && precioVentaNum > 0 && precioVentaNum <= precioCompraNum) {
      newErrors.precioVenta = "El precio de venta debe ser mayor al precio de compra";
    }

    // Stocks
    const stockActualNum = parseInt(formData.stockActual, 10);
    const stockMinimoNum = parseInt(formData.stockMinimo, 10);

    if (!formData.stockActual && formData.stockActual !== "0") {
      newErrors.stockActual = "El stock actual es requerido";
    } else if (isNaN(stockActualNum) || stockActualNum < 0) {
      newErrors.stockActual = "No puede ser negativo";
    }

    if (!formData.stockMinimo && formData.stockMinimo !== "0") {
      newErrors.stockMinimo = "El stock mínimo es requerido";
    } else if (isNaN(stockMinimoNum) || stockMinimoNum < 0) {
      newErrors.stockMinimo = "No puede ser negativo";
    }

    if (!isNaN(stockActualNum) && !isNaN(stockMinimoNum) && stockActualNum < stockMinimoNum) {
      newErrors.stockActual = "No puede ser menor al stock mínimo";
    }

    // Descripción
    if (formData.descripcion && formData.descripcion.length > 120) {
      newErrors.descripcion = "No debe exceder 120 caracteres";
    }

    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const nombreProcesado = formData.nombre.trim().replace(/\s+/g, " ");
    const nombreFinal = formatNombre(nombreProcesado);

    const imagenesProcesadas = imagePreviews.map((url, index) => ({
      url,
      orden: index + 1,
      principal: index === 0
    }));

    const dataToSubmit = {
      nombre: nombreFinal,
      descripcion: formData.descripcion.trim(),
      precioVenta: parseInt(formData.precioVenta, 10),
      precioCompra: parseInt(formData.precioCompra, 10),
      stockActual: parseInt(formData.stockActual, 10),
      stockMinimo: parseInt(formData.stockMinimo, 10),
      categoria: formData.categoria,
      marca: formData.marca,
      imagenes: imagenesProcesadas,
      estado: mode === "create" ? true : (formData.estado === "activo")
    };

    onSubmit?.(dataToSubmit);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <BaseFormLayout title={title}>
      {/* INFORMACIÓN DEL PRODUCTO */}
      <BaseFormSection>
        <BaseFormField>
          <BaseInputField
            label="Nombre del Producto"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            disabled={isView}
            required
            error={!!errors.nombre || nombreExists}
            helperText={errors.nombre || (nombreExists ? "Ya existe un producto con este nombre" : "")}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Categoría"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            select
            options={[
              { value: "", label: "-- Seleccionar categoría --" },
              ...categorias.map(cat => ({
                value: cat.id.toString(),
                label: cat.nombre
              }))
            ]}
            disabled={isView}
            required
            error={!!errors.categoria}
            helperText={errors.categoria}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Marca"
            name="marca"
            value={formData.marca}
            onChange={handleChange}
            select
            options={[
              { value: "", label: "-- Seleccionar marca --" },
              ...marcas.map(m => ({
                value: m.id.toString(),
                label: m.nombre
              }))
            ]}
            disabled={isView}
            required
            error={!!errors.marca}
            helperText={errors.marca}
          />
        </BaseFormField>
          <BaseFormField>
          <BaseInputField
            label="Precio de Compra"
            name="precioCompra"
            value={formData.precioCompra}
            onChange={handleChange}
            disabled={isView}
            required
            error={!!errors.precioCompra}
            helperText={errors.precioCompra}
            inputProps={{ inputMode: "numeric" }}
          />
          {formData.precioCompra && !errors.precioCompra && (
            <FormHelperText sx={{ mt: 0.5 }}>
              {formatCOP(formData.precioCompra)} COP
            </FormHelperText>
          )}
        </BaseFormField>
      </BaseFormSection>

     
      <BaseFormSection>
      
        <BaseFormField>
          <BaseInputField
            label="Precio de Venta"
            name="precioVenta"
            value={formData.precioVenta}
            onChange={handleChange}
            disabled={isView}
            required
            error={!!errors.precioVenta || !!precioError}
            helperText={errors.precioVenta || precioError}
            inputProps={{ inputMode: "numeric" }}
          />
          {formData.precioVenta && !errors.precioVenta && !precioError && (
            <FormHelperText sx={{ mt: 0.5 }}>
              {formatCOP(formData.precioVenta)} COP
            </FormHelperText>
          )}
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Stock Actual"
            name="stockActual"
            value={formData.stockActual}
            onChange={handleChange}
            disabled={isView}
            required
            error={!!errors.stockActual}
            helperText={errors.stockActual}
            inputProps={{ inputMode: "numeric" }}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Stock Mínimo"
            name="stockMinimo"
            value={formData.stockMinimo}
            onChange={handleChange}
            disabled={isView}
            required
            error={!!errors.stockMinimo}
            helperText={errors.stockMinimo}
            inputProps={{ inputMode: "numeric" }}
          />
        </BaseFormField>

            <BaseFormField>
          <TextField
            fullWidth
            label="Descripción"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            disabled={isView}
            multiline
            rows={2}
            variant="outlined"
            size="small"
            error={!!errors.descripcion}
            helperText={errors.descripcion}
          />
        </BaseFormField>

      </BaseFormSection>

      <BaseFormSection>

               <BaseFormField>
          <input
            accept="image/*"
            id="image-upload"
            type="file"
            multiple
            onChange={handleImageUpload}
            disabled={isView}
            style={{ display: 'none' }}
          />
          <label htmlFor="image-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<AddPhotoAlternateIcon />}
              fullWidth
              size="small"
              disabled={isView}
              sx={{ 
                height: 40,
                opacity: isView ? 0.7 : 1,
                cursor: isView ? 'default' : 'pointer'
              }}
            >
              Subir imágenes
            </Button>
          </label>
          
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontSize: '0.7rem' }}>
            JPG, PNG, WebP | Máx: 2MB | Máx: 5
          </Typography>

          {errors.imagenes && (
            <FormHelperText error sx={{ fontSize: '0.7rem' }}>{errors.imagenes}</FormHelperText>
          )}

          {imagePreviews.length > 0 && (
            <Grid container spacing={0.5} sx={{ mt: 1 }}>
              {imagePreviews.map((preview, index) => (
                <Grid item xs={2.4} key={index}>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      position: 'relative',
                      border: index === 0 ? '2px solid #1976d2' : '1px solid #ddd',
                      borderRadius: 1
                    }}
                  >
                    <img 
                      src={preview} 
                      alt={`Preview ${index + 1}`}
                      style={{ 
                        width: '100%', 
                        height: 50, 
                        objectFit: 'cover',
                        borderRadius: '3px'
                      }} 
                    />
                    <IconButton 
                      size="small" 
                      onClick={() => removeImage(index)}
                      sx={{ 
                        position: 'absolute', 
                        top: -6, 
                        right: -6,
                        bgcolor: 'error.main',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'error.dark'
                        },
                        width: 18,
                        height: 18
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: 12 }} />
                    </IconButton>
                    {index === 0 && (
                      <Typography
                        variant="caption"
                        sx={{
                          position: 'absolute',
                          bottom: -14,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          color: 'primary.main',
                          fontSize: '0.5rem',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Principal
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </BaseFormField>

        {/* ESTADO - Visible en todos los modos excepto creación */}
        {mode !== "create" && (
          <BaseFormField>
            <BaseInputField
              label="Estado del Producto"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              select
              options={[
                { value: "activo", label: "Activo" },
                { value: "inactivo", label: "Inactivo" }
              ]}
              disabled={isView}
            />
          </BaseFormField>
        )}
      </BaseFormSection>

      <BaseFormActions
        onCancel={onCancel}
        onSave={handleSubmit}
        onEdit={onEdit}
        showSave={mode !== "view"}
        showEdit={mode === "view"}
        saveLabel={mode === "create" ? "Guardar " : "Guardar "}
        cancelLabel="Cancelar"
        editLabel="Editar"
      />
    </BaseFormLayout>
  );
}