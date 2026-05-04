import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import UsuarioForm      from "../components/UserForm";
import Loading          from "@shared/components/ui/Loading";
import CrudNotification from "@shared/styles/components/notifications/CrudNotification";

import { updateUser, buildUpdatePayload } from "@seguridad";
import { getAllRoles } from "@seguridad/roles/services/rolServices";
import { getUserById } from "../services/userServices";
import { normalizeUserInitialData } from "../utils/userNormalizer";
import { useUserForm } from "../hooks/useUserForm";

export default function EditarUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [notification, setNotification] = useState({
    isVisible: false, message: "", type: "success",
  });
  const showNotification = (message, type = "success") =>
    setNotification({ isVisible: true, message, type });
  const handleCloseNotification = () =>
    setNotification((prev) => ({ ...prev, isVisible: false }));

  const { data: userData, isLoading: loadingUser, error: userError } = useQuery({
    queryKey: ['usuario', id],
    queryFn: async () => {
      const data = await getUserById(id);
      if (!data) throw new Error('Usuario no encontrado');
      return normalizeUserInitialData(data);
    },
    enabled: !!id,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const { data: roles = [], isLoading: loadingRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: getAllRoles,
    staleTime: 5 * 60 * 1000,
  });

  // Solo se inicializa el hook cuando userData ya existe — evita el render con null
  const {
    formData, errors, isSubmitting, setIsSubmitting,
    handleChange, handleTelefonoChange, handleNumeroDocumentoChange,
    validate, setFieldError,
  } = useUserForm(userData ?? null, "edit");

  const updateMutation = useMutation({
    mutationFn: (payload) => updateUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      queryClient.invalidateQueries({ queryKey: ['usuario', id] });
      sessionStorage.setItem(
        "crudNotification",
        JSON.stringify({ message: `Usuario "${formData.nombre}" actualizado correctamente`, type: "success" })
      );
      navigate("/admin/seguridad/usuarios");
    },
    onError: (error) => {
      const msg = error.message || "Error al editar usuario";
      if (error.message?.includes("correo")) {
        setFieldError("email", error.message);
      } else {
        showNotification(msg, "error");
      }
      setIsSubmitting(false);
    },
  });

  const handleSubmit = () => {
    if (!validate()) return;
    setIsSubmitting(true);
    const includePassword = !!formData.password;
    updateMutation.mutate(buildUpdatePayload(formData, includePassword));
  };

  if (loadingUser || loadingRoles) return <Loading message="Cargando..." />;

  if (userError || !userData) {
    navigate("/admin/seguridad/usuarios");
    return null;
  }

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