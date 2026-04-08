import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserForm } from "../hooks/useUserForm";
import { createUser } from "../services/userServices";
import { getAllRoles } from "@seguridad/roles/services/rolServices";
import { buildCreatePayload } from "../utils/userNormalizer";
import Loading from "@shared/components/ui/Loading";
import UserForm from "../components/UserForm";

export default function CrearUser() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const {
    formData,
    errors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleTelefonoChange,
    handleNumeroDocumentoChange,
    validate,
    setFieldError
  } = useUserForm(null, 'create');

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const rolesData = await getAllRoles();
        setRoles(rolesData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadRoles();
  }, []);

  const handleSubmit = async () => {
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      const payload = buildCreatePayload(formData);
      await createUser(payload);
      navigate("/admin/seguridad/usuarios");
    } catch (error) {
      console.error(error);
      if (error.message.includes("correo")) {
        setFieldError("email", error.message);
      } else if (error.message.includes("contraseña")) {
        setFieldError("password", error.message);
      } else {
        alert(error.message || "Error al crear usuario");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loading message="Cargando roles..." />;

  return (
    <UserForm
      mode="create"
      title="Crear Nuevo Usuario"
      initialData={formData}
      rolesDisponibles={roles}
      errors={errors}
      onChange={handleChange}
      onTelefonoChange={handleTelefonoChange}
      onNumeroDocumentoChange={handleNumeroDocumentoChange}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/admin/seguridad/usuarios")}
      isSubmitting={isSubmitting}
    />
  );
}