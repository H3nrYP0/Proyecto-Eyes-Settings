// src/features/compras/pages/Proveedores.jsx - CON BÚSQUEDA ESPECÍFICA
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProveedores } from '../context/ProveedoresContext';
import CrudLayout from "../../../shared/components/layouts/CrudLayout";
import "../../../shared/styles/components/CrudLayout.css";

export default function Proveedores() {
  const navigate = useNavigate();
  const { state, actions } = useProveedores();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('');

  const handleAddProveedor = () => {
    navigate('/admin/compras/proveedores/crear');
  };

  const handleEdit = (id) => {
    navigate(`/admin/compras/proveedores/editar/${id}`);
  };

  const handleView = (id) => {
    navigate(`/admin/compras/proveedores/detalle/${id}`);
  };

  const handleDelete = (id, razonSocial) => {
    if (window.confirm(`¿Estás seguro de eliminar al proveedor "${razonSocial}"?`)) {
      actions.deleteProveedor(id);
    }
  };

  const handleToggleEstado = (id, razonSocial, currentEstado) => {
    const newEstado = currentEstado === "Activo" ? "Inactivo" : "Activo";
    if (window.confirm(`¿Cambiar estado de "${razonSocial}" a ${newEstado}?`)) {
      actions.toggleEstado(id);
    }
  };

  // FILTRADO CON BÚSQUEDA Y FILTROS
  const filteredProveedores = state.proveedores.filter(proveedor => {
    const matchesSearch = 
      proveedor.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.nit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.contacto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.ciudad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.telefono.includes(searchTerm);
    
    const matchesFilter = !filterEstado || proveedor.estado === filterEstado;
    
    return matchesSearch && matchesFilter;
  });

  // FILTROS DISPONIBLES
  const searchFilters = [
    { value: 'Activo', label: 'Activos' },
    { value: 'Inactivo', label: 'Inactivos' }
  ];

  return (
    <CrudLayout
      title="🚚 Proveedores"
      description="Administra los proveedores de productos para la óptica."
      onAddClick={handleAddProveedor}
      showSearch={true}
      searchPlaceholder="Buscar proveedores..."
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      searchFilters={searchFilters}
      onFilterChange={setFilterEstado}
    >
      <div className="crud-center">
        
        {/* ESTADÍSTICAS DE BÚSQUEDA */}
        <div className="search-stats">
          <p>
            Mostrando <strong>{filteredProveedores.length}</strong> de <strong>{state.proveedores.length}</strong> proveedores
            {searchTerm && (
              <span> para "<strong>{searchTerm}</strong>"</span>
            )}
            {filterEstado && (
              <span> - Filtrado por: <strong>{filterEstado}</strong></span>
            )}
          </p>
        </div>

        <table className="crud-table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Razón Social</th>
              <th>NIT</th>
              <th>Contacto</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Ciudad</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProveedores.map(proveedor => (
              <tr key={proveedor.id}>
                <td>
                  <span className={`badge-${proveedor.tipo === "Persona Jurídica" ? 'juridica' : 'natural'}`}>
                    {proveedor.tipo}
                  </span>
                </td>
                <td>
                  <strong>{proveedor.razonSocial}</strong>
                </td>
                <td>
                  <code>{proveedor.nit}</code>
                </td>
                <td>{proveedor.contacto}</td>
                <td>{proveedor.telefono}</td>
                <td>
                  <a href={`mailto:${proveedor.correo}`} className="email-link">
                    {proveedor.correo}
                  </a>
                </td>
                <td>{proveedor.ciudad}</td>
                <td>
                  <span 
                    className={`status-badge status-${proveedor.estado.toLowerCase()}`}
                    onClick={() => handleToggleEstado(proveedor.id, proveedor.razonSocial, proveedor.estado)}
                    title={`Click para cambiar a ${proveedor.estado === "Activo" ? "Inactivo" : "Activo"}`}
                  >
                    {proveedor.estado === "Activo" ? "✅ Activo" : "❌ Inactivo"}
                  </span>
                </td>
                <td className="actions">
                  <button 
                    title="Ver detalles"
                    onClick={() => handleView(proveedor.id)}
                    className="btn-view"
                  >
                    👁️
                  </button>
                  <button 
                    title="Editar"
                    onClick={() => handleEdit(proveedor.id)}
                    className="btn-edit"
                  >
                    ✏️
                  </button>
                  <button 
                    title="Eliminar"
                    onClick={() => handleDelete(proveedor.id, proveedor.razonSocial)}
                    className="btn-delete"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredProveedores.length === 0 && (
          <div className="no-data">
            {searchTerm || filterEstado ? 
              `No se encontraron proveedores para los filtros aplicados` : 
              'No hay proveedores registrados'
            }
            {!searchTerm && !filterEstado && (
              <button 
                onClick={handleAddProveedor}
                className="btn-primary"
                style={{marginTop: '1rem'}}
              >
                ➕ Agregar Primer Proveedor
              </button>
            )}
          </div>
        )}
      </div>
    </CrudLayout>
  );
}