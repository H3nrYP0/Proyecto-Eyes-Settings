// src/features/compras/pages/producto/components/ProductoForm.jsx
import { FormHelperText, IconButton, Box, Stack, Grid, Paper, Typography} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import BaseFormLayout from "../../../../shared/components/base/BaseFormLayout";
import BaseFormActions from "../../../../shared/components/base/BaseFormActions";
import BaseInputField from "../../../../shared/components/base/BaseInputField";
import { TextFieldAlphanumeric, TextFieldNoEmoji, TextFieldLetters } from "@shared/index";
import FormRow from "../../../../shared/components/base/FormRow";
import FormCol from "../../../../shared/components/base/FormCol";
import BaseFormField from "../../../../shared/components/base/BaseFormField";
import BaseFormSection from "../../../../shared/components/base/BaseFormSection";
import ImageDropzone from "./ImageDropzone";
import { formatCOP, formatToPesos, parseFromPesos } from "../../../../shared/utils/formatCOP";

export default function ProductoForm({
  mode,
  title,
  formData,
  errors,
  nombreExists,
  marcas,
  categorias,
  isView,
  isCreate,
  isFullCreate,
  imagenes,
  imagePreviews,
  uploadingImages,
  isSubmitting,
  onOpenCategoriaModal,
  onOpenMarcaModal,
  onCancel,
  onEdit,
  handleChange,
  handleImageUpload,
  removeImage,
  handleSubmit,
  showNotification   
}) {
  const isEditMode = mode === "edit";
  const isProductoActivo = mode !== 'edit' || formData.estado === true;

  const getCategoriaOptions = () => {
    const options = [
      { value: "", label: "-- Seleccionar categoría --" },
      ...categorias.map(cat => ({
        value: cat.id.toString(),
        label: cat.nombre
      }))
    ];
    if (formData.categoria) {
      const existe = categorias.some(c => c.id.toString() === formData.categoria);
      if (!existe) {
        options.unshift({
          value: formData.categoria,
          label: `${formData.categoriaNombre || 'Nueva categoría'} (Cargando...)`
        });
      }
    }
    return options;
  };

  const getMarcaOptions = () => {
    const options = [
      { value: "", label: "-- Seleccionar marca --" },
      ...marcas.map(m => ({
        value: m.id.toString(),
        label: m.nombre
      }))
    ];
    if (formData.marca) {
      const existe = marcas.some(m => m.id.toString() === formData.marca);
      if (!existe) {
        options.unshift({
          value: formData.marca,
          label: `${formData.marcaNombre || 'Nueva marca'} (Cargando...)`
        });
      }
    }
    return options;
  };

  return (
    <BaseFormLayout title={title}>
      {/* FILA 1: Nombre, Categoría, Marca */}
      <FormRow spacing={2}>
        <FormCol xs={12} md={4}>
          <TextFieldAlphanumeric
            label="Nombre del Producto"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            disabled={isView}
            required
            error={!!errors.nombre || nombreExists}
            helperText={errors.nombre || (nombreExists ? "Ya existe un producto con este nombre" : "")}
            inputProps={{ maxLength: 50 }}
          />
        </FormCol>

        <FormCol xs={12} md={4}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ flex: 1 }}>
              <BaseInputField
                label="Categoría"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                select
                options={getCategoriaOptions()}
                disabled={isView}
                required
                error={!!errors.categoria}
                helperText={errors.categoria}
              />
            </Box>
            {!isView && (
              <IconButton
                color="primary"
                onClick={onOpenCategoriaModal}
                sx={{ mt: 1 }}
                title="Agregar nueva categoría"
              >
                <AddCircleOutlineIcon />
              </IconButton>
            )}
          </Stack>
        </FormCol>

        <FormCol xs={12} md={4}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ flex: 1 }}>
              <BaseInputField
                label="Marca"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                select
                options={getMarcaOptions()}
                disabled={isView}
                required
                error={!!errors.marca}
                helperText={errors.marca}
              />
            </Box>
            {!isView && (
              <IconButton
                color="primary"
                onClick={onOpenMarcaModal}
                sx={{ mt: 1 }}
                title="Agregar nueva marca"
              >
                <AddCircleOutlineIcon />
              </IconButton>
            )}
          </Stack>
        </FormCol>
      </FormRow>

      {/* FILA 2: Stock Mínimo, Stock Actual (condicional), Precio Compra (condicional) */}
      <FormRow spacing={2}>
        <FormCol xs={12} md={4}>
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
        </FormCol>

        {(!isCreate || isFullCreate) ? (
          <FormCol xs={12} md={4}>
            <BaseInputField
              label="Stock Actual"
              name="stockActual"
              value={formData.stockActual}
              onChange={handleChange}
              disabled={isView || isEditMode || (isCreate && !isFullCreate)}
              required
              error={!!errors.stockActual}
              helperText={errors.stockActual}
              inputProps={{ 
                inputMode: "numeric",
                pattern: "[0-9]*"
              }}
            />
          </FormCol>
           ) : (
    <FormCol xs={12} md={4} />
        )}

        {(!isCreate || isFullCreate) ? (
          <FormCol xs={12} md={4}>
            <BaseInputField
              label="Precio de Compra"
              name="precioCompra"
              value={formatToPesos(formData.precioCompra)}
              onChange={(e) => {
                const raw = parseFromPesos(e.target.value);
                handleChange({
                  target: {
                    name: "precioCompra",
                    value: raw
                  }
                });
              }}
              disabled={isView || isEditMode}
              required
              error={!!errors.precioCompra}
              helperText={errors.precioCompra}
              inputProps={{ inputMode: "numeric" }}
            />
           
          </FormCol>
          ) : (
          <FormCol xs={12} md={4} />
        )}
      </FormRow>

      {/* FILA 3: Precio Venta (condicional), Estado (condicional) */}
<FormRow spacing={2}>
  {(!isCreate || isFullCreate) ? (
    <FormCol xs={12} md={4}>
      <BaseInputField
        label="Precio de Venta"
        name="precioVenta"
        value={formatToPesos(formData.precioVenta)}
        onChange={(e) => {
          const raw = parseFromPesos(e.target.value);
          handleChange({
            target: {
              name: "precioVenta",
              value: raw
            }
          });
        }}
        disabled={isView || isEditMode}
        required
        error={!!errors.precioVenta}
        helperText={errors.precioVenta}
        inputProps={{ inputMode: "numeric" }}
      />
      
    </FormCol>
  ) : (
    <FormCol xs={12} md={4} />
  )}

  {!isCreate ? (
    <FormCol xs={12} md={4}>
      <BaseInputField
        label="Estado del Producto"
        name="estado"
        value={formData.estado ? "activo" : "inactivo"}
        onChange={(e) => {
          const newValue = e.target.value === "activo";
          handleChange({
            target: { name: "estado", value: newValue }
          });
        }}
        select
        options={[
          { value: "activo", label: "Activo" },
          { value: "inactivo", label: "Inactivo" }
        ]}
        disabled={isView}
      />
    </FormCol>
  ) : (
    <FormCol xs={12} md={4} />
  )}

  <FormCol xs={12} md={4} />
</FormRow>

      <BaseFormSection>
        <BaseFormField fullWidth>
          <TextFieldNoEmoji
            label="Descripción del producto"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            disabled={isView}
            multiline
            rows={3}
            required={false}
            error={!!errors.descripcion}
            helperText={errors.descripcion || `${formData.descripcion.length}/500 caracteres`}
            inputProps={{ maxLength: 500 }}
          />
        </BaseFormField>
      </BaseFormSection>

      <BaseFormSection>
        <BaseFormField fullWidth>
          {isView ? (
            imagenes && imagenes.length > 0 ? (
              <Grid container spacing={1.5}>
                {imagenes.map((img, idx) => (
                  <Grid item xs={2.4} key={img.id || idx}>
                    <Paper
                      variant="outlined"
                      sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        p: 1,
                        aspectRatio: '1/1',
                        cursor: 'pointer',
                      }}
                      onClick={() => {}}
                    >
                      <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img
                          src={img.url}
                          alt={`Imagen ${idx + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          loading="lazy"
                        />
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                Este producto no tiene imágenes asociadas.
              </Typography>
            )
          ) : (
            <>
              <ImageDropzone
                onDrop={handleImageUpload}
                previews={imagePreviews}
                onRemove={removeImage}
                disabled={isView || !isProductoActivo}
                uploadingImages={uploadingImages}
                onError={(errorMsg) => {
                  showNotification?.(errorMsg, "error");
                }}
              />
              {!isProductoActivo && mode === 'edit' && (
                <FormHelperText error sx={{ mt: 1 }}>
                  No se pueden agregar imágenes porque el producto está **inactivo**. 
                  Actívalo desde el campo "Estado del Producto" para poder subir imágenes.
                </FormHelperText>
              )}
            </>
          )}
        </BaseFormField>
      </BaseFormSection>

      <BaseFormActions
        onCancel={onCancel}
        onSave={handleSubmit}
        onEdit={onEdit}
        showSave={!isView}
        showEdit={isView}
        saveLabel={isCreate ? "Guardar" : "Guardar"}
        cancelLabel="Cancelar"
        editLabel="Editar"
        saving={isSubmitting}
      />
    </BaseFormLayout>
  );
}