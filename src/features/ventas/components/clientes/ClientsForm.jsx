import { useState, useEffect } from "react";

import BaseFormLayout from "../../../../shared/components/base/BaseFormLayout";
import BaseFormSection from "../../../../shared/components/base/BaseFormSection";
import BaseFormField from "../../../../shared/components/base/BaseFormField";
import BaseFormActions from "../../../../shared/components/base/BaseFormActions";
import BaseInputField from "../../../../shared/components/base/BaseInputField";


export default function ClientsForm({
  mode = "create",
  title,
  initialData = null,
  onSubmit,
  onCancel,
  onEdit
}) {
  const isView = mode === "view";
  const isEdit = mode === "edit";

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    tipoDocumento: "",
    documento: "",
    telefono: "",
    correo: "",
    fechaNacimiento: "",
    genero: "",
    ciudad: "",
    direccion: ""
  });

  const [errors, setErrors] = useState({});

  // Cargar datos cuando hay initialData
  useEffect(() => {
    if (initialData) {
      console.log("Cargando datos en formulario:", initialData);
      setFormData({
        nombre: initialData.nombre || "",
        apellido: initialData.apellido || "",
        tipoDocumento: initialData.tipoDocumento || initialData.tipo_documento || "",
        documento: initialData.documento || initialData.numero_documento || "",
        telefono: initialData.telefono || "",
        correo: initialData.correo || "",
        fechaNacimiento: initialData.fechaNacimiento || initialData.fecha_nacimiento || "",
        genero: initialData.genero || "",
        ciudad: initialData.ciudad || initialData.municipio || "",
        direccion: initialData.direccion || ""
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) newErrors.nombre = "Nombre requerido";
    if (!formData.apellido.trim()) newErrors.apellido = "Apellido requerido";
    if (!formData.tipoDocumento) newErrors.tipoDocumento = "Seleccione tipo documento";
    if (!formData.documento.trim()) newErrors.documento = "Documento requerido";
    if (!formData.fechaNacimiento) newErrors.fechaNacimiento = "Fecha requerida";
    if (!formData.genero) newErrors.genero = "Seleccione género";
    if (!formData.ciudad.trim()) newErrors.ciudad = "Ciudad requerida";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.correo && !emailRegex.test(formData.correo)) {
      newErrors.correo = "Correo inválido";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Preparar datos para enviar al backend
    const datosParaEnviar = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      tipoDocumento: formData.tipoDocumento,
      documento: formData.documento,
      telefono: formData.telefono,
      correo: formData.correo,
      fechaNacimiento: formData.fechaNacimiento,
      genero: formData.genero,
      ciudad: formData.ciudad,
      direccion: formData.direccion
    };

    onSubmit?.(datosParaEnviar);
  };

  return (
    <BaseFormLayout title={title}>
      {/* INFORMACIÓN PERSONAL */}
      <BaseFormSection title="Información Personal">

        <BaseFormField>
          <BaseInputField
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            disabled={isView}
            required
            error={!!errors.nombre}
            helperText={errors.nombre}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            disabled={isView}
            required
            error={!!errors.apellido}
            helperText={errors.apellido}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            disabled={isView}
            error={!!errors.correo}
            helperText={errors.correo}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Teléfono"
            name="telefono"
            value={formData.telefono}
            onChange={(e) =>
              handleChange({
                target: {
                  name: "telefono",
                  value: e.target.value.replace(/\D/g, "")
                }
              })
            }
            disabled={isView}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Fecha Nacimiento"
            name="fechaNacimiento"
            type="date"
            value={formData.fechaNacimiento}
            onChange={handleChange}
            disabled={isView}
            required
            error={!!errors.fechaNacimiento}
            helperText={errors.fechaNacimiento}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Tipo Documento"
            name="tipoDocumento"
            value={formData.tipoDocumento}
            onChange={handleChange}
            select
            options={[
              { value: "cedula", label: "Cédula (CC)" },
              { value: "cedula_extranjeria", label: "Cédula extranjería (CE)" },
              { value: "pasaporte", label: "Pasaporte (PA)" }
            ]}
            disabled={isView}
            required
            error={!!errors.tipoDocumento}
            helperText={errors.tipoDocumento}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Documento"
            name="documento"
            value={formData.documento}
            onChange={(e) =>
              handleChange({
                target: {
                  name: "documento",
                  value: e.target.value.replace(/\D/g, "")
                }
              })
            }
            disabled={isView}
            required
            error={!!errors.documento}
            helperText={errors.documento}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Género"
            name="genero"
            value={formData.genero}
            onChange={handleChange}
            select
            options={[
              { value: "masculino", label: "Masculino" },
              { value: "femenino", label: "Femenino" },
              { value: "otro", label: "Otro" }
            ]}
            disabled={isView}
            required
            error={!!errors.genero}
            helperText={errors.genero}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Ciudad"
            name="ciudad"
            value={formData.ciudad}
            onChange={handleChange}
            disabled={isView}
            required
            error={!!errors.ciudad}
            helperText={errors.ciudad}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Dirección"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            disabled={isView}
          />
        </BaseFormField>

      </BaseFormSection>

      {/* ACCIONES */}
      <BaseFormActions
        onCancel={onCancel}
        onSave={handleSubmit}
        onEdit={onEdit}
        showSave={!isView}           // Mostrar guardar en create y edit
        showEdit={isView}             // Mostrar editar solo en vista
        saveLabel={isEdit ? "Actualizar Cliente" : "Guardar Cliente"}
      />
    </BaseFormLayout>
  );
}