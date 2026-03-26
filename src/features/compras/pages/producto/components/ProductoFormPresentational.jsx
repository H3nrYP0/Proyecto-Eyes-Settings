// src/features/compras/pages/productos/components/ProductoFormPresentational.jsx
import { FormHelperText, TextField, IconButton, Typography, Box, Stack } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import BaseFormLayout from "../../../../../shared/components/base/BaseFormLayout";
import BaseFormActions from "../../../../../shared/components/base/BaseFormActions";
import BaseInputField from "../../../../../shared/components/base/BaseInputField";
import FormRow from "../../../../../shared/components/base/FormRow";
import FormCol from "../../../../../shared/components/base/FormCol";
import BaseFormField from "../../../../../shared/components/base/BaseFormField";
import BaseFormSection from "../../../../../shared/components/base/BaseFormSection";
import ImageDropzone from "./ImageDropzone";
import { formatCOP } from "../../../../../shared/utils/formatCOP";

export default function ProductoFormPresentational({
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
  imagePreviews,
  uploadingImages,
  onOpenCategoriaModal,
  onOpenMarcaModal,
  onCancel,
  onEdit,
  handleChange,
  handleImageUpload,
  removeImage,
  handleSubmit
}) {
  return (
    <BaseFormLayout title={title}>
      <FormRow spacing={2}>
        <FormCol xs={12} md={6} lg={!isCreate ? 3 : 4}>
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
        </FormCol>

        {/* Categoría con botón + */}
        <FormCol xs={12} md={6} lg={!isCreate ? 3 : 4}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ flex: 1 }}>
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

        {/* Marca con botón + */}
        <FormCol xs={12} md={6} lg={!isCreate ? 3 : 4}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ flex: 1 }}>
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

        {/* Estado (solo edición/vista) */}
        {!isCreate && (
          <FormCol xs={12} md={6} lg={3}>
            <BaseInputField
              label="Estado del Producto"
              name="estado"
              value={formData.estado ? "activo" : "inactivo"}
              onChange={handleChange}
              select
              options={[
                { value: "activo", label: "Activo" },
                { value: "inactivo", label: "Inactivo" }
              ]}
              disabled={isView}
            />
          </FormCol>
        )}
      </FormRow>

      {/* Precios y Stock (solo edición/vista) */}
      {(!isCreate || isFullCreate) && (
        <FormRow spacing={2}>
          <FormCol xs={12} sm={6} md={6} lg={3}>
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
            
          </FormCol>

          <FormCol xs={12} sm={6} md={6} lg={3}>
            <BaseInputField
              label="Precio de Venta"
              name="precioVenta"
              value={formData.precioVenta}
              onChange={handleChange}
              disabled={isView}
              required
              error={!!errors.precioVenta}
              helperText={errors.precioVenta}
              inputProps={{ inputMode: "numeric" }}
            />
            {formData.precioVenta && !errors.precioVenta && (
              <FormHelperText sx={{ mt: 0.5 }}>
                {formatCOP(formData.precioVenta)} COP
              </FormHelperText>
            )}
          </FormCol>

          <FormCol xs={12} sm={6} md={6} lg={3}>
            <BaseInputField
              label="Stock Actual"
              name="stockActual"
              value={formData.stockActual}
              onChange={handleChange}
              disabled={isView || (isCreate && !isFullCreate)}
              required
              error={!!errors.stockActual}
              helperText={errors.stockActual}
              inputProps={{ 
                inputMode: "numeric",
                pattern: "[0-9]*",
                readOnly: isView || (isCreate && !isFullCreate)
              }}
            />
          </FormCol>

           
          <FormCol xs={12} sm={6} md={6} lg={3}>
            <BaseInputField
              label="Stock Mínimo"
              name="stockMinimo"
              type="number"
              value={formData.stockMinimo}
              onChange={handleChange}
              disabled={isView}
              required
              error={!!errors.stockMinimo}
              helperText={errors.stockMinimo}
              inputProps={{ inputMode: "numeric" }}
            />
          </FormCol>
        </FormRow>
      )}

      {/* Stock Mínimo en creación */}
      { isCreate && !isFullCreate &&(
        <FormRow spacing={2}>
          <FormCol xs={12} md={6}>
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
        </FormRow>
      )}
        
      {/* Descripción */}
      <BaseFormSection>
        <BaseFormField fullWidth>
          <BaseInputField
            label="Descripción del producto"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            disabled={isView}
            multiline
            rows={2}
            required={false}
            error={!!errors.descripcion}
            helperText={errors.descripcion || `${formData.descripcion.length}/120 caracteres`}
            inputProps={{ maxLength: 120 }}
          />
        </BaseFormField>
      </BaseFormSection>

      {/* Imágenes */}
      <BaseFormSection>
        <BaseFormField fullWidth>
          <ImageDropzone
            onDrop={handleImageUpload}
            previews={imagePreviews}
            onRemove={removeImage}
            disabled={isView}
            uploadingImages={uploadingImages}
          />
        </BaseFormField>
      </BaseFormSection>

      {/* Botones de acción */}
      <BaseFormActions
        onCancel={onCancel}
        onSave={handleSubmit}
        onEdit={onEdit}
        showSave={!isView}
        showEdit={isView}
        saveLabel={isCreate ? "Guardar" : "Guardar"}
        cancelLabel="Cancelar"
        editLabel="Editar"
      />
    </BaseFormLayout>
  );
}