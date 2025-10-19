import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [carid, setCarid] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Pobieranie użytkowników
  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const { data, error } = await supabase.from('users').select('*');
    if (error) console.error(error);
    else setUsers(data);
  }

  // Dodawanie nowego użytkownika
  const handleAddUser = async () => {
    if (!name) {
      setMessage('Podaj imię!');
      return;
    }
    setLoading(true);
    setMessage('');
    const caridValue = carid ? parseInt(carid) : null;

    const { data, error } = await supabase
      .from('users')
      .insert([{ name, carid: caridValue }]);

    if (error) {
      setMessage(`Błąd: ${error.message}`);
    } else {
      setMessage('Użytkownik dodany pomyślnie!');
      setName('');
      setCarid('');
      fetchUsers(); // Odśwież listę po dodaniu
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 600, margin: 'auto' }}>
      <h1>Pracownicy Adusi</h1>

      {/* Tabela z użytkownikami */}
      <table border="1" cellPadding="6" style={{ width: '100%', marginBottom: '2rem' }}>
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

      {/* Formularz dodawania */}
      <div style={{ marginTop: '2rem' }}>
        <h2>Dodaj nowego użytkownika</h2>
        <input
          type="text"
          placeholder="Imię"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '1rem' }}
        />
        <input
          type="number"
          placeholder="CarID (opcjonalnie)"
          value={carid}
          onChange={(e) => setCarid(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '1rem' }}
        />
        <button onClick={handleAddUser} disabled={loading} style={{ padding: '10px 20px' }}>
          {loading ? 'Dodaję...' : 'Dodaj użytkownika'}
        </button>
        {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
      </div>
    </div>
  );
}
