import axios from 'axios';
import { useEffect, useState } from 'react';

export function Technologies() {
  const [technologies, setTechnologies] = useState([]);
  const [form, setForm] = useState({
    name: '',
    sector: '',
    description: '',
    adoption_stage: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({
    name: '',
    sector: '',
    adoption_stage: '',
  });

  useEffect(() => {
    getTechnologies();
  }, []);

  const getTechnologies = async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    await axios
      .get(`https://gatewayretociid.onrender.com/api/technologies/read?${query}`)
      .then((res) => setTechnologies(res.data));
  };

  const handleFilter = (e) => {
    e.preventDefault();
    getTechnologies(filters);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(
        `https://gatewayretociid.onrender.com/api/technologies/update/${editingId}`,
        form
      );
    } else {
      await axios.post('https://gatewayretociid.onrender.com/api/technologies/create', form);
    }
    setEditingId(null);
    setForm({ name: '', sector: '', description: '', adoption_stage: '' });
    getTechnologies();
  };

  const handleEdit = (tech) => {
    setForm(tech);
    setEditingId(tech.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`https://gatewayretociid.onrender.com/api/technologies/delete/${id}`);
    setTechnologies(technologies.filter((t) => t.id !== id));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', sector: '', description: '', adoption_stage: '' });
  };

  return (
    <div className="container">
      <h2 className="text-xl mb-4">Manage Technologies</h2>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2"
          required
          readOnly={!!editingId}
        />
        <input
          type="text"
          placeholder="Sector"
          value={form.sector}
          onChange={(e) => setForm({ ...form, sector: e.target.value })}
          className="border p-2"
          required
          readOnly={!!editingId}
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-2"
          required
        ></textarea>
        <input
          type="text"
          placeholder="Adoption Stage"
          value={form.adoption_stage}
          onChange={(e) => setForm({ ...form, adoption_stage: e.target.value })}
          className="border p-2"
          required
        />
        <button type="submit" className="success">
          {editingId ? 'Update' : 'Add'} Technology
        </button>
        {editingId && (
          <button className="cancel" onClick={cancelEdit}>
            Cancel
          </button>
        )}
      </form>
      <div className="filter">
        <h3>Filtros</h3>
        <form onSubmit={handleFilter} className="form mb-4">
          <input
            type="text"
            placeholder="Filter by Name"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            className="border p-2"
          />
          <input
            type="text"
            placeholder="Filter by Sector"
            value={filters.sector}
            onChange={(e) => setFilters({ ...filters, sector: e.target.value })}
            className="border p-2"
          />
          <input
            type="text"
            placeholder="Filter by Adoption Stage"
            value={filters.adoption_stage}
            onChange={(e) =>
              setFilters({ ...filters, adoption_stage: e.target.value })
            }
            className="border p-2"
          />
          <button type="submit" className="info">
            Search
          </button>
        </form>
      </div>
      <table className="lista">
        <thead>
          <tr>
            <th>NAME</th>
            <th>SECTOR</th>
            <th>DESCRIPTION</th>
            <th className='adoption'>ADOPTION STAGE</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {technologies.map((t) => {
            return (
              <tr key={t.id} className="tabla-data">
                <td>{t.name}</td>
                <td>{t.sector}</td>
                <td>{t.description}</td>
                <td className='adoption'>{t.adoption_stage}</td>
                <td>
                  <button onClick={() => handleEdit(t)} className="info">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="danger">
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table> 
    </div>
  );
}
