// src/vues/Auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(username, password);
      // Redirection vers le tableau de bord principal après connexion réussie
      navigate('/');
    } catch (err) {
      setError(err.message || 'Identifiants invalides');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>OBSEN</h1>
          <p style={styles.subtitle}>Plateforme d'Observabilité & SRE</p>
        </div>

        {error && <div style={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nom d'utilisateur / Email</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin@obsen.io"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Styles rapides intégrés (CSS-in-JS) pour éviter les dépendances externes
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#0f172a', // Slate sombre
    fontFamily: 'system-ui, sans-serif'
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    padding: '2.5rem',
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
    border: '1px solid #334155'
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem'
  },
  title: {
    color: '#38bdf8', // Cyan SRE
    fontSize: '2rem',
    fontWeight: 'bold',
    margin: 0,
    letterSpacing: '2px'
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '0.9rem',
    marginTop: '0.5rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem'
  },
  label: {
    color: '#cbd5e1',
    fontSize: '0.85rem',
    fontWeight: '500'
  },
  input: {
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid #475569',
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    fontSize: '1rem',
    outline: 'none'
  },
  button: {
    marginTop: '1rem',
    padding: '0.8rem',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#0284c7',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  errorAlert: {
    padding: '0.75rem',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid #ef4444',
    borderRadius: '6px',
    color: '#f87171',
    fontSize: '0.85rem',
    marginBottom: '1rem',
    textAlign: 'center'
  }
};

export default Login;