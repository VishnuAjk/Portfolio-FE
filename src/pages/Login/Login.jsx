import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { useAuth } from '../../hooks/useAuth.js';

const LoginPage = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login(formState);
      const redirectTo = location.state?.from?.pathname ?? '/admin';
      navigate(redirectTo);
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Login failed.');
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.status} role="status">Checking owner session…</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <p className={styles.eyebrow}>Owner studio</p>
        <h1>Owner access</h1>
        <p>Only the verified owner account can perform updates.</p>
        <label htmlFor="owner-email">
          Email address
          <input
            id="owner-email"
            type="email"
            autoComplete="username"
            value={formState.email}
            onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
            required
          />
        </label>
        <label htmlFor="owner-password">
          Password
          <input
            id="owner-password"
            type="password"
            autoComplete="current-password"
            value={formState.password}
            onChange={(event) => setFormState((prev) => ({ ...prev, password: event.target.value }))}
            required
          />
        </label>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        <Link className={styles.backLink} to="/">
          Back to site
        </Link>
      </form>
    </div>
  );
};

export default LoginPage;
