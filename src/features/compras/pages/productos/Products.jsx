import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../../shared/components/layouts/CrudLayout";
import "../../../../shared/styles/components/Products.css";

// Importaciones de Material-UI
import { Box, TextField } from "@mui/material";
import { Search } from "@mui/icons-material";

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Lente Solar Ray-Ban Aviator",
      salePrice: 150000,
      currentStock: 25,
      status: "active",
    },
    {
      id: 2,
      name: "Montura Acetato Negro",
      salePrice: 80000,
      currentStock: 15,
      status: "active",
    },
    {
      id: 3,
      name: "Lentes de Contacto Diarios",
      salePrice: 120000,
      currentStock: 8,
      status: "low-stock",
    },
    {
      id: 4,
      name: "Estuche para Lentes",
      salePrice: 25000,
      currentStock: 30,
      status: "active",
    }
  ]);

  // Estado para la búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddProduct = () => {
    navigate("nuevo"); 
  };

  const handleEdit = (productId) => {
    const productoSeleccionado = products.find(product => product.id === productId);
    
    if (productoSeleccionado) {
      navigate("editar", { 
        state: { 
          productData: productoSeleccionado
        } 
      });
    } else {
      alert("Producto no encontrado");
    }
  };

  const handleViewDetail = (productId) => {
    const productoSeleccionado = products.find(product => product.id === productId);
    
    if (productoSeleccionado) {
      navigate("detalle", { 
        state: { 
          productData: productoSeleccionado
        } 
      });
    } else {
      alert("Producto no encontrado");
    }
  };

  const handleDelete = (productId, productName) => {
    if (window.confirm(`¿Eliminar "${productName}"?`)) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const handleChangeStatus = (productId, currentStatus, productName) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const statusText = newStatus === "active" ? "activar" : "desactivar";
    
    if (window.confirm(`¿${statusText} "${productName}"?`)) {
      setProducts(products.map(p => p.id === productId ? { ...p, status: newStatus } : p));
    }
  };

  // Filtrar productos basado en el término de búsqueda
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP' 
    }).format(price);
  };

  const getStatusClass = (status) => {
    const classes = { 
      'active': 'status-active', 
      'inactive': 'status-inactive', 
      'low-stock': 'status-warning' 
    };
    return classes[status] || 'status-inactive';
  };

  const getStatusText = (status) => {
    const texts = { 
      'active': 'Activo', 
      'inactive': 'Inactivo', 
      'low-stock': 'Bajo Stock' 
    };
    return texts[status] || 'Inactivo';
  };

  return (
    <CrudLayout
      title="📦 Productos"
      description="Administra el inventario de productos de la óptica."
      onAddClick={handleAddProduct}
    >
      {/* BARRA DE BÚSQUEDA - Filtrado en tiempo real */}
      <Box className="search-container">
        <TextField
          placeholder="Buscar productos por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          className="search-input"
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          sx={{
            width: '100%',
            maxWidth: '400px',
            mb: 2
          }}
        />
        
        {/* Contador de resultados */}
        <Box className="search-results">
          <span className="results-count">
            {filteredProducts.length} de {products.length} productos
          </span>
        </Box>
      </Box>

      <div className="table-container">
        <table className="crud-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio Venta</th>
              <th>Stock Actual</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td className="price">{formatPrice(product.salePrice)}</td>
                  <td className="stock">{product.currentStock}</td>
                  <td>
                    <span 
                      className={getStatusClass(product.status)}
                      onClick={() => handleChangeStatus(product.id, product.status, product.name)}
                      title="Click para cambiar estado"
                    >
                      {getStatusText(product.status)}
                    </span>
                  </td>
                  <td className="actions">
                    <button 
                      className="btn-view"
                      onClick={() => handleViewDetail(product.id)}
                    >
                      Ver Detalle
                    </button>
                    <button 
                      className="btn-edit"
                      onClick={() => handleEdit(product.id)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(product.id, product.name)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-results">
                  <div className="no-results-content">
                    <span className="no-results-icon">🔍</span>
                    <h3>No se encontraron productos</h3>
                    <p>
                      {searchTerm 
                        ? `No hay resultados para "${searchTerm}"`
                        : "No hay productos registrados"
                      }
                    </p>
                    {searchTerm && (
                      <button
                        className="btn btn-primary"
                        onClick={() => setSearchTerm("")}
                      >
                        Limpiar búsqueda
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </CrudLayout>
  );
}