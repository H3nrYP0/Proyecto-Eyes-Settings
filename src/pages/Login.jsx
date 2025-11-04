import { useState } from "react";
import "../styles/Home.css";

export default function Login({ onClose, onLogin }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Ingresa un nombre para continuar");
    onLogin(name);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Iniciar Sesión</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit">Entrar</button>
        </form>
        <button className="close-btn" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}
