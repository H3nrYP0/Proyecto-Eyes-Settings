import {
  BaseFormLayout,
  BaseInputField,
  BaseFormActions,
  FormCol,
  FormRow
} from "@shared";
import { useState, useEffect } from 'react';

/**
 * UserForm - Formulario de usuarios ADMINISTRATIVOS
 * 
 * SIRVE PARA: Crear, editar y ver usuarios del sistema
 * 
 * Los usuarios ADMINISTRATIVOS se vinculan a un EMPLEADO existente.
 * No se crean datos personales aquí (nombre, documento, etc. vienen del empleado)
 * 
 * Campos requeridos para CREAR:
 *   - empleado_id (seleccionar de lista de empleados sin usuario)
 *   - correo
 *   - contraseña
 *   - rol_id
 * 
 * Campos requeridos para EDITAR:
 *   - correo
 *   - rol_id
 *   - estado
 *   - contraseña (opcional)
 */
export default function UserForm({
  mode = "create",
  title,
  initialData = {},
  rolesDisponibles = [],
  empleadosDisponibles = [],  // lista de empleados sin usuario
  errors = {},
  onChange,
  onSubmit,
  onCancel,
  onEdit,
  isSubmitting = false
}) {
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isCreate = mode === "create";

  const [originalData, setOriginalData] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setOriginalData(JSON.parse(JSON.stringify(initialData)));
  }, [initialData]);

  useEffect(() => {
    const currentData = {
      empleado_id: initialData?.empleado_id || "",
      correo: initialData?.correo || "",
      rol_id: initialData?.rol_id || "",
      estado: initialData?.estado ?? true,
    };

    const original = {
      empleado_id: originalData?.empleado_id || "",
      correo: originalData?.correo || "",
      rol_id: originalData?.rol_id || "",
      estado: originalData?.estado ?? true,
    };

    const hasAnyChange = JSON.stringify(currentData) !== JSON.stringify(original);
    setHasChanges(hasAnyChange);
  }, [initialData, originalData]);

  const handleSave = () => {
    if (isEdit && !hasChanges) {
      onCancel?.();
      return;
    }
    onSubmit();
  };

  const handleContraseniaChange = (e) => {
    // Propagar cambio de contraseña al padre
    onChange?.({ target: { name: "contrasenia", value: e.target.value } });
  };

  return (
    <BaseFormLayout title={title}>
      <FormRow>
        {/* ============================================================
            CREACIÓN: Seleccionar empleado (obligatorio)
            EDICIÓN: Mostrar empleado (no editable)
        ============================================================ */}
        <FormCol>
          <BaseInputField
            label="Empleado"
            name="empleado_id"
            value={initialData?.empleado_id || ""}
            onChange={onChange}
            select={isCreate}
            disabled={isEdit || isView}
            required={isCreate}
            error={!!errors.empleado_id}
            helperText={errors.empleado_id || (isEdit ? "El empleado no se puede cambiar" : "")}
            options={
              isCreate
                ? [
                    { value: "", label: "-- Seleccione un empleado --" },
                    ...empleadosDisponibles.map((emp) => ({
                      value: emp.id,
                      label: `${emp.nombre} ${emp.apellido} - ${emp.numero_documento}`
                    }))
                  ]
                : []
            }
          />
        </FormCol>

        {/* ============================================================
            DATOS SOLO LECTURA (provienen del empleado seleccionado)
        ============================================================ */}
        {initialData?.empleado_nombre && (
          <>
            <FormCol>
              <BaseInputField
                label="Nombre del Empleado"
                name="empleado_nombre"
                value={initialData.empleado_nombre || ""}
                disabled={true}
              />
            </FormCol>

            <FormCol>
              <BaseInputField
                label="Documento"
                name="empleado_documento"
                value={initialData.empleado_documento || ""}
                disabled={true}
              />
            </FormCol>
          </>
        )}

        {/* ============================================================
            CORREO (editable)
        ============================================================ */}
        <FormCol>
          <BaseInputField
            label="Correo Electrónico"
            name="correo"
            type="email"
            value={initialData?.correo || ""}
            onChange={onChange}
            disabled={isView}
            required
            error={!!errors.correo}
            helperText={errors.correo}
          />
        </FormCol>

        {/* ============================================================
            ROL (editable)
        ============================================================ */}
        <FormCol>
          <BaseInputField
            label="Rol"
            name="rol_id"
            value={initialData?.rol_id || ""}
            onChange={onChange}
            select
            options={[
              { value: "", label: "-- Seleccione un rol --" },
              ...rolesDisponibles.map((rol) => ({
                value: rol.id,
                label: rol.nombre
              }))
            ]}
            disabled={isView}
            required
            error={!!errors.rol_id}
            helperText={errors.rol_id}
          />
        </FormCol>

        {/* ============================================================
            ESTADO (solo en edición/vista)
        ============================================================ */}
        {(isEdit || isView) && (
          <FormCol>
            <BaseInputField
              label="Estado"
              name="estado"
              value={initialData?.estado === true ? "activo" : "inactivo"}
              onChange={(e) => onChange?.({ target: { name: "estado", value: e.target.value === "activo" } })}
              select
              options={[
                { value: "activo", label: "Activo" },
                { value: "inactivo", label: "Inactivo" },
              ]}
              disabled={isView}
              required
            />
          </FormCol>
        )}

        {/* ============================================================
            CONTRASEÑA (solo en creación o cambio opcional en edición)
        ============================================================ */}
        {!isView && (
          <>
            <FormCol>
              <BaseInputField
                label={isCreate ? "Contraseña" : "Nueva Contraseña (opcional)"}
                name="contrasenia"
                type="password"
                value={initialData?.contrasenia || ""}
                onChange={handleContraseniaChange}
                required={isCreate}
                error={!!errors.contrasenia}
                helperText={errors.contrasenia}
              />
            </FormCol>

            <FormCol>
              <BaseInputField
                label="Confirmar Contraseña"
                name="confirmar_contrasenia"
                type="password"
                value={initialData?.confirmar_contrasenia || ""}
                onChange={onChange}
                required={isCreate}
                error={!!errors.confirmar_contrasenia}
                helperText={errors.confirmar_contrasenia}
              />
            </FormCol>
          </>
        )}
      </FormRow>

      <BaseFormActions
        onCancel={onCancel}
        onSave={handleSave}
        onEdit={onEdit}
        showSave={!isView}
        showEdit={isView}
        saveLabel={isEdit && !hasChanges ? "Guardar" : "Guardar"}
        isSubmitting={isSubmitting}
      />
    </BaseFormLayout>
  );
}