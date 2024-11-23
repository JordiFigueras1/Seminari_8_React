import { useState } from 'react';

export default function ExperienciaList({ experiencias = [], onDeleteExperience, onEditExperience }) {
  if (!experiencias.length) return <p>No hay experiencias disponibles.</p>;

  return (
    <div>
      <h2>Lista de Experiencias</h2>
      <ul>
        {experiencias.map((exp) => (
          <li key={exp._id}>
            <p><strong>Descripción:</strong> {exp.description}</p>
            <p><strong>Dueño:</strong> {exp.owner}</p>
            <p><strong>Participantes:</strong> {exp.participants.join(', ')}</p>
            <button onClick={() => onEditExperience(exp)}>Editar</button> {/* Botón Editar */}
            <button onClick={() => onDeleteExperience(exp._id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
