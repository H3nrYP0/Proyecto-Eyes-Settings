import axios from "../axios";

export const UserData = {

  // ===============================
  // OBTENER TODOS
  // ===============================
  async getAllUsers() {
    try {
      const response = await axios.get("/usuarios");
      return response.data;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  },

  // ===============================
  // OBTENER POR ID
  // ===============================
  async getUserById(id) {
    try {
      const response = await axios.get(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      throw error;
    }
  },

  // ===============================
  // CREAR
  // ===============================
  async createUser(data) {
    try {
      const response = await axios.post("/usuarios", {
        nombre: data.nombre,
        correo: data.correo,
        contrasenia: data.contrasenia,
        rol_id: data.rol_id,
        estado: true
      });

      return response.data;
    } catch (error) {
      console.error("Error al crear usuario:", error);
      throw error;
    }
  },

  // ===============================
  // ACTUALIZAR
  // ===============================
  async updateUser(id, data) {
    try {
      const response = await axios.put(`/usuarios/${id}`, {
        nombre: data.nombre,
        correo: data.correo,
        contrasenia: data.contrasenia,
        rol_id: data.rol_id
      });

      return response.data;
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      throw error;
    }
  },

  // ===============================
  // ELIMINAR
  // ===============================
  async deleteUser(id) {
    try {
      await axios.delete(`/usuarios/${id}`);
      return true;
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      throw error;
    }
  },

  // ===============================
  // TOGGLE ESTADO
  // ===============================
  async toggleUserEstado(usuario, nuevoEstado) {
  try {
    console.log("usuario recibido:", usuario);
    console.log("nuevoEstado recibido:", nuevoEstado);
    
    const payload = {
      nombre: usuario.nombre,
      correo: usuario.correo,
      contrasenia: usuario.contrasenia,
      rol_id: usuario.rol_id,
      estado: nuevoEstado === "activo"
    };
    
    console.log("payload enviado:", payload);
    
    const response = await axios.put(`/usuarios/${usuario.id}`, payload);
    console.log("respuesta backend:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al cambiar estado:", error);
    throw error;
  }
}

};