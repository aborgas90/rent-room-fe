// hooks/useUsers.js
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export const useUsers = (roleFilter) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/management/users?role=${roleFilter === 'all' ? '' : roleFilter}`);
        const data = await response.json();
        setUsers(data.data);
      } catch (error) {
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [roleFilter]);

  return { users, setUsers, loading };
};
