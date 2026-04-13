// features/servicios/campanaSalud/components/CampanaSaludForm.jsx

import React from 'react';
import BaseFormLayout from '../../../../shared/components/base/BaseFormLayout';
import BaseFormSection from '../../../../shared/components/base/BaseFormSection';
import BaseFormField from '../../../../shared/components/base/BaseFormField';
import BaseInputField from '../../../../shared/components/base/BaseInputField';
import BaseFormActions from '../../../../shared/components/base/BaseFormActions';
import CrudNotification from '../../../../shared/styles/components/notifications/CrudNotification';
import { CircularProgress, Box, Alert } from '@mui/material';

const CampanaSaludForm = ({
  formData,
  empleados,
  estadosCita,
  horasDisponibles,
  loading,
  saving,
  error,
  isEdit,
  isView,
  notification,
  handleChange,
  handleSubmit,
  handleCancel,
  handleEdit,
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

  const opcionesHora =
    horasDisponibles.length > 0
      ? [
          { value: '', label: '-- Seleccione una hora --' },
          ...horasDisponibles.map((slot) => ({
            value: slot.value,
            label: slot.label,
          })),
        ]
      : formData.empleado_id && formData.fecha
      ? [{ value: '', label: 'Sin horario disponible para este día' }]
      : [{ value: '', label: '-- Seleccione empleado y fecha primero --' }];

  const opcionesEstado = estadosCita.map((e) => ({
    value: e.id,
    label: e.nombre,
  }));

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
        title={
          isView
            ? 'Detalle de Campaña'
            : isEdit
            ? 'Editar Campaña'
            : 'Nueva Campaña de Salud'
        }
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <BaseFormSection>
          <BaseFormField>
            <BaseInputField
              label="Empresa"
              name="empresa"
              value={formData.empresa}
              onChange={handleChange}
              disabled={isDisabled}
              required
            />
          </BaseFormField>

          <BaseFormField>
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
          </BaseFormField>

          <BaseFormField>
            <BaseInputField
              label="Fecha"
              name="fecha"
              type="date"
              value={formData.fecha}
              onChange={handleChange}
              disabled={isDisabled}
              required
            />
          </BaseFormField>

          <BaseFormField>
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
                  ? 'Seleccione primero el empleado'
                  : !formData.fecha
                  ? 'Seleccione primero la fecha'
                  : horasDisponibles.length === 0
                  ? 'El empleado no tiene horario disponible para ese día'
                  : undefined
              }
            />
          </BaseFormField>

          <BaseFormField>
            <BaseInputField
              label="Contacto"
              name="contacto"
              value={formData.contacto}
              onChange={(e) => {
                const soloNumeros = e.target.value.replace(/\D/g, '');
                handleChange({ target: { name: 'contacto', value: soloNumeros } });
              }}
              disabled={isDisabled}
              helperText="Solo números"
            />
          </BaseFormField>

          <BaseFormField>
            <BaseInputField
              label="Dirección"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              disabled={isDisabled}
            />
          </BaseFormField>

          {(isEdit || isView) && opcionesEstado.length > 0 && (
            <BaseFormField>
              <BaseInputField
                label="Estado de la Campaña"
                name="estado_cita_id"
                select
                value={formData.estado_cita_id}
                onChange={handleChange}
                disabled={isDisabled}
                options={opcionesEstado}
              />
            </BaseFormField>
          )}

          <BaseFormField fullWidth>
            <BaseInputField
              label="Observaciones"
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              disabled={isDisabled}
              multiline
              rows={3}
              helperText="Máximo 100 caracteres"
              inputProps={{ maxLength: 100 }}
            />
          </BaseFormField>
        </BaseFormSection>

        <BaseFormActions
          onCancel={handleCancel}
          onSave={handleSubmit}
          onEdit={handleEdit}
          showSave={!isView}
          showEdit={isView}
          saveLabel={saving ? 'Guardando...' : isEdit ? 'Guardar' : 'Guardar'}
          disabled={saving}
        />
      </BaseFormLayout>
    </>
  );
};

export default CampanaSaludForm;