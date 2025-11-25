import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../../shared/components/layouts/CrudLayout";

// Importaciones de Material-UI
import { 
  Box, 
  TextField, 
  MenuItem, 
  Button, 
  Alert,
  FormControl,
  InputLabel,
  Select
} from "@mui/material";
import { Save, Cancel, ArrowBack } from "@mui/icons-material";

export default function AgregarServicio() {
  const navigate = useNavigate();
  
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    duracion: "",
    precio: "",
    empleado: "",
    estado: "active"
  });

  // Estado para errores de validación
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Lista de empleados disponibles
  const empleados = [
    "Dr. Carlos Méndez",
    "Dra. Ana Rodríguez",
    "Técnico Javier López",
    "Optómetra María González",
    "Dr. Roberto Silva"
  ];

  // Manejar cambios en los inputs
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

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre del servicio es requerido";
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es requerida";
    }

    if (!formData.duracion || formData.duracion <= 0) {
      newErrors.duracion = "La duración debe ser mayor a 0";
    }

    if (!formData.precio || formData.precio <= 0) {
      newErrors.precio = "El precio debe ser mayor a 0";
    }

    if (!formData.empleado) {
      newErrors.empleado = "Debe seleccionar un empleado";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // CONFIRMAR ANTES DE GUARDAR
      if (window.confirm(`¿Estás seguro de que quieres crear el servicio "${formData.nombre}"?`)) {
        // Aquí iría la lógica para guardar el servicio en la base de datos
        console.log("Servicio guardado:", formData);
        
        // MOSTRAR MODAL DE ÉXITO
        setShowSuccess(true);
        
        // CERRAR AUTOMÁTICAMENTE DESPUÉS DE 2 SEGUNDOS Y REDIRIGIR
        setTimeout(() => {
          setShowSuccess(false);
          navigate(-1); // REDIRIGIR A LA LISTA DE SERVICIOS
        }, 2000);
      }
    }
  };

  // Manejar cancelación
  const handleCancel = () => {
    if (window.confirm("¿Estás seguro de que quieres cancelar? Los datos no guardados se perderán.")) {
      navigate(-1);
    }
  };

  // Función para formatear precio en tiempo real
  const formatPrice = (price) => {
    if (!price) return "";
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP' 
    }).format(price);
  };

  return (
    <CrudLayout
      title="🛠️ Agregar Nuevo Servicio"
      description="Complete la información para agregar un nuevo servicio a la óptica."
      showAddButton={false}
    >
      <Box className="formulario-container">
        {/* Modal de éxito */}
        {showSuccess && (
          <Box className="modal-overlay">
            <Box className="success-modal-content">
              <Box className="success-icon">✅</Box>
              <h3>¡Servicio Creado!</h3>
              <p>El servicio <strong>"{formData.nombre}"</strong> se ha creado exitosamente.</p>
              <p className="redirect-message">Redirigiendo a servicios...</p>
            </Box>
          </Box>
        )}

        <Box className="formulario-header">
          <h3>📝 Nuevo Servicio</h3>
          <p>Complete todos los campos requeridos para registrar el nuevo servicio</p>
        </Box>

        <form onSubmit={handleSubmit}>
          {/* SECCIÓN: INFORMACIÓN BÁSICA */}
          <Box className="formulario-section">
            <h4>Información Básica del Servicio</h4>
            
            <Box className="formulario-row">
              <TextField
                label="Nombre del Servicio *"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                error={!!errors.nombre}
                helperText={errors.nombre}
                fullWidth
                variant="outlined"
                placeholder="Ej: Examen de la Vista Completo"
              />
            </Box>

            <Box className="formulario-row">
              <TextField
                label="Descripción del Servicio *"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                error={!!errors.descripcion}
                helperText={errors.descripcion}
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                placeholder="Describa en detalle el servicio que se ofrece..."
              />
            </Box>
          </Box>

          {/* SECCIÓN: DETALLES DEL SERVICIO */}
          <Box className="formulario-section">
            <h4>Detalles del Servicio</h4>
            
            <Box className="formulario-row">
              <TextField
                label="Duración (minutos) *"
                name="duracion"
                type="number"
                value={formData.duracion}
                onChange={handleInputChange}
                error={!!errors.duracion}
                helperText={errors.duracion}
                fullWidth
                variant="outlined"
                inputProps={{ min: 1, max: 480 }}
                placeholder="30"
              />

              <TextField
                label="Precio (COP) *"
                name="precio"
                type="number"
                value={formData.precio}
                onChange={handleInputChange}
                error={!!errors.precio}
                helperText={errors.precio || (formData.precio && formatPrice(formData.precio))}
                fullWidth
                variant="outlined"
                inputProps={{ min: 0, step: 1000 }}
                placeholder="50000"
              />
            </Box>
          </Box>

          {/* SECCIÓN: EMPLEADO Y ESTADO */}
          <Box className="formulario-section">
            <h4>Asignación y Estado</h4>
            
            <Box className="formulario-row">
              <FormControl fullWidth error={!!errors.empleado}>
                <InputLabel>Empleado Responsable *</InputLabel>
                <Select
                  name="empleado"
                  value={formData.empleado}
                  onChange={handleInputChange}
                  label="Empleado Responsable *"
                >
                  {empleados.map((empleado) => (
                    <MenuItem key={empleado} value={empleado}>
                      {empleado}
                    </MenuItem>
                  ))}
                </Select>
                {errors.empleado && (
                  <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                    {errors.empleado}
                  </Box>
                )}
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Estado del Servicio</InputLabel>
                <Select
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  label="Estado del Servicio"
                >
                  <MenuItem value="active">🟢 Activo</MenuItem>
                  <MenuItem value="inactive">🔴 Inactivo</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* ALERTA DE CAMPOS REQUERIDOS */}
          <Alert severity="info" sx={{ mb: 3 }}>
            Los campos marcados con * son obligatorios
          </Alert>

          {/* BOTONES DE ACCIÓN */}
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
              Guardar Servicio
            </Button>
          </Box>
        </form>
      </Box>
    </CrudLayout>
  );
}