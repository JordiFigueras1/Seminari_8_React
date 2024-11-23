import { useState, useEffect } from 'react';

export default function ExperienciaForm({ onSubmit, initialData = null }) {
  const [description, setDescription] = useState('');
  const [owner, setOwner] = useState('');
  const [participants, setParticipants] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Sincronizar los datos iniciales (initialData) con el estado local
  useEffect(() => {
    if (initialData) {
      setDescription(initialData.description || '');
      setOwner(initialData.owner || '');
      setParticipants(initialData.participants || []);
    }
  }, [initialData]); // Se ejecuta cada vez que initialData cambia

  // Cargar usuarios desde el backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/user`);
        const data = await response.json();
        setUsers(data);
        setLoadingUsers(false);
      } catch (err) {
        console.error('Error al cargar los usuarios:', err);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (description && owner) {
      const experienciaData = {
        ...initialData, // Incluye el ID si existe
        description,
        owner,
        participants,
      };
      onSubmit(experienciaData);
    } else {
      alert('Debes completar todos los campos');
    }
  };

  if (loadingUsers) return <p>Cargando usuarios...</p>;

  return (
    <form key={initialData?._id || 'new'} onSubmit={handleSubmit}>
      <h2>{initialData ? 'Editar Experiencia' : 'Crear Experiencia'}</h2>
      <div>
        <label>Descripción de la experiencia:</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
  
      <div>
        <label>Seleccionar dueño:</label>
        <select value={owner} onChange={(e) => setOwner(e.target.value)}>
          <option value="">--Selecciona un usuario--</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
  
      <div>
        <label>Seleccionar participantes:</label>
        <select
          multiple
          value={participants}
          onChange={(e) => {
            const selectedParticipants = Array.from(
              e.target.selectedOptions,
              (option) => option.value
            );
            setParticipants(selectedParticipants);
          }}
        >
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
  
      <button type="submit">{initialData ? 'Actualizar' : 'Crear'}</button>
    </form>
  );
  
}
