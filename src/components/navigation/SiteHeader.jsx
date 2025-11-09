import { NavLink, useNavigate } from 'react-router-dom';
import styles from './SiteHeader.module.css';
import { useAuth } from '../../hooks/useAuth.js';

const SiteHeader = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, canEdit } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.branding}>
        <span className={styles.logo}>VP</span>
        <div>
          <p className={styles.title}>Vishnu Portfolio</p>
          <p className={styles.subtitle}>Full-stack engineer</p>
        </div>
      </div>
      <nav className={styles.navLinks}>
        <NavLink to="/" className={({ isActive }) => (isActive ? styles.active : undefined)}>
          Portfolio
        </NavLink>
        {canEdit && (
          <NavLink to="/admin" className={({ isActive }) => (isActive ? styles.active : undefined)}>
            Owner studio
          </NavLink>
        )}
      </nav>
      <div className={styles.authArea}>
        {isAuthenticated ? (
          <>
            <span className={styles.userChip}>{user?.email}</span>
            <button type="button" className={styles.buttonGhost} onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button type="button" className={styles.buttonPrimary} onClick={() => navigate('/login')}>
            Owner login
          </button>
        )}
      </div>
    </header>
  );
};

export default SiteHeader;
