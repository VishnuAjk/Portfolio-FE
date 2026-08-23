import { Outlet, useLocation } from 'react-router-dom';
import Navigation from '../components/Navigation.jsx';
import VisualEffectsLayer from '../../components/visual/VisualEffectsLayer.jsx';
import styles from './MainLayout.module.css';

const MainLayout = () => {
  const { pathname } = useLocation();
  const isOwnerStudio = pathname.startsWith('/admin');

  return (
    <div className={`${styles.shell} ${isOwnerStudio ? styles.ownerShell : ''}`}>
      {!isOwnerStudio && <VisualEffectsLayer />}
      <div className={styles.inner}>
        <Navigation />
        <main className={`${styles.content} ${isOwnerStudio ? styles.ownerContent : ''}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
