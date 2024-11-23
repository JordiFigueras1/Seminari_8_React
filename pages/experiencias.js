import { useEffect, useState } from 'react';
import ExperienciaList from '../components/ExperienciaList';
import ExperienciaForm from '../components/ExperienciaForm';

export default function Experiencias() {
  const [experiencias, setExperiencias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editExperiencia, setEditExperiencia] = useState(null); // Nueva experiencia en edición
  const URL = "http://localhost:3000/api/experiencias";

  useEffect(() => {
    setLoading(true);
    const fetchExperiencias = async () => {
      try {
        const response = await fetch(URL);
        const data = await response.json();
        setExperiencias(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchExperiencias();
  }, []);

  const handleExperienciaSubmit = async (newExperiencia) => {
    try {
      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExperiencia),
      });

      if (!response.ok) {
        throw new Error('Error al crear la experiencia');
      }

      const data = await response.json();
      setExperiencias([...experiencias, data]);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleEditSubmit = async (updatedExperiencia) => {
    try {
      const response = await fetch(`${URL}/${updatedExperiencia._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedExperiencia),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la experiencia');
      }

      const data = await response.json();
      setExperiencias(
        experiencias.map((exp) =>
          exp._id === updatedExperiencia._id ? data : exp
        )
      );
      setEditExperiencia(null); // Limpia el formulario de edición
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleDeleteExperience = async (expId) => {
    try {
      const response = await fetch(`${URL}/${expId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la experiencia');
      }

      setExperiencias(experiencias.filter((exp) => exp._id !== expId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditExperience = (exp) => {
    setEditExperiencia(exp); // Establece la experiencia en edición
  };

  return (
    <div>
      <h1>Gestión de Experiencias</h1>
      {loading && <p>Cargando experiencias...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && (
        <>
          <ExperienciaList
            experiencias={experiencias}
            onDeleteExperience={handleDeleteExperience}
            onEditExperience={handleEditExperience} // Pasar función de edición
          />
          {editExperiencia ? (
            <ExperienciaForm
              onSubmit={handleEditSubmit}
              initialData={editExperiencia} // Pasar datos iniciales al formulario
            />
          ) : (
            <ExperienciaForm onSubmit={handleExperienciaSubmit} />
          )}
        </>
      )}
    </div>
  );
}
