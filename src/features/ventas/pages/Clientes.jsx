import CrudLayout from "../../../shared/components/layouts/CrudLayout";
import "../../../shared/styles/components/CrudLayout.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Clientes() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const clientesGuardados = localStorage.getItem('clientes');
    if (clientesGuardados) {
      setClientes(JSON.parse(clientesGuardados));
    }
  }, []);

  const handleAddCliente = () => {
    navigate("nuevo");
  };

  const handleViewDetail = (cliente) => {
    navigate("detalle", { state: { cliente } });
  };

  const handleEdit = (cliente) => {
    navigate("editar", { state: { cliente } });
  };

  const handleHistorialFormula = (cliente) => {
    navigate("historial-formula", { state: { cliente } });
  };

  const handleDelete = (cliente) => {
    if (window.confirm(`¿Estás seguro de eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`)) {
      const nuevosClientes = clientes.filter(c => 
        c.documento !== cliente.documento || 
        c.nombre !== cliente.nombre || 
        c.apellido !== cliente.apellido
      );
      setClientes(nuevosClientes);
      localStorage.setItem('clientes', JSON.stringify(nuevosClientes));
    }
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.documento.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.ciudad.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <CrudLayout
      title="Clientes"
      description="Administra la información de los clientes de la óptica."
      onAddClick={handleAddCliente}
    >
      <div className="crud-controls">
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="crud-center">
        <table className="crud-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Documento</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Ciudad</th>
              <th>Fecha Nacimiento</th>
              <th>Género</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredClientes.map((cliente, index) => (
              <tr key={index}>
                <td>{cliente.nombre}</td>
                <td>{cliente.apellido}</td>
                <td>{cliente.documento}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.correo}</td>
                <td>{cliente.ciudad}</td>
                <td>{cliente.fechaNacimiento}</td>
                <td>{cliente.genero}</td>
                <td className="actions">
                  <button 
                    className="action-btn view-btn"
                    onClick={() => handleViewDetail(cliente)}
                  >
                    Ver Detalles
                  </button>
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => handleEdit(cliente)}
                  >
                    Editar
                  </button>
                  <button 
                    className="action-btn formula-btn"
                    onClick={() => handleHistorialFormula(cliente)}
                  >
                    Historial Fórmula
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(cliente)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {filteredClientes.length === 0 && (
              <tr>
                <td colSpan="9" className="no-data">
                  {clientes.length === 0 ? 'No hay clientes registrados' : 'No se encontraron clientes'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </CrudLayout>
  );
}