import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './SiteHeader.module.css';
import { useAuth } from '../../hooks/useAuth.js';

const SiteHeader = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, canEdit } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const panelRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handlePointerDown = (event) => {
      if (panelRef.current?.contains(event.target) || toggleRef.current?.contains(event.target)) {
        return;
      }
      setMenuOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <div className={styles.branding}>
          <span className={styles.logo}>V</span>
          <div>
            <p className={styles.title}>Vishnu</p>
            <p className={styles.subtitle}>Full-stack engineer</p>
          </div>
        </div>
        <button
          type="button"
          className={styles.menuToggle}
          ref={toggleRef}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <div className={`${styles.panel} ${menuOpen ? styles.panelOpen : ''}`} ref={panelRef}>
        <nav className={styles.navLinks}>
          <NavLink to="/" className={({ isActive }) => (isActive ? styles.active : undefined)} onClick={() => setMenuOpen(false)}>
            Portfolio
          </NavLink>
          {canEdit && (
            <NavLink
              to="/admin"
              className={({ isActive }) => (isActive ? styles.active : undefined)}
              onClick={() => setMenuOpen(false)}
            >
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
            <button
              type="button"
              className={styles.buttonPrimary}
              onClick={() => {
                navigate('/login');
                setMenuOpen(false);
              }}
            >
              Owner login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
