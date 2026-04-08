import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import UsuarioForm from "../components/UserForm";
import Loading     from "@shared/components/ui/Loading";

import {
  getUserById,
  updateUser,
  getAllRoles,
  normalizeUserInitialData,
  buildUpdatePayload
} from "@seguridad";

import { useUser }     from "../hooks/useUsuario";
import { useUserForm } from "../hooks/useUserForm";

export default function EditarUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Carga de datos del usuario y roles
  const { user, roles, loading } = useUser(id);

  // Formulario inicializado con los datos del usuario
  const {
    formData,
    errors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleTelefonoChange,
    handleNumeroDocumentoChange,
    validate,
    setFieldError,
    setFormData
  } = useUserForm(user, 'edit');

  // Sincronizar formData cuando lleguen los datos del usuario
  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // Incluye contraseña solo si el usuario la escribió
      const includePassword = !!formData.password;
      const payload = buildUpdatePayload(formData, includePassword);
      await updateUser(id, payload);
      navigate("/admin/seguridad/usuarios");
    } catch (error) {
      console.error(error);
      if (error.message?.includes("correo")) {
        setFieldError("email", error.message);
      } else {
        alert(error.message || "Error al editar usuario");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loading message="Cargando..." />;

  return (
    <UsuarioForm
      mode="edit"
      title={`Editar Usuario: ${formData?.nombre}`}
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