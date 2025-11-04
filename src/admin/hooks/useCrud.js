import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function useCrud({ 
  moduleName, 
  initialData, 
  listRoute,
  api 
}) {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [data, setData] = useState(initialData);
  const [currentItem, setCurrentItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const esEdicion = Boolean(id);

  // Cargar datos si es edición
  useEffect(() => {
    if (esEdicion && id) {
      const itemExistente = data.find(item => item.id === parseInt(id));
      if (itemExistente) {
        setCurrentItem(itemExistente);
      } else {
        alert(`${moduleName} no encontrado`);
        navigate(listRoute);
      }
    }
  }, [id, esEdicion, navigate, data, moduleName, listRoute]);

  const handleCreate = () => {
    navigate(`${listRoute}/crear`);
  };

  const handleEdit = (item) => {
    navigate(`${listRoute}/editar/${item.id}`);
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setData(prevData => prevData.filter(item => item.id !== itemToDelete.id));
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
    alert(`${moduleName} eliminado exitosamente`);
  };

  const handleSave = (formData) => {
    if (esEdicion) {
      // Actualizar item existente
      setData(prevData => 
        prevData.map(item => 
          item.id === parseInt(id) ? { ...formData, id: parseInt(id) } : item
        )
      );
      alert(`${moduleName} actualizado exitosamente`);
    } else {
      // Crear nuevo item
      const newItem = {
        ...formData,
        id: Math.max(...data.map(item => item.id), 0) + 1
      };
      setData(prevData => [...prevData, newItem]);
      alert(`${moduleName} creado exitosamente`);
    }

    navigate(listRoute);
  };

  const handleCancel = () => {
    if (window.confirm("¿Estás seguro de que deseas cancelar? Los cambios no guardados se perderán.")) {
      navigate(listRoute);
    }
  };

  const toggleStatus = (itemId) => {
    setData(prevData => prevData.map(item =>
      item.id === itemId
        ? { ...item, estado: !item.estado }
        : item
    ));
  };

  return {
    data,
    currentItem,
    itemToDelete,
    isDeleteModalOpen,
    esEdicion,
    setIsDeleteModalOpen,
    setItemToDelete,
    handleCreate,
    handleEdit,
    handleDelete,
    confirmDelete,
    handleSave,
    handleCancel,
    toggleStatus
  };
}