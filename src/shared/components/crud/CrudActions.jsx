// src/shared/components/ui/CrudActions.jsx
// Botonera de acciones reutilizable (texto). No la forzamos en la tabla por ahora,
// pero puedes importarla si quieres usarla en otro componente.

import React from 'react';

export default function CrudActions({ onView, onEdit, onDelete }) {
  return (
    <div className="actions">
      <button className="action-text" onClick={onView}>Ver Detalles</button>
      <button className="action-text" onClick={onEdit}>Editar</button>
      <button className="action-text danger" onClick={onDelete}>Eliminar</button>
    </div>
  );
}
