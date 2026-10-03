import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h2>CreativeiDEA Admin Dashboard</h2>
      <p><Link to="/dashboard/posts">📝 Blog Posts කළමනාකරණය කරන්න</Link></p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;