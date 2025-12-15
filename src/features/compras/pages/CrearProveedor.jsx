import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Select, 
  MenuItem, 
  InputLabel,
  FormControl,
  FormHelperText
} from '@mui/material';
import { createProveedor } from '../../../lib/data/proveedoresData';
import "../../../shared/styles/components/crud-forms.css";

export default function CrearProveedor() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tipo_proveedor: 'Persona Jurídica',
    tipoDocumento: 'NIT',
    documento: '',
    razon_social: '',
    contacto_nombre: '',
    telefono: '',
    correo: '',
    departamento: '',
    municipio: '',
    direccion: '',
    estado: true
  });

  const [errors, setErrors] = useState({});

  const departamentos = [
    'Antioquia', 'Atlántico', 'Bogotá D.C.', 'Bolívar', 'Boyacá',
    'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó',
    'Córdoba', 'Cundinamarca', 'Guainía', 'Guaviare', 'Huila',
    'La Guajira', 'Magdalena', 'Meta', 'Nariño', 'Norte de Santander',
    'Putumayo', 'Quindío', 'Risaralda', 'San Andrés', 'Santander',
    'Sucre', 'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada'
  ];

  const municipiosPorDepartamento = {
    'Antioquia': ['Medellín', 'Bello', 'Itagüí', 'Envigado', 'Sabaneta'],
    'Bogotá D.C.': ['Bogotá D.C.'],
    'Cundinamarca': ['Soacha', 'Fusagasugá', 'Girardot', 'Facatativá'],
    'Valle del Cauca': ['Cali', 'Palmira', 'Buga', 'Tuluá'],
    'Santander': ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta'],
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    if (!formData.razon_social.trim()) {
      newErrors.razon_social = 'La razón social o nombre es requerido';
    } else if (formData.razon_social.trim().length < 3) {
      newErrors.razon_social = 'Mínimo 3 caracteres';
    }
    
    if (!formData.tipoDocumento) {
      newErrors.tipoDocumento = 'Seleccione un tipo de documento';
    }
    
    if (!formData.documento.trim()) {
      newErrors.documento = 'El número de documento es requerido';
    } else {
      const documento = formData.documento.trim();
      
      if (formData.tipoDocumento === 'NIT') {
        if (!/^[0-9]{9,10}$/.test(documento)) {
          newErrors.documento = 'NIT inválido (9-10 dígitos)';
        }
      } else if (formData.tipoDocumento === 'CC') {
        if (!/^[0-9]{6,10}$/.test(documento)) {
          newErrors.documento = 'Cédula inválida (6-10 dígitos)';
        }
      } else if (formData.tipoDocumento === 'CE') {
        if (!/^[0-9]{6,10}$/.test(documento)) {
          newErrors.documento = 'Cédula extranjería inválida (6-10 dígitos)';
        }
      }
    }
    
    if (!formData.contacto_nombre.trim()) {
      newErrors.contacto_nombre = 'El nombre de contacto es requerido';
    } else if (formData.contacto_nombre.trim().length < 2) {
      newErrors.contacto_nombre = 'Mínimo 2 caracteres';
    }
    
    const telefonoRegex = /^[0-9]{7,15}$/;
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (!telefonoRegex.test(formData.telefono.replace(/\s/g, ''))) {
      newErrors.telefono = 'Teléfono inválido (7-15 dígitos)';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo electrónico es requerido';
    } else if (!emailRegex.test(formData.correo)) {
      newErrors.correo = 'Formato de email inválido';
    } else if (!formData.correo.includes('@') || !formData.correo.includes('.')) {
      newErrors.correo = 'Debe contener "@" y "."';
    }
    
    if (!formData.departamento) {
      newErrors.departamento = 'Seleccione un departamento';
    }
    
    if (!formData.municipio) {
      newErrors.municipio = 'Seleccione un municipio';
    }
    
    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida';
    } else if (formData.direccion.trim().length < 5) {
      newErrors.direccion = 'Dirección muy corta (mínimo 5 caracteres)';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErrorField = Object.keys(newErrors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    const proveedorData = {
      ...formData,
      razon_social_o_Nombre: formData.razon_social,
      Contacto: formData.contacto_nombre,
      estado: true
    };
    
    createProveedor(proveedorData);
    navigate('/admin/compras/proveedores');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (name === 'departamento') {
      setFormData(prev => ({
        ...prev,
        departamento: value,
        municipio: ''
      }));
    }
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  return (
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Crear Nuevo Proveedor</h1>
      </div>
      
      <div className="crud-form-content">
        <form onSubmit={handleSubmit}>
          <div className="crud-form-section">
            {/* Tipo de Proveedor */}
            <div className="crud-form-group">
              <FormControl fullWidth error={!!errors.tipo_proveedor}>
                <InputLabel style={{ fontWeight: 'normal' }}>
                  Tipo de Proveedor
                </InputLabel>
                <Select
                  name="tipo_proveedor"
                  value={formData.tipo_proveedor}
                  onChange={handleChange}
                  label="Tipo de Proveedor"
                  required
                >
                  <MenuItem value="Persona Jurídica">Persona Jurídica</MenuItem>
                  <MenuItem value="Persona Natural">Persona Natural</MenuItem>
                </Select>
                {errors.tipo_proveedor && (
                  <FormHelperText error>{errors.tipo_proveedor}</FormHelperText>
                )}
              </FormControl>
            </div>

            {/* Razón Social / Nombre */}
            <div className="crud-form-group">
              <TextField
                fullWidth
                label={formData.tipo_proveedor === 'Persona Jurídica' ? "Razón Social" : "Nombre Completo"}
                name="razon_social"
                value={formData.razon_social}
                onChange={handleChange}
                placeholder={formData.tipo_proveedor === 'Persona Jurídica' ? "Ej: Empresa S.A.S." : "Ej: Juan Pérez"}
                required
                variant="outlined"
                error={!!errors.razon_social}
                helperText={errors.razon_social}
                InputLabelProps={{ style: { fontWeight: 'normal' } }}
              />
            </div>

            {/* Tipo de Documento */}
            <div className="crud-form-group">
              <FormControl fullWidth error={!!errors.tipoDocumento}>
                <InputLabel style={{ fontWeight: 'normal' }}>
                  Tipo de Documento
                </InputLabel>
                <Select
                  name="tipoDocumento"
                  value={formData.tipoDocumento}
                  onChange={handleChange}
                  label="Tipo de Documento"
                  required
                >
                  <MenuItem value="NIT">NIT</MenuItem>
                  <MenuItem value="CC">Cédula de Ciudadanía</MenuItem>
                  <MenuItem value="CE">Cédula de Extranjería</MenuItem>
                </Select>
                {errors.tipoDocumento && (
                  <FormHelperText error>{errors.tipoDocumento}</FormHelperText>
                )}
              </FormControl>
            </div>

            {/* Número de Documento */}
            <div className="crud-form-group">
              <TextField
                fullWidth
                label="Número de Documento"
                name="documento"
                value={formData.documento}
                onChange={handleChange}
                placeholder={formData.tipoDocumento === 'NIT' ? "Ej: 901234567-8" : "Ej: 1234567890"}
                required
                variant="outlined"
                error={!!errors.documento}
                helperText={errors.documento}
                InputLabelProps={{ style: { fontWeight: 'normal' } }}
              />
            </div>

            {/* Persona de Contacto */}
            <div className="crud-form-group">
              <TextField
                fullWidth
                label="Persona de Contacto"
                name="contacto_nombre"
                value={formData.contacto_nombre}
                onChange={handleChange}
                placeholder="Ej: María González"
                required
                variant="outlined"
                error={!!errors.contacto_nombre}
                helperText={errors.contacto_nombre}
                InputLabelProps={{ style: { fontWeight: 'normal' } }}
              />
            </div>

            {/* Teléfono */}
            <div className="crud-form-group">
              <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Ej: 3001234567"
                required
                variant="outlined"
                error={!!errors.telefono}
                helperText={errors.telefono}
                InputLabelProps={{ style: { fontWeight: 'normal' } }}
              />
            </div>

            {/* Correo Electrónico */}
            <div className="crud-form-group">
              <TextField
                fullWidth
                label="Correo Electrónico"
                name="correo"
                type="email"
                value={formData.correo}
                onChange={handleChange}
                placeholder="proveedor@ejemplo.com"
                required
                variant="outlined"
                error={!!errors.correo}
                helperText={errors.correo}
                InputLabelProps={{ style: { fontWeight: 'normal' } }}
              />
            </div>

            {/* Departamento */}
            <div className="crud-form-group">
              <FormControl fullWidth error={!!errors.departamento}>
                <InputLabel style={{ fontWeight: 'normal' }}>
                  Departamento
                </InputLabel>
                <Select
                  name="departamento"
                  value={formData.departamento}
                  onChange={handleChange}
                  label="Departamento"
                  required
                >
                  <MenuItem value="">Seleccione un departamento</MenuItem>
                  {departamentos.map((depto) => (
                    <MenuItem key={depto} value={depto}>
                      {depto}
                    </MenuItem>
                  ))}
                </Select>
                {errors.departamento && (
                  <FormHelperText error>{errors.departamento}</FormHelperText>
                )}
              </FormControl>
            </div>

            {/* Municipio/Ciudad */}
            <div className="crud-form-group">
              <FormControl fullWidth error={!!errors.municipio} disabled={!formData.departamento}>
                <InputLabel style={{ fontWeight: 'normal' }}>
                  Municipio/Ciudad
                </InputLabel>
                <Select
                  name="municipio"
                  value={formData.municipio}
                  onChange={handleChange}
                  label="Municipio/Ciudad"
                  required
                >
                  <MenuItem value="">Seleccione un municipio</MenuItem>
                  {formData.departamento && municipiosPorDepartamento[formData.departamento]?.map((municipio) => (
                    <MenuItem key={municipio} value={municipio}>
                      {municipio}
                    </MenuItem>
                  ))}
                  {formData.departamento && (!municipiosPorDepartamento[formData.departamento] || municipiosPorDepartamento[formData.departamento].length === 0) && (
                    <MenuItem value={formData.departamento}>
                      {formData.departamento}
                    </MenuItem>
                  )}
                </Select>
                {errors.municipio && (
                  <FormHelperText error>{errors.municipio}</FormHelperText>
                )}
              </FormControl>
            </div>

            {/* Dirección */}
            <div className="crud-form-group">
              <TextField
                fullWidth
                label="Dirección"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Ej: Calle 123 #45-67, Barrio Centro"
                required
                variant="outlined"
                multiline
                rows={3}
                error={!!errors.direccion}
                helperText={errors.direccion}
                InputLabelProps={{ style: { fontWeight: 'normal' } }}
              />
            </div>
          </div>

          <div className="crud-form-actions">
            <button 
              type="button" 
              className="crud-btn crud-btn-secondary"
              onClick={() => navigate('/admin/compras/proveedores')}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="crud-btn crud-btn-primary"
            >
              Crear Proveedor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}