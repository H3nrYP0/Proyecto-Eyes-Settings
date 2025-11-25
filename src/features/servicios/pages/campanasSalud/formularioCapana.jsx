// import { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import {
//   Box,
//   TextField,
//   Button,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Typography,
//   Alert
// } from "@mui/material";
// import { Save, Cancel, ArrowBack } from "@mui/icons-material";

// /**
//  * Componente de formulario reutilizable para Campañas de Salud
//  * Soporta tres modos: 'agregar', 'editar', 'ver'
//  */
// export default function FormularioCampana({ mode = 'agregar' }) {
//   // Hook de navegación para redirigir entre vistas
//   const navigate = useNavigate();
  
//   // Hook para acceder a los datos pasados por navegación
//   const location = useLocation();
  
//   // Estado del formulario con todos los campos de una campaña
//   const [formData, setFormData] = useState({
//     nombre: "",
//     descripcion: "",
//     fechaInicio: "",
//     fechaFin: "",
//     descuento: "",
//     estado: "inactiva"
//   });

//   // Estado para manejar errores de validación
//   const [errors, setErrors] = useState({});

//   // Estado para mensajes de éxito
//   const [successMessage, setSuccessMessage] = useState("");

//   /**
//    * Efecto que se ejecuta al cargar el componente
//    * Si estamos en modo editar o ver, carga los datos de la campaña
//    */
//   useEffect(() => {
//     if ((mode === 'editar' || mode === 'ver') && location.state?.campanaData) {
//       setFormData(location.state.campanaData);
//     }
//   }, [mode, location.state]);

//   /**
//    * Maneja los cambios en los campos del formulario
//    * @param {Object} e - Evento del cambio
//    */
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
    
//     // Limpiar error del campo cuando el usuario empiece a escribir
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ""
//       }));
//     }
//   };

//   /**
//    * Valida todos los campos del formulario
//    * @returns {boolean} True si el formulario es válido
//    */
//   const validateForm = () => {
//     const newErrors = {};

//     // Validar nombre
//     if (!formData.nombre.trim()) {
//       newErrors.nombre = "El nombre de la campaña es requerido";
//     }

//     // Validar descripción
//     if (!formData.descripcion.trim()) {
//       newErrors.descripcion = "La descripción es requerida";
//     }

//     // Validar fechas
//     if (!formData.fechaInicio) {
//       newErrors.fechaInicio = "La fecha de inicio es requerida";
//     }

//     if (!formData.fechaFin) {
//       newErrors.fechaFin = "La fecha de fin es requerida";
//     }

//     // Validar que la fecha fin sea mayor o igual a la fecha inicio
//     if (formData.fechaInicio && formData.fechaFin) {
//       const inicio = new Date(formData.fechaInicio);
//       const fin = new Date(formData.fechaFin);
//       if (fin < inicio) {
//         newErrors.fechaFin = "La fecha de fin debe ser mayor o igual a la fecha de inicio";
//       }
//     }

//     // Validar descuento
//     if (!formData.descuento.trim()) {
//       newErrors.descuento = "El descuento es requerido";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   /**
//    * Maneja el envío del formulario
//    * @param {Object} e - Evento del formulario
//    */
//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     if (validateForm()) {
//       // Simular envío de datos (en una app real, aquí iría la llamada a la API)
//       console.log('Datos del formulario:', formData);
      
//       // Mostrar mensaje de éxito
//       const message = mode === 'agregar' 
//         ? "Campaña creada exitosamente" 
//         : "Campaña actualizada exitosamente";
//       setSuccessMessage(message);
      
//       // Redirigir después de 2 segundos
//       setTimeout(() => {
//         navigate("/campanas-salud");
//       }, 2000);
//     }
//   };

//   /**
//    * Navega de regreso a la lista de campañas
//    */
//   const handleCancel = () => {
//     navigate("/campanas-salud");
//   };

//   // Determinar si el formulario está en modo solo lectura
//   const isViewMode = mode === 'ver';

//   return (
//     <div className="formulario-container">
//       {/* Encabezado del formulario */}
//       <div className="formulario-header">
//         <Typography variant="h4" component="h1" gutterBottom>
//           {mode === 'agregar' && "➕ Agregar Nueva Campaña"}
//           {mode === 'editar' && "✏️ Editar Campaña"}
//           {mode === 'ver' && "👁️ Ver Detalle de Campaña"}
//         </Typography>
//         <Typography variant="body1" color="textSecondary">
//           {mode === 'agregar' && "Completa el formulario para crear una nueva campaña de salud"}
//           {mode === 'editar' && "Modifica la información de la campaña de salud"}
//           {mode === 'ver' && "Información detallada de la campaña de salud"}
//         </Typography>
//       </div>

//       {/* Mensaje de éxito */}
//       {successMessage && (
//         <Alert severity="success" sx={{ mb: 3 }}>
//           {successMessage}
//         </Alert>
//       )}

//       {/* Formulario */}
//       <Box component="form" onSubmit={handleSubmit}>
//         {/* Sección de información básica */}
//         <div className="formulario-section">
//           <Typography variant="h5" component="h2" gutterBottom>
//             Información Básica
//           </Typography>
          
//           <div className="formulario-row">
//             {/* Campo: Nombre */}
//             <div className="formulario-group">
//               <label className="formulario-label">Nombre de la Campaña *</label>
//               <TextField
//                 name="nombre"
//                 value={formData.nombre}
//                 onChange={handleChange}
//                 error={!!errors.nombre}
//                 helperText={errors.nombre}
//                 disabled={isViewMode}
//                 fullWidth
//                 placeholder="Ej: Chequeo Visual Gratuito"
//               />
//             </div>

//             {/* Campo: Descuento */}
//             <div className="formulario-group">
//               <label className="formulario-label">Descuento *</label>
//               <TextField
//                 name="descuento"
//                 value={formData.descuento}
//                 onChange={handleChange}
//                 error={!!errors.descuento}
//                 helperText={errors.descuento}
//                 disabled={isViewMode}
//                 fullWidth
//                 placeholder="Ej: 20%, 100%, 50% OFF"
//               />
//             </div>
//           </div>

//           {/* Campo: Descripción */}
//           <div className="formulario-group">
//             <label className="formulario-label">Descripción *</label>
//             <TextField
//               name="descripcion"
//               value={formData.descripcion}
//               onChange={handleChange}
//               error={!!errors.descripcion}
//               helperText={errors.descripcion}
//               disabled={isViewMode}
//               fullWidth
//               multiline
//               rows={3}
//               placeholder="Describe los detalles y beneficios de la campaña..."
//             />
//           </div>
//         </div>

//         {/* Sección de fechas */}
//         <div className="formulario-section">
//           <Typography variant="h5" component="h2" gutterBottom>
//             Fechas de la Campaña
//           </Typography>
          
//           <div className="formulario-row">
//             {/* Campo: Fecha Inicio */}
//             <div className="formulario-group">
//               <label className="formulario-label">Fecha de Inicio *</label>
//               <TextField
//                 name="fechaInicio"
//                 type="date"
//                 value={formData.fechaInicio}
//                 onChange={handleChange}
//                 error={!!errors.fechaInicio}
//                 helperText={errors.fechaInicio}
//                 disabled={isViewMode}
//                 fullWidth
//                 InputLabelProps={{ shrink: true }}
//               />
//             </div>

//             {/* Campo: Fecha Fin */}
//             <div className="formulario-group">
//               <label className="formulario-label">Fecha de Fin *</label>
//               <TextField
//                 name="fechaFin"
//                 type="date"
//                 value={formData.fechaFin}
//                 onChange={handleChange}
//                 error={!!errors.fechaFin}
//                 helperText={errors.fechaFin}
//                 disabled={isViewMode}
//                 fullWidth
//                 InputLabelProps={{ shrink: true }}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Sección de estado (solo visible en agregar y editar) */}
//         {!isViewMode && (
//           <div className="formulario-section">
//             <Typography variant="h5" component="h2" gutterBottom>
//               Estado de la Campaña
//             </Typography>
            
//             <div className="formulario-group">
//               <FormControl fullWidth>
//                 <InputLabel>Estado</InputLabel>
//                 <Select
//                   name="estado"
//                   value={formData.estado}
//                   onChange={handleChange}
//                   label="Estado"
//                 >
//                   <MenuItem value="inactiva">Inactiva</MenuItem>
//                   <MenuItem value="en proceso">En Proceso</MenuItem>
//                   <MenuItem value="finalizada">Finalizada</MenuItem>
//                 </Select>
//               </FormControl>
//               <div className="formulario-help">
//                 Selecciona el estado inicial de la campaña
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Sección de estado (solo visible en modo ver) */}
//         {isViewMode && (
//           <div className="formulario-section">
//             <Typography variant="h5" component="h2" gutterBottom>
//               Estado Actual
//             </Typography>
            
//             <div className="formulario-group">
//               <label className="formulario-label">Estado</label>
//               <div className={`detail-value ${formData.estado === 'en proceso' ? 'status-active' : formData.estado === 'finalizada' ? 'status-completed' : 'status-inactive'}`}>
//                 {formData.estado === 'en proceso' ? 'En Proceso' : 
//                  formData.estado === 'finalizada' ? 'Finalizada' : 'Inactiva'}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Acciones del formulario */}
//         <div className="formulario-actions">
//           <Button
//             variant="outlined"
//             startIcon={<ArrowBack />}
//             onClick={handleCancel}
//             className="btn btn-secondary"
//           >
//             Volver
//           </Button>
          
//           {/* Mostrar botón de guardar solo en modos agregar y editar */}
//           {!isViewMode && (
//             <Button
//               type="submit"
//               variant="contained"
//               startIcon={<Save />}
//               className="btn btn-success"
//             >
//               {mode === 'agregar' ? 'Crear Campaña' : 'Guardar Cambios'}
//             </Button>
//           )}
//         </div>
//       </Box>
//     </div>
//   );
// }