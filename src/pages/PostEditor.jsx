import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

function PostEditor() {
  const { id } = useParams(); // id තියෙනවා නම් Edit mode, නැත්නම් Create mode
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: 'AI/Tech News',
    coverImage: '',
    published: false,
  });
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      api
        .get(`/posts/admin/all`)
        .then((res) => {
          const post = res.data.find((p) => p._id === id);
          if (post) setForm(post);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // Title type කරද්දී auto-generate slug (Create mode එකේදී විතරක්)
  const handleTitleChange = (e) => {
    const title = e.target.value;
    setForm((prev) => ({
      ...prev,
      title,
      slug: isEditMode ? prev.slug : title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isEditMode) {
        await api.put(`/posts/${id}`, form);
      } else {
        await api.post('/posts', form);
      }
      navigate('/dashboard/posts');
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed');
      setSaving(false);
    }
  };

  if (loading) return <p style={{ padding: 24 }}>Loading...</p>;

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 700, margin: '0 auto' }}>
      <h2>{isEditMode ? 'Post Edit කරන්න' : 'අලුත් Post එකක්'}</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleTitleChange}
            style={{ width: '100%', padding: 8 }}
            required
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Slug (URL)</label>
          <input
            type="text"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            style={{ width: '100%', padding: 8 }}
            required
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Excerpt (කෙටි විස්තරය)</label>
          <textarea
            name="excerpt"
            value={form.excerpt}
            onChange={handleChange}
            rows={2}
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Content</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={10}
            style={{ width: '100%', padding: 8 }}
            required
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Category</label>
          <select name="category" value={form.category} onChange={handleChange} style={{ width: '100%', padding: 8 }}>
            <option value="AI/Tech News">AI/Tech News</option>
            <option value="Local Tech">Local Tech</option>
            <option value="Tutorials">Tutorials</option>
          </select>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Cover Image URL</label>
          <input
            type="text"
            name="coverImage"
            value={form.coverImage}
            onChange={handleChange}
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            <input type="checkbox" name="published" checked={form.published} onChange={handleChange} /> Publish
            දැන්ම
          </label>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" disabled={saving} style={{ padding: 10 }}>
          {saving ? 'Saving...' : isEditMode ? 'Update Post' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}

export default PostEditor;