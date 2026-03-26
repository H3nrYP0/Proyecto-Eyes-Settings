import { useState, useEffect } from "react";
import { Box, FormHelperText } from "@mui/material";
import BaseInputField from "../../../../shared/components/base/BaseInputField";
import {
  tipoDocumentoOptions,
  cargoOptions,
  estadoOptions,
} from "../utils/empleadosUtils";
import { 
  createEmpleado, 
  updateEmpleado,
  checkDocumentoExists,
  checkEmailExists
} from "../services/empleadosService";

export default function EmpleadoForm({
  mode = "create",
  initialData,
  onSubmit,
  onCancel,
  id,
  embedded = false,
}) {
  const isView = mode === "view";
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    cargo: "",
    tipoDocumento: "",
    numero_documento: "",
    telefono: "",
    correo: "",
    fecha_ingreso: "",
    direccion: "",
    estado: "activo",
  });
  const [errors, setErrors] = useState({});
  const [documentoExists, setDocumentoExists] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || "",
        cargo: initialData.cargo || "",
        tipoDocumento: initialData.tipoDocumento || "",
        numero_documento: initialData.numero_documento || "",
        telefono: initialData.telefono || "",
        correo: initialData.correo || "",
        fecha_ingreso: initialData.fecha_ingreso || "",
        direccion: initialData.direccion || "",
        estado: initialData.estado || "activo",
      });
    } else {
      // Reset form para modo creación
      setFormData({
        nombre: "",
        cargo: "",
        tipoDocumento: "",
        numero_documento: "",
        telefono: "",
        correo: "",
        fecha_ingreso: "",
        direccion: "",
        estado: "activo",
      });
    }
    setErrors({});
    setDocumentoExists(false);
    setEmailExists(false);
  }, [initialData]);

  // Verificar si el documento ya existe (solo en creación)
  useEffect(() => {
    const checkDocumento = async () => {
      if (mode === "create" && formData.numero_documento && formData.numero_documento.length >= 6) {
        try {
          const exists = await checkDocumentoExists(formData.numero_documento);
          setDocumentoExists(exists);
        } catch (error) {
          console.error("Error verificando documento:", error);
        }
      } else if (mode === "edit" && formData.numero_documento && initialData) {
        try {
          const exists = await checkDocumentoExists(formData.numero_documento, initialData.id);
          setDocumentoExists(exists);
        } catch (error) {
          console.error("Error verificando documento:", error);
        }
      } else {
        setDocumentoExists(false);
      }
    };

    const timer = setTimeout(() => {
      checkDocumento();
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.numero_documento, mode, initialData]);

  // Verificar si el email ya existe
  useEffect(() => {
    const checkEmail = async () => {
      if (formData.correo && formData.correo.includes('@')) {
        try {
          const exists = await checkEmailExists(formData.correo, mode === "edit" ? initialData?.id : null);
          setEmailExists(exists);
        } catch (error) {
          console.error("Error verificando email:", error);
        }
      } else {
        setEmailExists(false);
      }
    };

    const timer = setTimeout(() => {
      checkEmail();
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.correo, mode, initialData]);

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    } else if (formData.nombre.trim().length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres";
    }
    
    if (!formData.cargo) {
      newErrors.cargo = "El cargo es requerido";
    }
    
    if (!formData.tipoDocumento) {
      newErrors.tipoDocumento = "El tipo de documento es requerido";
    }
    
    if (!formData.numero_documento.trim()) {
      newErrors.numero_documento = "El número de documento es requerido";
    } else if (!/^\d+$/.test(formData.numero_documento)) {
      newErrors.numero_documento = "Solo se permiten números";
    } else if (documentoExists) {
      newErrors.numero_documento = "Este número de documento ya está registrado";
    }
    
    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es requerido";
    } else if (!/^\d+$/.test(formData.telefono)) {
      newErrors.telefono = "Solo se permiten números";
    } else if (formData.telefono.length < 7) {
      newErrors.telefono = "El teléfono debe tener al menos 7 dígitos";
    }
    
    if (formData.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = "Ingrese un correo electrónico válido";
    } else if (emailExists) {
      newErrors.correo = "Este correo electrónico ya está registrado";
    }
    
    if (!formData.fecha_ingreso) {
      newErrors.fecha_ingreso = "La fecha de ingreso es requerida";
    } else {
      const fechaIngreso = new Date(formData.fecha_ingreso);
      const hoy = new Date();
      if (fechaIngreso > hoy) {
        newErrors.fecha_ingreso = "La fecha de ingreso no puede ser futura";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      let result;
      if (mode === "create") {
        result = await createEmpleado(formData);
        if (onSubmit) {
          onSubmit(result);
        }
      } else if (mode === "edit") {
        result = await updateEmpleado(initialData.id, formData);
        if (onSubmit) {
          onSubmit(result);
        }
      }
    } catch (error) {
      console.error("Error al guardar empleado:", error);
      setErrors({ submit: error.response?.data?.message || "Error al guardar el empleado" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form id={id} onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {errors.submit && (
          <FormHelperText error sx={{ mt: 1, mb: 1, textAlign: 'center' }}>
            {errors.submit}
          </FormHelperText>
        )}
        
        <Box>
          <BaseInputField
            label="Nombre Completo"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            disabled={isView || submitting}
            required
            error={!!errors.nombre}
            helperText={errors.nombre}
            fullWidth
          />
        </Box>

        <Box>
          <BaseInputField
            label="Cargo"
            name="cargo"
            value={formData.cargo}
            onChange={handleChange}
            select
            options={cargoOptions}
            disabled={isView || submitting}
            required
            error={!!errors.cargo}
            helperText={errors.cargo}
            fullWidth
          />
        </Box>

        <Box>
          <BaseInputField
            label="Tipo de Documento"
            name="tipoDocumento"
            value={formData.tipoDocumento}
            onChange={handleChange}
            select
            options={tipoDocumentoOptions}
            disabled={isView || submitting}
            required
            error={!!errors.tipoDocumento}
            helperText={errors.tipoDocumento}
            fullWidth
          />
        </Box>

        <Box>
          <BaseInputField
            label="Número de Documento"
            name="numero_documento"
            value={formData.numero_documento}
            onChange={(e) => {
              const soloNumeros = e.target.value.replace(/\D/g, "");
              handleChange({
                target: { name: "numero_documento", value: soloNumeros },
              });
            }}
            disabled={isView || submitting}
            required
            error={!!errors.numero_documento || documentoExists}
            helperText={errors.numero_documento || (documentoExists && "Este documento ya está registrado")}
            fullWidth
          />
        </Box>

        <Box>
          <BaseInputField
            label="Teléfono"
            name="telefono"
            value={formData.telefono}
            onChange={(e) => {
              const soloNumeros = e.target.value.replace(/\D/g, "");
              handleChange({
                target: { name: "telefono", value: soloNumeros },
              });
            }}
            disabled={isView || submitting}
            required
            error={!!errors.telefono}
            helperText={errors.telefono}
            fullWidth
          />
        </Box>

        <Box>
          <BaseInputField
            label="Correo Electrónico"
            name="correo"
            type="email"
            value={formData.correo}
            onChange={handleChange}
            disabled={isView || submitting}
            error={!!errors.correo || emailExists}
            helperText={errors.correo || (emailExists && "Este correo ya está registrado")}
            fullWidth
          />
        </Box>

        <Box>
          <BaseInputField
            label="Fecha de Ingreso"
            name="fecha_ingreso"
            type="date"
            value={formData.fecha_ingreso}
            onChange={handleChange}
            disabled={isView || submitting}
            required
            error={!!errors.fecha_ingreso}
            helperText={errors.fecha_ingreso}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Box>

        <Box>
          <BaseInputField
            label="Dirección"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            disabled={isView || submitting}
            multiline
            rows={2}
            error={!!errors.direccion}
            helperText={errors.direccion}
            fullWidth
          />
        </Box>

        {mode !== "create" && (
          <Box>
            <BaseInputField
              label="Estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              select
              options={estadoOptions}
              disabled={isView || submitting}
              required
              fullWidth
            />
          </Box>
        )}
      </Box>
    </form>
  );
}