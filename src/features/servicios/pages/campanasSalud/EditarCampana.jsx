import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CrudLayout from "../../../../shared/components/layouts/CrudLayout";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert
} from "@mui/material";
import { Save, Cancel, ArrowBack } from "@mui/icons-material";

/**
 * Componente para editar una campaña de salud existente
 * Con validación similar a Servicios pero descripción OPCIONAL
 */
export default function EditarCampana() {
  const navigate = useNavigate();
  const location = useLocation();

  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    fechaInicio: "",
    fechaFin: "",
    descuento: "",
    estado: "inactiva"
  });

  // Estado para errores de validación
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasData, setHasData] = useState(false);

  /**
   * Carga los datos de la campaña al iniciar
   */
  useEffect(() => {
    if (location.state?.campanaData) {
      setFormData(location.state.campanaData);
      setHasData(true);
    } else {
      alert("No se encontraron datos de la campaña para editar");
      navigate(-1);
    }
  }, [location.state, navigate]);

  /**
   * Maneja los cambios en los campos del formulario
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  /**
   * Valida todos los campos del formulario - DESCRIPCIÓN OPCIONAL
   */
  const validateForm = () => {
    const newErrors = {};

    // Validar nombre (requerido)
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre de la campaña es requerido";
    }

    // VALIDACIÓN REMOVIDA: Descripción NO es obligatoria

    // Validar fecha de inicio (requerida)
    if (!formData.fechaInicio) {
      newErrors.fechaInicio = "La fecha de inicio es requerida";
    }

    // Validar fecha de fin (requerida)
    if (!formData.fechaFin) {
      newErrors.fechaFin = "La fecha de fin es requerida";
    }

    // Validar que la fecha fin sea mayor o igual a la fecha inicio
    if (formData.fechaInicio && formData.fechaFin) {
      const inicio = new Date(formData.fechaInicio);
      const fin = new Date(formData.fechaFin);
      if (fin < inicio) {
        newErrors.fechaFin = "La fecha de fin debe ser mayor o igual a la fecha de inicio";
      }
    }

    // Validar descuento (requerido)
    if (!formData.descuento.trim()) {
      newErrors.descuento = "El descuento es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Maneja el envío del formulario - EXACTAMENTE IGUAL QUE SERVICIOS
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // CONFIRMAR ANTES DE GUARDAR - IGUAL QUE SERVICIOS
      if (window.confirm(`¿Estás seguro de que quieres guardar los cambios en "${formData.nombre}"?`)) {
        // Aquí iría la lógica para actualizar la campaña en la base de datos
        console.log("Campaña actualizada:", formData);
        
        // MOSTRAR MODAL DE ÉXITO - IGUAL QUE SERVICIOS
        setShowSuccess(true);
        
        // CERRAR AUTOMÁTICAMENTE DESPUÉS DE 2 SEGUNDOS Y REDIRIGIR - IGUAL QUE SERVICIOS
        setTimeout(() => {
          setShowSuccess(false);
          navigate(-1); // REDIRIGIR A LA LISTA DE CAMPAÑAS
        }, 2000);
      }
    }
  };

  /**
   * Maneja cancelación - IGUAL QUE SERVICIOS
   */
  const handleCancel = () => {
    if (window.confirm("¿Estás seguro de que quieres cancelar? Los cambios no guardados se perderán.")) {
      navigate(-1);
    }
  };

  if (!hasData) {
    return (
      <div className="formulario-container">
        <Typography variant="h6" align="center">
          Cargando datos de la campaña...
        </Typography>
      </div>
    );
  }

  return (
    <CrudLayout
      title="🏥 Editar Campaña"
      description="Modifique la información de la campaña de salud."
      showAddButton={false}
    >
      <Box className="formulario-container">
        {/* Modal de éxito - IDÉNTICO AL DE SERVICIOS */}
        {showSuccess && (
          <Box className="modal-overlay">
            <Box className="success-modal-content">
              <Box className="success-icon">✅</Box>
              <h3>¡Cambios Guardados!</h3>
              <p>La campaña <strong>"{formData.nombre}"</strong> se ha actualizado exitosamente.</p>
              <p className="redirect-message">Redirigiendo a campañas...</p>
            </Box>
          </Box>
        )}

        <Box className="formulario-header">
          <h3>✏️ Editar Campaña de Salud</h3>
          <p>Modifique los campos que desee actualizar</p>
        </Box>

        <form onSubmit={handleSubmit}>
          {/* SECCIÓN: INFORMACIÓN BÁSICA */}
          <Box className="formulario-section">
            <h4>Información Básica de la Campaña</h4>
            
            <Box className="formulario-row">
              <TextField
                label="Nombre de la Campaña *"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                error={!!errors.nombre}
                helperText={errors.nombre}
                fullWidth
                variant="outlined"
              />
            </Box>

            <Box className="formulario-row">
              <TextField
                label="Descripción de la Campaña"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                error={!!errors.descripcion}
                helperText={errors.descripcion}
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                placeholder="Descripción de la campaña (opcional)..."
              />
            </Box>
          </Box>

          {/* SECCIÓN: FECHAS Y DESCUENTO */}
          <Box className="formulario-section">
            <h4>Fechas y Descuento</h4>
            
            <Box className="formulario-row">
              <TextField
                label="Fecha de Inicio *"
                name="fechaInicio"
                type="date"
                value={formData.fechaInicio}
                onChange={handleInputChange}
                error={!!errors.fechaInicio}
                helperText={errors.fechaInicio}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                label="Fecha de Fin *"
                name="fechaFin"
                type="date"
                value={formData.fechaFin}
                onChange={handleInputChange}
                error={!!errors.fechaFin}
                helperText={errors.fechaFin}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <Box className="formulario-row">
              <TextField
                label="Descuento *"
                name="descuento"
                value={formData.descuento}
                onChange={handleInputChange}
                error={!!errors.descuento}
                helperText={errors.descuento}
                fullWidth
                variant="outlined"
              />
            </Box>
          </Box>

          {/* SECCIÓN: ESTADO */}
          <Box className="formulario-section">
            <h4>Estado de la Campaña</h4>
            
            <Box className="formulario-row">
              <FormControl fullWidth>
                <InputLabel>Estado de la Campaña</InputLabel>
                <Select
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  label="Estado de la Campaña"
                >
                  <MenuItem value="inactiva">🔴 Inactiva</MenuItem>
                  <MenuItem value="en proceso">🟡 En Proceso</MenuItem>
                  <MenuItem value="finalizada">🟢 Finalizada</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* ALERTA DE CAMPOS REQUERIDOS - ACTUALIZADA */}
          <Alert severity="info" sx={{ mb: 3 }}>
            Los campos marcados con * son obligatorios. La descripción es opcional.
          </Alert>

          {/* BOTONES DE ACCIÓN - IGUAL QUE SERVICIOS */}
          <Box className="formulario-actions">
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleCancel}
              className="btn btn-secondary"
            >
              Cancelar
            </Button>
            
            <Button
              variant="contained"
              startIcon={<Save />}
              type="submit"
              className="btn btn-success"
              sx={{
                backgroundColor: '#28a745',
                '&:hover': {
                  backgroundColor: '#218838',
                }
              }}
            >
              Guardar Cambios
            </Button>
          </Box>
        </form>
      </Box>
    </CrudLayout>
  );
}