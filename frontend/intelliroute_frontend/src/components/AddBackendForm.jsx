import { useState } from 'react';
import '../styles/AddBackendForm.css';

function AddBackendForm({ onBackendAdded, token }) {
  const [formData, setFormData] = useState({ name: '', url: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!formData.name.trim()) {
        setError('Backend name is required');
        setLoading(false);
        return;
      }
      if (!formData.url.trim()) {
        setError('Backend URL is required');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:4000/api/backends/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.msg || 'Failed to add backend');
        setLoading(false);
        return;
      }

      setSuccess(`Backend "${formData.name}" added successfully!`);
      setFormData({ name: '', url: '' });
      
      setTimeout(() => {
        setSuccess('');
        onBackendAdded(data);
      }, 1500);
    } catch (err) {
      setError(err.message || 'Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="add-backend-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Backend Name</label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Primary API, Cache Server"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="url">Backend URL</label>
        <input
          id="url"
          type="url"
          name="url"
          value={formData.url}
          onChange={handleChange}
          placeholder="http://localhost:3000"
          required
        />
      </div>

      {error && <div className="message error">{error}</div>}
      {success && <div className="message success">{success}</div>}

      <button type="submit" disabled={loading} className="submit-btn">
        {loading ? 'Adding...' : 'Add Backend'}
      </button>
    </form>
  );
}

export default AddBackendForm;
