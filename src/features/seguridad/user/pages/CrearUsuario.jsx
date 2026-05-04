import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useUserForm } from "../hooks/useUserForm";
import { createUser } from "../services/userServices";
import { getAllRoles } from "@seguridad/roles/services/rolServices";
import { buildCreatePayload } from "../utils/userNormalizer";
import Loading          from "@shared/components/ui/Loading";
import UserForm         from "../components/UserForm";
import CrudNotification from "@shared/styles/components/notifications/CrudNotification";

export default function CrearUser() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [notification, setNotification] = useState({
    isVisible: false, message: "", type: "success",
  });
  const showNotification = (message, type = "success") =>
    setNotification({ isVisible: true, message, type });
  const handleCloseNotification = () =>
    setNotification((prev) => ({ ...prev, isVisible: false }));

  // ['roles'] — reutiliza caché global, cero petición si ya se cargó antes
  const { data: roles = [], isLoading: loadingRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: getAllRoles,
    staleTime: 5 * 60 * 1000,
  });

  const {
    formData, errors, isSubmitting, setIsSubmitting,
    handleChange, handleTelefonoChange, handleNumeroDocumentoChange,
    validate, setFieldError,
  } = useUserForm(null, "create");

  const createMutation = useMutation({
    mutationFn: (payload) => createUser(payload),
    onSuccess: () => {
      // Invalida la lista para que se refresque al volver
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      sessionStorage.setItem(
        "crudNotification",
        JSON.stringify({ message: `Usuario "${formData.nombre}" creado correctamente`, type: "success" })
      );
      navigate("/admin/seguridad/usuarios");
    },
    onError: (error) => {
      const msg = error.message || "Error al crear usuario";
      if (error.message?.includes("correo")) {
        setFieldError("email", error.message);
      } else if (error.message?.includes("contraseña")) {
        setFieldError("password", error.message);
      } else {
        showNotification(msg, "error");
      }
      setIsSubmitting(false);
    },
  });

  const handleSubmit = () => {
    if (!validate()) return;
    setIsSubmitting(true);
    createMutation.mutate(buildCreatePayload(formData));
  };

  if (loadingRoles) return <Loading message="Cargando roles..." />;

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