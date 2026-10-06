import { useState, useEffect } from 'react';

export function useEntities(service, entityLabel) {
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEntities = async () => {
    setLoading(true);
    try {
      const data = await service.list();
      setEntities(data);
    } catch (err) {
      console.error(`Error fetching ${entityLabel}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntities();
  }, [service]);

  const createEntity = async (data) => {
    try {
      await service.create(data);
      await fetchEntities();
    } catch (err) {
      console.error(`Error creating ${entityLabel}:`, err);
      throw err;
    }
  };

  const deleteEntity = async (id) => {
    try {
      await service.remove(id);
      await fetchEntities();
    } catch (err) {
      console.error(`Error deleting ${entityLabel}:`, err);
      throw err;
    }
  };

  return { entities, loading, fetchEntities, createEntity, deleteEntity };
}
