import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts');
      setPosts(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Post එක delete කරන්න ස්ථිරද?')) return;
    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter((p) => p._id !== id));
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  if (loading) return <p style={{ padding: 24 }}>Loading...</p>;

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Blog Posts</h2>
        <button onClick={() => navigate('/dashboard/new')}>+ New Post</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {posts.length === 0 ? (
        <p>තවම posts නෑ. "New Post" click කරලා පළමු post එක හදන්න.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ccc', textAlign: 'left' }}>
              <th style={{ padding: 8 }}>Title</th>
              <th style={{ padding: 8 }}>Category</th>
              <th style={{ padding: 8 }}>Status</th>
              <th style={{ padding: 8 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: 8 }}>{post.title}</td>
                <td style={{ padding: 8 }}>{post.category}</td>
                <td style={{ padding: 8 }}>{post.published ? '✅ Published' : '📝 Draft'}</td>
                <td style={{ padding: 8 }}>
                  <button onClick={() => navigate(`/dashboard/edit/${post._id}`)}>Edit</button>{' '}
                  <button onClick={() => handleDelete(post._id)} style={{ color: 'red' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p style={{ marginTop: 24 }}>
        <Link to="/dashboard">← Dashboard එකට ආපහු</Link>
      </p>
    </div>
  );
}

export default PostList;