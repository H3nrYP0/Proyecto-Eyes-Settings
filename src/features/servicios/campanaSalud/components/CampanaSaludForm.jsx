import React from 'react';
import { Grid, Box, CircularProgress, Alert } from '@mui/material';
import BaseFormLayout from '@shared/components/base/BaseFormLayout';
import BaseInputField from '@shared/components/base/BaseInputField';
import BaseFormActions from '@shared/components/base/BaseFormActions';
import CrudNotification from '@shared/styles/components/notifications/CrudNotification';
import { TextFieldAlphanumeric, TextFieldNoEmoji } from '@shared/index';
import { ESTADOS_BLOQUEADOS } from '../utils/constants';

/**
 * Componente formulario para Campañas de Salud.
 * Soporta creación, edición y visualización.
 * En modo vista (isView=true) muestra el botón "Editar" si el estado no está bloqueado.
 */
const CampanaSaludForm = ({
  formData,
  empleados,
  estadosCita,
  horasDisponibles,
  loading,
  saving,
  error,        // siempre string gracias al fix en el hook
  isEdit,
  isView,
  notification,
  handleChange,
  handleSubmit,
  handleCancel,
  handleEdit,   // navega a /editar/:id — lo expone el hook
  hideNotification,
}) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const isDisabled = isView;

  // Fix: usar ESTADOS_BLOQUEADOS en lugar de valores hardcodeados (3 y 4)
  // para que sea consistente con constants.js
  const isEstadoBloqueado = isView && ESTADOS_BLOQUEADOS.includes(formData.estado_cita_id);

  const opcionesHora =
    horasDisponibles.length > 0
      ? [
          { value: '', label: '-- Seleccione una hora --' },
          ...horasDisponibles.map((slot) => ({ value: slot.value, label: slot.label })),
        ]
      : formData.empleado_id && formData.fecha
      ? [{ value: '', label: 'Sin horario disponible para este día' }]
      : [{ value: '', label: '-- Seleccione empleado y fecha primero --' }];

  const opcionesEstado = estadosCita.map((e) => ({ value: e.id, label: e.nombre }));

  return (
    <>
      {notification && (
        <CrudNotification
          isVisible={notification.open}
          type={notification.type}
          message={notification.message}
          onClose={hideNotification}
        />
      )}

      <BaseFormLayout
        title={isView ? 'Detalle de Campaña' : isEdit ? 'Editar Campaña' : 'Nueva Campaña de Salud'}
      >
        {/* Fix: error es siempre string; nunca se pasa un objeto Error como hijo */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Empresa, NIT, Contacto */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextFieldAlphanumeric
              label="Empresa"
              name="empresa"
              value={formData.empresa}
              onChange={handleChange}
              disabled={isDisabled}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <BaseInputField
              label="NIT de la Empresa"
              name="nit_empresa"
              value={formData.nit_empresa || ''}
              onChange={(e) => {
                const soloNumeros = e.target.value.replace(/\D/g, '');
                handleChange({ target: { name: 'nit_empresa', value: soloNumeros } });
              }}
              disabled={isDisabled}
              required
              helperText={
                formData.nit_empresa?.length > 0 && formData.nit_empresa.length < 8
                  ? 'El NIT debe tener al menos 8 dígitos'
                  : ''
              }
              inputProps={{ inputMode: 'numeric', minLength: 8 }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <BaseInputField
              label="Contacto"
              name="contacto"
              value={formData.contacto}
              onChange={(e) => {
                const soloNumeros = e.target.value.replace(/\D/g, '').slice(0, 10);
                handleChange({ target: { name: 'contacto', value: soloNumeros } });
              }}
              disabled={isDisabled}
              helperText={
                formData.contacto?.length > 0 && formData.contacto.length !== 10
                  ? 'El teléfono debe tener exactamente 10 dígitos'
                  : ''
              }
              error={formData.contacto?.length > 0 && formData.contacto.length !== 10}
              inputProps={{ inputMode: 'numeric', maxLength: 10 }}
            />
          </Grid>
        </Grid>

        {/* Empleado, Fecha, Hora */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <BaseInputField
              label="Empleado Responsable"
              name="empleado_id"
              select
              value={formData.empleado_id}
              onChange={handleChange}
              disabled={isDisabled}
              required
              options={[
                { value: '', label: '-- Seleccione un empleado --' },
                ...empleados.map((emp) => ({
                  value: emp.id,
                  label: `${emp.nombre}${emp.cargo ? ` - ${emp.cargo}` : ''}`,
                })),
              ]}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <BaseInputField
              label="Fecha"
              name="fecha"
              type="date"
              value={formData.fecha}
              onChange={handleChange}
              disabled={isDisabled}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            {isView ? (
              <BaseInputField label="Hora" name="hora" value={formData.hora} disabled />
            ) : (
              <BaseInputField
                label="Hora"
                name="hora"
                select
                value={formData.hora}
                onChange={handleChange}
                disabled={isDisabled || horasDisponibles.length === 0}
                required
                options={opcionesHora}
                helperText={
                  !formData.empleado_id
                    ? ''
                    : !formData.fecha
                    ? 'Seleccione primero la fecha'
                    : horasDisponibles.length === 0
                    ? 'El empleado no tiene horario disponible para ese día'
                    : undefined
                }
              />
            )}
          </Grid>
        </Grid>

        {/* Dirección y Estado */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextFieldNoEmoji
              label="Dirección"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              disabled={isDisabled}
            />
          </Grid>

          {(isEdit || isView) && opcionesEstado.length > 0 && (
            <Grid item xs={12} sm={6} md={4}>
              <BaseInputField
                label="Estado de la Campaña"
                name="estado_cita_id"
                select
                value={formData.estado_cita_id}
                onChange={handleChange}
                disabled={isDisabled}
                options={opcionesEstado}
              />
            </Grid>
          )}
        </Grid>

        {/* Observaciones */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextFieldNoEmoji
              label="Observaciones"
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              disabled={isDisabled}
              multiline
              rows={3}
              helperText="Máximo 500 caracteres"
              inputProps={{ maxLength: 500 }}
            />
          </Grid>
        </Grid>

        {/*
           Fix botón Editar en vista detalle:
          - showEdit={isView && !isEstadoBloqueado} → aparece en modo vista si el estado lo permite
          - handleEdit navega a /editar/:id (viene del hook)
        */}
        <BaseFormActions
          onCancel={handleCancel}
          onSave={handleSubmit}
          onEdit={handleEdit}
          showSave={!isView}
          showEdit={isView && !isEstadoBloqueado}
          cancelLabel={isView ? 'Salir' : 'Cancelar'}
          saveLabel={saving ? 'Guardando...' : 'Guardar'}
          disabled={saving}
        />
      </BaseFormLayout>
    </>
  );
};

export default CampanaSaludForm;