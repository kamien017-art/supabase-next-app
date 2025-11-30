import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nationality, setNationality] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null); // <--- ID użytkownika, którego edytujemyertrtre

  // Pobieranie użytkowników
  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const { data, error } = await supabase.from('users').select('*');
    if (error) console.error(error);
    else setUsers(data);
  }

  // Dodawanie lub edycja użytkownika
  const handleSubmit = async () => {
    if (!name) {
      setMessage('Podaj imię!');
      return;
    }

    setLoading(true);
    setMessage('');

    if (editingId) {
      // 🔁 AKTUALIZACJA
      const { error } = await supabase
        .from('users')
        .update({ name, email, nationality })
        .eq('id', editingId);

      if (error) {
        setMessage(`Błąd przy aktualizacji: ${error.message}`);
      } else {
        setMessage('Użytkownik zaktualizowany!');
        resetForm();
        fetchUsers();
      }
    } else {
      // ➕ DODAWANIE
      const { error } = await supabase
        .from('users')
        .insert([{ name, email, nationality }]);

      if (error) {
        setMessage(`Błąd przy dodawaniu: ${error.message}`);
      } else {
        setMessage('Użytkownik dodany!');
        resetForm();
        fetchUsers();
      }
    }

    setLoading(false);
  };

  // Kliknięcie "Edytuj" – wypełnij formularz danymi użytkownika
  const handleEdit = (user) => {
    setEditingId(user.id);
    setName(user.name);
    setEmail(user.email);
    setNationality(user.nationality);
    setMessage('');
  };

  // Reset formularza
  const resetForm = () => {
    setEditingId(null);
    setName('');
    setEmail('');
    setNationality('');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 600, margin: 'auto' }}>
      <h1>Pracownicy</h1>

      {/* Tabela z użytkownikami */}
      <table border="1" cellPadding="6" style={{ width: '100%', marginBottom: '2rem' }}>
        <thead>
          <tr>
            <th>Id</th>
            <th>Imię i nazwisko</th>
            <th>Adres mailowy</th>
            <th>Narodowość</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.nationality}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Edytuj</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Formularz dodawania/edycji */}
      <div style={{ marginTop: '2rem' }}>
        <h2>{editingId ? 'Edytuj użytkownika' : 'Dodaj nowego użytkownika'}</h2>
        <input
          type="text"
          placeholder="Imię i nazwisko"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '1rem' }}
        />
        <input
          type="text"
          placeholder="Adres mailowy"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '1rem' }}
        />
        <input
          type="text"
          placeholder="Narodowość"
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '1rem' }}
        />

        <button onClick={handleSubmit} disabled={loading} style={{ padding: '10px 20px' }}>
          {loading
            ? editingId
              ? 'Aktualizuję...'
              : 'Dodaję...'
            : editingId
              ? 'Zapisz zmiany'
              : 'Dodaj użytkownika'}
        </button>

        {editingId && (
          <button
            onClick={resetForm}
            style={{ marginLeft: '1rem', padding: '10px 20px' }}
          >
            Anuluj
          </button>
        )}

        {message && (
          <p style={{ marginTop: '1rem', color: message.includes('Błąd') ? 'red' : 'green' }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
