import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const { data, error } = await supabase.from('users').select('*');
      if (error) console.error(error);
      else setUsers(data);
    }
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Lista użytkowników</h1>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>ID</th>
            <th>Imię</th>
            <th>CarID</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.carid ?? 'brak'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
