import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductoForm from "../components/ProductoForm";
import ChatBotContainer from "../components/ChatBotContainer";
import { ProductoData } from "../../../../../lib/data/productosData";
import { MarcaData } from "../../../../../lib/data/marcasData";
import { categoriasService } from "../../categoria";
import CreateProductPresentational from "../Presentational/CreateProductPresentational";

export default function CreateProductContainer() {
  const navigate = useNavigate();
  // const [loading, setLoading] = useState(false);
  
  const [notification, setNotification] = useState({
    message: '',
    type: 'success',
    isVisible: false
  });

  const [marcaModal, setMarcaModal] = useState({
    open: false,
    loading: false
  });
  
  const [categoriaModal, setCategoriaModal] = useState({
    open: false,
    loading: false
  });

  

  const [chatBotOpen, setChatBotOpen] = useState(false);
  const [refreshMarcas, setRefreshMarcas] = useState(0);
  const [refreshCategorias, setRefreshCategorias] = useState(0);
  const [formMode, setFormMode] = useState("create");
  
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type, isVisible: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, isVisible: false }));
    }, 3000);
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  const handleSubmit = async (data) => {
    try {
      // setLoading(true);
      await ProductoData.createProducto(data);
      
      localStorage.setItem('productoNotification', JSON.stringify({
        message: "Producto creado exitosamente",
        type: "success"
      }));
      
      navigate("/admin/compras/productos");
    } catch (error) {
      console.error("Error al crear producto:", error);
      
      localStorage.setItem('productoNotification', JSON.stringify({
        message: "Error al crear el producto",
        type: "error"
      }));
      
      navigate("/admin/compras/productos");
    } finally {
      // setLoading(false);
    }
  };

  const handleOpenMarcaModal = () => {
    setMarcaModal({ open: true, loading: false });
  };

  const handleCloseMarcaModal = () => {
    setMarcaModal({ open: false, loading: false });
  };

  const handleMarcaSubmit = async (data) => {
    try {
      setMarcaModal(prev => ({ ...prev, loading: true }));
      await MarcaData.createMarca(data);
      setRefreshMarcas(prev => prev + 1);
      handleCloseMarcaModal();
      showNotification("Marca creada exitosamente", "success");
    } catch (error) {
      console.error("Error al crear marca:", error);
      showNotification("Error al crear la marca", "error");
    } finally {
      setMarcaModal(prev => ({ ...prev, loading: false }));
    }
  };

  const handleOpenCategoriaModal = () => {
    setCategoriaModal({ open: true, loading: false });
  };

  const handleCloseCategoriaModal = () => {
    setCategoriaModal({ open: false, loading: false });
  };

  const handleCategoriaSubmit = async (data) => {
    try {
      setCategoriaModal(prev => ({ ...prev, loading: true }));
      await CategoriaData.createCategoria(data);
      setRefreshCategorias(prev => prev + 1);
      handleCloseCategoriaModal();
      showNotification("Categoría creada exitosamente", "success");
    } catch (error) {
      console.error("Error al crear categoría:", error);
      showNotification("Error al crear la categoría", "error");
    } finally {
      setCategoriaModal(prev => ({ ...prev, loading: false }));
    }
  };
    const handleOpenChatBot = () => setChatBotOpen(true);
  const handleCloseChatBot = () => setChatBotOpen(false);

  const handleNavigateToExisting = () => {
   
    setFormMode("full-create"); 
    handleCloseChatBot();
    // showNotification("Registrando producto existente - Formulario completo", "success");
  };
  const handleNewProduct = () => {
    setFormMode("create");
    handleCloseChatBot();
    showNotification("Creando producto nuevo desde cero", "info");
  };
  return (
    <CreateProductPresentational
      // loading={loading}
      notification={notification}
      hideNotification={hideNotification}
      marcaModal={marcaModal}
      categoriaModal={categoriaModal}
      refreshMarcas={refreshMarcas}
      refreshCategorias={refreshCategorias}
      chatBotOpen={chatBotOpen}
      onOpenChatBot={handleOpenChatBot}
      onCloseChatBot={handleCloseChatBot}
      onConfirmExisting={handleNavigateToExisting} 
      onNewProduct={handleNewProduct}
      formMode={formMode}
      
      handleSubmit={handleSubmit}
      handleOpenMarcaModal={handleOpenMarcaModal}
      handleCloseMarcaModal={handleCloseMarcaModal}
      handleMarcaSubmit={handleMarcaSubmit}
      handleOpenCategoriaModal={handleOpenCategoriaModal}
      handleCloseCategoriaModal={handleCloseCategoriaModal}
      handleCategoriaSubmit={handleCategoriaSubmit}
      navigate={navigate}
    />
  );
}