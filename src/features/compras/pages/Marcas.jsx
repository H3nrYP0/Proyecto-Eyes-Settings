import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../shared/components/layouts/CrudLayout";
import "../../../shared/styles/components/CrudLayout.css";

// Datos de ejemplo
const marcasIniciales = [
  { id: 1, nombre: "Ray-Ban", estado: true },
  { id: 2, nombre: "Oakley", estado: true },
  { id: 3, nombre: "Essilor", estado: true },
  { id: 4, nombre: "Johnson & Johnson", estado: true }
];

export default function Marcas() {
  const navigate = useNavigate();
  const [marcas, setMarcas] = useState(marcasIniciales);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [marcaToDelete, setMarcaToDelete] = useState(null);

  const handleAddMarca = () => {
    navigate("/admin/marcas/crear");
  };

  const handleEdit = (marca) => {
    navigate(`/admin/marcas/editar/${marca.id}`);
  };

  const handleDelete = (marca) => {
    setMarcaToDelete(marca);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setMarcas(marcas.filter(m => m.id !== marcaToDelete.id));
    setIsDeleteModalOpen(false);
    setMarcaToDelete(null);
    alert("Marca eliminada exitosamente");
  };

  const toggleStatus = (marcaId) => {
    setMarcas(marcas.map(marca =>
      marca.id === marcaId
        ? { ...marca, estado: !marca.estado }
        : marca
    ));
  };

  return (
    <>
      <CrudLayout
        title="🏷️ Marcas"
        description="Administra las marcas de los productos de la óptica."
        onAddClick={handleAddMarca}
      >
        <div className="table-responsive-container">
          <div className="crud-center">
            <table className="crud-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {marcas.map((marca) => (
                  <tr key={marca.id}>
                    <td>{marca.nombre}</td>
                    <td>
                      <span 
                        className={`status-text ${marca.estado ? 'status-active' : 'status-inactive'}`}
                        onClick={() => toggleStatus(marca.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        {marca.estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="actions">
                      <button 
                        title="Editar" 
                        onClick={() => handleEdit(marca)}
                        className="action-btn edit-btn"
                      >
                        ✏️
                      </button>
                      <button 
                        title="Eliminar" 
                        onClick={() => handleDelete(marca)}
                        className="action-btn delete-btn"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CrudLayout>

      <Modal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Eliminación"
      >
        <p>¿Estás seguro de que deseas eliminar la marca <strong>"{marcaToDelete?.nombre}"</strong>?</p>
        <p className="warning-text">
          ⚠️ Esta acción no se puede deshacer.
        </p>
        
        <div className="confirmation-actions">
          <button 
            className="btn btn-secondary" 
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancelar
          </button>
          <button 
            className="btn btn-danger" 
            onClick={confirmDelete}
          >
            Sí, Eliminar
          </button>
        </div>
      </Modal>
    </>
  );
}