import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Roles locales (sin archivo externo)
const ROLES = {
  ADMIN: 'admin',
  DEMO: 'demo', 
  VENDEDOR: 'vendedor',
  OPTICO: 'optico'
};

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(ROLES.ADMIN);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Ingresa correo y contraseña para continuar");
      return;
    }

    const userData = { 
      name: email.split('@')[0], 
      email,
      role,
      permissions: getPermissionsByRole(role)
    };
    setUser(userData);
    navigate("/admin/dashboard");
  };

  const getPermissionsByRole = (role) => {
    const permissionsMap = {
      [ROLES.ADMIN]: ['*'],
      [ROLES.DEMO]: ['dashboard'],
      [ROLES.VENDEDOR]: ['dashboard', 'ventas', 'clientes'],
      [ROLES.OPTICO]: ['dashboard', 'servicios', 'agenda']
    };
    return permissionsMap[role] || ['dashboard'];
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>👁️</span>
          </div>
          <h1 style={styles.title}>Visual Outlet</h1>
          <p style={styles.subtitle}>Inicia sesión en tu cuenta</p>
        </div>

        {/* Error */}
        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            style={styles.select}
          >
            <option value={ROLES.ADMIN}>Administrador</option>
            <option value={ROLES.DEMO}>Usuario Demo</option>
            <option value={ROLES.VENDEDOR}>Vendedor</option>
            <option value={ROLES.OPTICO}>Óptico</option>
          </select>

          <button type="submit" style={styles.submitButton}>
            Iniciar sesión
          </button>
        </form>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            ¿No tienes una cuenta?{" "}
            <button 
              onClick={() => navigate("/register")}
              style={styles.linkButton}
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// Estilos en objeto
const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #e3f2fd 0%, #f3f8ff 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem"
  },
  card: {
    background: "white",
    padding: "3rem",
    borderRadius: "1rem",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px"
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem"
  },
  logo: {
    width: "60px",
    height: "60px",
    background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1rem",
    fontSize: "1.5rem"
  },
  logoIcon: {
    color: "white"
  },
  title: {
    color: "#1976d2",
    margin: "0 0 0.5rem 0",
    fontSize: "1.5rem"
  },
  subtitle: {
    color: "#666",
    margin: 0,
    fontSize: "0.95rem"
  },
  error: {
    background: "#fee2e2",
    color: "#dc2626",
    padding: "0.75rem",
    borderRadius: "0.5rem",
    marginBottom: "1rem",
    fontSize: "0.85rem"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  },
  input: {
    padding: "0.75rem 1rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.5rem",
    fontSize: "0.95rem"
  },
  select: {
    padding: "0.75rem 1rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.5rem",
    fontSize: "0.95rem",
    background: "white"
  },
  submitButton: {
    padding: "0.75rem",
    background: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "0.95rem",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "0.5rem"
  },
  footer: {
    textAlign: "center",
    marginTop: "2rem"
  },
  footerText: {
    color: "#666",
    fontSize: "0.85rem",
    margin: 0
  },
  linkButton: {
    background: "none",
    border: "none",
    color: "#1976d2",
    cursor: "pointer",
    fontWeight: "600"
  }
};