import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Navigation.module.css';
import { useAuth } from '../../hooks/useAuth.js';
import { transition, createStagger, usePrefersReducedMotion } from '../../utils/motionConfig.js';

const MotionHeader = motion.header;
const MotionDiv = motion.div;
const MotionButton = motion.button;

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

const Navigation = () => {
  const { isAuthenticated, user, logout, canEdit } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const isOwnerStudio = location.pathname.startsWith('/admin');
  const visibleNavItems = isOwnerStudio
    ? [{ label: 'View site', href: '/' }]
    : navItems;

  const scrollToTarget = useCallback((hash) => {
    const target = document.querySelector(hash);
    if (target) {
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  }, [reduceMotion]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (location.hash) {
      scrollToTarget(location.hash);
    }
  }, [location.hash, scrollToTarget]);

  const handleNavClick = (href) => () => {
    setMenuOpen(false);
    if (href.startsWith('#')) {
      if (location.pathname !== '/') {
        navigate(`/${href}`);
        return;
      }
      scrollToTarget(href);
      return;
    }
    navigate(href);
  };

  const handleLogoClick = () => {
    setMenuOpen(false);
    if (isOwnerStudio || location.pathname !== '/') {
      navigate('/');
      return;
    }
    scrollToTarget('#home');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <MotionHeader
      className={`${styles.nav} ${scrolled ? styles.navScrolled : ''} ${menuOpen ? styles.navInteractive : ''}`}
      initial={reduceMotion ? false : { y: -80, opacity: 0 }}
      animate={reduceMotion ? undefined : { y: 0, opacity: 1 }}
      transition={transition}
    >
      <div className={styles.inner}>
        <button type="button" className={styles.logo} onClick={handleLogoClick}>
          <span className={styles.logoMark}>V</span>
          <span className={styles.logoText}>Vishnu</span>
        </button>

        <nav className={styles.links}>
          {visibleNavItems.map((item) => (
            <button key={item.href} type="button" onClick={handleNavClick(item.href)}>
              {item.label}
            </button>
          ))}
          {canEdit && !isOwnerStudio && (
            <button type="button" onClick={() => navigate('/admin')}>
              Owner Studio
            </button>
          )}
        </nav>

        <div className={styles.actions}>
          {isAuthenticated ? (
            <>
              <span className={styles.userChip}>{user?.email}</span>
              <button type="button" className={styles.secondary} onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <button type="button" className={styles.primary} onClick={() => navigate('/login')}>
              Owner Login
            </button>
          )}
          <button
            type="button"
            className={`${styles.menuToggle} ${menuOpen ? styles.menuOpen : ''}`}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <MotionDiv
            className={styles.mobileOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
          >
            <div className={styles.mobileMenu} onClick={(event) => event.stopPropagation()}>
              {visibleNavItems.map((item, index) => (
                <MotionButton
                  key={item.href}
                  type="button"
                  onClick={handleNavClick(item.href)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ ...transition, ...createStagger(index, 0.1) }}
                >
                  {item.label}
                </MotionButton>
              ))}
              {canEdit && !isOwnerStudio && (
                <MotionButton
                  type="button"
                  onClick={() => handleNavClick('/admin')()}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ ...transition, ...createStagger(visibleNavItems.length, 0.1) }}
                >
                  Owner Studio
                </MotionButton>
              )}
              <div className={styles.mobileActions}>
                {isAuthenticated ? (
                  <>
                    {user?.email && <p className={styles.mobileUser}>{user.email}</p>}
                    <button type="button" className={styles.secondary} onClick={handleLogout}>
                      Logout
                    </button>
                  </>
                ) : (
                  <button type="button" className={styles.primary} onClick={() => handleNavClick('/login')()}>
                    Owner Login
                  </button>
                )}
              </div>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </MotionHeader>
  );
};

export default Navigation;
