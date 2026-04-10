import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import UsuarioForm      from "../components/UserForm";
import Loading          from "@shared/components/ui/Loading";
import CrudNotification from "@shared/styles/components/notifications/CrudNotification";

import { updateUser, buildUpdatePayload } from "@seguridad";
import { useUser }     from "../hooks/useUsuario";
import { useUserForm } from "../hooks/useUserForm";

export default function EditarUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [notification, setNotification] = useState({
    isVisible: false, message: "", type: "success",
  });
  const showNotification = (message, type = "success") =>
    setNotification({ isVisible: true, message, type });
  const handleCloseNotification = () =>
    setNotification((prev) => ({ ...prev, isVisible: false }));

  const { user, roles, loading } = useUser(id);

  const {
    formData, errors, isSubmitting, setIsSubmitting,
    handleChange, handleTelefonoChange, handleNumeroDocumentoChange,
    validate, setFieldError, setFormData,
  } = useUserForm(user, "edit");

  useEffect(() => {
    if (user) setFormData(user);
  }, [user]);

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const includePassword = !!formData.password;
      const payload = buildUpdatePayload(formData, includePassword);
      await updateUser(id, payload);
      sessionStorage.setItem(
        "crudNotification",
        JSON.stringify({ message: `Usuario "${formData.nombre}" actualizado correctamente`, type: "success" })
      );
      navigate("/admin/seguridad/usuarios");
    } catch (error) {
      const msg = error.message || "Error al editar usuario";
      if (error.message?.includes("correo")) {
        setFieldError("email", error.message);
      } else {
        showNotification(msg, "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loading message="Cargando..." />;

  return (
    <>
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

      <CrudNotification
        isVisible={notification.isVisible}
        message={notification.message}
        type={notification.type}
        onClose={handleCloseNotification}
      />
    </>
  );
}