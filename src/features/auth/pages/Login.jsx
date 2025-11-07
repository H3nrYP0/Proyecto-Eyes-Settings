import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Ingresa un nombre para continuar");
    
    const userData = { name: name.trim() };
    setUser(userData);
    navigate("/admin");
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
      </div>
    </div>
  );
}