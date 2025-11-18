import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CrudLayout from "../../../../shared/components/layouts/CrudLayout";
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

export default function EditarServicio() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { servicioData } = location.state || {};

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    duracion: "",
    precio: "",
    empleado: "",
    estado: "active"
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const empleados = [
    "Dr. Carlos Méndez",
    "Dra. Ana Rodríguez",
    "Técnico Javier López",
    "Optómetra María González",
    "Dr. Roberto Silva"
  ];

  useEffect(() => {
    if (servicioData) {
      setFormData({
        nombre: servicioData.nombre || "",
        descripcion: servicioData.descripcion || "",
        duracion: servicioData.duracion || "",
        precio: servicioData.precio || "",
        empleado: servicioData.empleado || "",
        estado: servicioData.estado || "active"
      });
    }
  }, [servicioData]);

  if (!servicioData) {
    return (
      <CrudLayout
        title="✏️ Editar Servicio"
        description="Servicio no encontrado"
        showAddButton={false}
      >
        <Box className="formulario-container">
          <Box style={{ textAlign: 'center', padding: '2rem' }}>
            <h3>❌ Servicio no encontrado</h3>
            <p>No se pudo cargar la información del servicio.</p>
            <Button 
              variant="contained"
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
            >
              Volver a Servicios
            </Button>
          </Box>
        </Box>
      </CrudLayout>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // CONFIRMAR ANTES DE GUARDAR
      if (window.confirm(`¿Estás seguro de que quieres guardar los cambios en el servicio "${formData.nombre}"?`)) {
        console.log("Servicio actualizado:", formData);
        
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

  const handleCancel = () => {
    if (window.confirm("¿Estás seguro de que quieres cancelar? Los cambios no guardados se perderán.")) {
      navigate(-1);
    }
  };

  const formatPrice = (price) => {
    if (!price) return "";
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP' 
    }).format(price);
  };

  return (
    <CrudLayout
      title="✏️ Editar Servicio"
      description={`Editando: ${servicioData.nombre}`}
      showAddButton={false}
    >
      <Box className="formulario-container">
        {showSuccess && (
          <Box className="modal-overlay">
            <Box className="success-modal-content">
              <Box className="success-icon">✅</Box>
              <h3>¡Servicio Actualizado!</h3>
              <p>Los cambios en <strong>"{formData.nombre}"</strong> se han guardado correctamente.</p>
              <p className="redirect-message">Redirigiendo a servicios...</p>
            </Box>
          </Box>
        )}

        <Box className="formulario-header">
          <h3>📝 Editando: {servicioData.nombre}</h3>
          <p>Modifique la información del servicio según sea necesario</p>
        </Box>

        <form onSubmit={handleSubmit}>
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
              />
            </Box>
          </Box>

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
              />
            </Box>
          </Box>

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

          <Alert severity="info" sx={{ mb: 3 }}>
            Los campos marcados con * son obligatorios
          </Alert>

          <Box className="formulario-actions">
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            
            <Button
              variant="contained"
              startIcon={<Save />}
              type="submit"
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