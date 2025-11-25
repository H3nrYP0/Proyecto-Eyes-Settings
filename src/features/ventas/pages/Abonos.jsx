import CrudLayout from "../../../shared/components/layouts/CrudLayout";
import "../../../shared/styles/components/CrudLayout.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Abonos() {
  const navigate = useNavigate();
  const [abonos, setAbonos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const abonosGuardados = localStorage.getItem('abonos');
    if (abonosGuardados) {
      setAbonos(JSON.parse(abonosGuardados));
    }
  }, []);

  const handleAddAbono = () => {
    navigate("nuevo");
  };

  const handleViewDetail = (abono) => {
    navigate("detalle", { state: { abono } });
  };

  const handleEdit = (abono) => {
    navigate("editar", { state: { abono } });
  };

  const handleDelete = (abono) => {
    if (window.confirm(`¿Estás seguro de eliminar este abono de ${abono.cliente}?`)) {
      const nuevosAbonos = abonos.filter(a => 
        a.cliente !== abono.cliente || 
        a.fechaAbono !== abono.fechaAbono ||
        a.montoAbonado !== abono.montoAbonado
      );
      setAbonos(nuevosAbonos);
      localStorage.setItem('abonos', JSON.stringify(nuevosAbonos));
    }
  };

  const filteredAbonos = abonos.filter(abono =>
    abono.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    abono.metodoPago.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <CrudLayout
      title="Abonos"
      description="Gestiona los abonos y pagos a crédito de los clientes."
      onAddClick={handleAddAbono}
    >
      <div className="crud-controls">
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar abonos..."
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
              <th>Cliente</th>
              <th>Fecha Abono</th>
              <th>Monto Abonado</th>
              <th>Saldo Pendiente</th>
              <th>Método Pago</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredAbonos.map((abono, index) => (
              <tr key={index}>
                <td>{abono.cliente}</td>
                <td>{abono.fechaAbono}</td>
                <td>${abono.montoAbonado.toLocaleString()}</td>
                <td>${abono.saldoPendiente.toLocaleString()}</td>
                <td>
                  <span className={`badge badge-${abono.metodoPago}`}>
                    {abono.metodoPago}
                  </span>
                </td>
                <td className="actions">
                  <button 
                    className="action-btn view-btn"
                    onClick={() => handleViewDetail(abono)}
                  >
                    Ver Detalles
                  </button>
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => handleEdit(abono)}
                  >
                    Editar
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(abono)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {filteredAbonos.length === 0 && (
              <tr>
                <td colSpan="6" className="no-data">
                  {abonos.length === 0 ? 'No hay abonos registrados' : 'No se encontraron abonos'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </CrudLayout>
  );
}