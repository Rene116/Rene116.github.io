import axios from 'axios';
import { useEffect, useState } from 'react';

export function Startups() {
  const [startups, setStartups] = useState([]);
  const [form, setForm] = useState({
    name: '',
    foundation_date: '',
    location: '',
    category: '',
    investment_received: '',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    getStartups();
  }, []);

  const getStartups = async () => {
    try {
      const res = await axios.get('https://gatewayretociid.onrender.com/api/startups/read');
      setStartups(res.data);
    } catch (error) {
      console.error('Error fetching startups:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `https://gatewayretociid.onrender.com/api/startups/update/${editingId}`,
          form
        );
        setStartups((prev) =>
          prev.map((s) => (s.id === editingId ? { ...s, ...form } : s))
        );
      } else {
        const res = await axios.post(
          'https://gatewayretociid.onrender.com/api/startup/create',
          form
        );
        setStartups((prev) => [...prev, res.data]);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }

    resetForm();
  };

  const handleEdit = (startup) => {
    const newDate = startup.foundation_date.split('T')[0];
    setForm({ ...startup, foundation_date: newDate });
    setEditingId(startup.id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this startup?'))
      return;

    try {
      await axios.delete(`https://gatewayretociid.onrender.com/api/startups/delete/${id}`);
      setStartups((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error('Error deleting startup:', error);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: '',
      foundation_date: '',
      location: '',
      category: '',
      investment_received: '',
    });
  };

  return (
    <div className="container">
      <h2 className="text-xl mb-4">Manage Startups</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2"
          required
        />
        <input
          type="date"
          value={form.foundation_date}
          onChange={(e) =>
            setForm({ ...form, foundation_date: e.target.value })
          }
          className="border p-2"
          required
          readOnly={!!editingId}
        />
        <input
          type="text"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="border p-2"
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border p-2"
          required
        />
        <input
          type="number"
          placeholder="Investment Received"
          value={form.investment_received}
          onChange={(e) =>
            setForm({ ...form, investment_received: e.target.value })
          }
          className="border p-2"
          required
        />
        <button type="submit" className="button success">
          {editingId ? 'Update' : 'Add'} Startup
        </button>
        {editingId && (
          <button className="cancel" onClick={cancelEdit}>
            Cancel
          </button>
        )}
      </form>
      <table className="lista">
        <thead>
          <tr>
            <th>NAME</th>
            <th>FOUNDATION DATE</th>
            <th className="location">LOCATION</th>
            <th className="category">CATEGORY</th>
            <th>INVESTMENT RECEIVED</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {startups.map((s) => (
            <tr key={s.id} className="tabla-data">
              <td>{s.name}</td>
              <td>{s.foundation_date.split('T')[0]}</td>
              <td className="location">{s.location}</td>
              <td className="category">{s.category}</td>
              <td>{s.investment_received}</td>
              <td>
                <button onClick={() => handleEdit(s)} className="info">
                  Edit
                </button>
                <button onClick={() => handleDelete(s.id)} className="danger">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
