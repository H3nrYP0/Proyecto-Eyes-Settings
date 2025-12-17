import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCliente } from '../../../../lib/data/clientesData';
import "../../../../shared/styles/components/crud-forms.css";

import { 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem 
} from '@mui/material';


export default function CrearCliente() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    tipoDocumento: 'cedula',
    documento: '',
    telefono: '',
    correo: '',
    ciudad: '',
    direccion: '',
    fechaNacimiento: '',
    genero: 'masculino'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createCliente(formData);
    navigate('/admin/ventas/clientes');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="crud-form-container minimal">
      <div className="crud-form-header minimal">
        <h1>Crear Cliente</h1>
      </div>
      
      <div className="crud-form-content compact">
        <form onSubmit={handleSubmit}>
          <div className="crud-form-section compact">
            {/* Fila 1 */}
            <div className="crud-form-group">
              <TextField
                fullWidth
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ingrese el nombre"
                required
                variant="outlined"
                InputLabelProps={{
                  style: { fontWeight: 'normal' }
                }}
              />
            </div>

            <div className="crud-form-group">
              <TextField
                fullWidth
                label="Apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Ingrese el apellido"
                required
                variant="outlined"
                InputLabelProps={{
                  style: { fontWeight: 'normal' }
                }}
              />
            </div>

            {/* Fila 2 */}
            <div className="crud-form-group">
              <FormControl fullWidth>
                <InputLabel 
                  style={{ fontWeight: 'normal' }}
                >
                  Tipo Documento
                </InputLabel>
                <Select
                  name="tipoDocumento"
                  value={formData.tipoDocumento}
                  onChange={handleChange}
                  label="Tipo Documento"
                  required
                >
                  <MenuItem value="">Seleccione tipo</MenuItem>
                  <MenuItem value="cedula">Cédula</MenuItem>
                  <MenuItem value="pasaporte">Pasaporte</MenuItem>
                  <MenuItem value="cedula_extranjeria">Cédula Extranjería</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="crud-form-group">
              <TextField
                fullWidth
                label="Número de Documento"
                name="documento"
                value={formData.documento}
                onChange={handleChange}
                placeholder="Ingrese el número de documento"
                required
                variant="outlined"
                InputLabelProps={{
                  style: { fontWeight: 'normal' }
                }}
              />
            </div>

            {/* Fila 3 */}
            <div className="crud-form-group">
              <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Ingrese el teléfono"
                required
                variant="outlined"
                InputLabelProps={{
                  style: { fontWeight: 'normal' }
                }}
              />
            </div>

            <div className="crud-form-group">
              <TextField
                fullWidth
                label="Correo Electrónico"
                name="correo"
                type="email"
                value={formData.correo}
                onChange={handleChange}
                placeholder="ejemplo@correo.com"
                variant="outlined"
                InputLabelProps={{
                  style: { fontWeight: 'normal' }
                }}
              />
            </div>

            {/* Fila 4 */}
            <div className="crud-form-group">
              <TextField
                fullWidth
                label="Fecha de Nacimiento"
                name="fechaNacimiento"
                type="date"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                variant="outlined"
                InputLabelProps={{ 
                  shrink: true,
                  style: { fontWeight: 'normal' }
                }}
                required
              />
            </div>

            <div className="crud-form-group">
              <FormControl fullWidth>
                <InputLabel 
                  style={{ fontWeight: 'normal' }}
                >
                  Género
                </InputLabel>
                <Select
                  name="genero"
                  value={formData.genero}
                  onChange={handleChange}
                  label="Género"
                  required
                >
                  <MenuItem value="">Seleccione género</MenuItem>
                  <MenuItem value="masculino">Masculino</MenuItem>
                  <MenuItem value="femenino">Femenino</MenuItem>
                  <MenuItem value="otro">Otro</MenuItem>
                </Select>
              </FormControl>
            </div>

            {/* Fila 5 */}
            <div className="crud-form-group">
              <TextField
                fullWidth
                label="Ciudad"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                placeholder="Ingrese la ciudad"
                required
                variant="outlined"
                InputLabelProps={{
                  style: { fontWeight: 'normal' }
                }}
              />
            </div>

            <div className="crud-form-group">
              <TextField
                fullWidth
                label="Dirección"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Ingrese la dirección"
                variant="outlined"
                InputLabelProps={{
                  style: { fontWeight: 'normal' }
                }}
              />
            </div>
          </div>

          <div className="crud-form-actions compact">
            <button 
              type="button" 
              className="crud-btn crud-btn-secondary"
              onClick={() => navigate('/admin/ventas/clientes')}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="crud-btn crud-btn-primary"
            >
              Registrar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}