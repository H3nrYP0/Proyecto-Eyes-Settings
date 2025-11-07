import { useState } from "react";
import "../../../shared/styles/features/Home.css";

export default function Register({ onClose, onRegister }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Ingresa un nombre para continuar");
    onRegister(name);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Registrarse</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit">Crear cuenta</button>
        </form>
        <button className="close-btn" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}
