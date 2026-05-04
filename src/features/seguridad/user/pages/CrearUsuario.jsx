import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { useUserForm }      from "../hooks/useUserForm";
import { createUser }       from "../services/userServices";
import { getAllRoles }       from "@seguridad/roles/services/rolServices";
import { buildCreatePayload } from "../utils/userNormalizer";

import Loading          from "@shared/components/ui/Loading";
import UserForm         from "../components/UserForm";
import CrudNotification from "@shared/styles/components/notifications/CrudNotification";

export default function CrearUsuario() {
  const navigate = useNavigate();

  const [notification, setNotification] = useState({
    isVisible: false, message: "", type: "success",
  });
  const showNotification = (message, type = "success") =>
    setNotification({ isVisible: true, message, type });
  const handleCloseNotification = () =>
    setNotification((prev) => ({ ...prev, isVisible: false }));

  // React Query — roles cacheados, no se recargan en cada visita
  const { data: roles = [], isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: getAllRoles,
    staleTime: 1000 * 60 * 10, // 10 min — los roles cambian poco
  });

  const {
    formData, errors, isSubmitting, setIsSubmitting,
    handleChange, handleTelefonoChange, handleNumeroDocumentoChange,
    validate, setFieldError,
  } = useUserForm(null, "create");

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = buildCreatePayload(formData);
      await createUser(payload);
      sessionStorage.setItem(
        "crudNotification",
        JSON.stringify({ message: `Usuario "${formData.nombre}" creado correctamente`, type: "success" })
      );
      navigate("/admin/seguridad/usuarios");
    } catch (error) {
      const msg = error.message || "Error al crear usuario";
      if (error.message?.includes("correo")) {
        setFieldError("email", error.message);
      } else if (error.message?.includes("contraseña")) {
        setFieldError("password", error.message);
      } else {
        showNotification(msg, "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loading message="Cargando roles..." />;

  return (
    <>
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

      <CrudNotification
        isVisible={notification.isVisible}
        message={notification.message}
        type={notification.type}
        onClose={handleCloseNotification}
      />
    </>
  );
}