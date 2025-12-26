import { Outlet } from 'react-router-dom';
import Navigation from '../components/Navigation.jsx';
import VisualEffectsLayer from '../../components/visual/VisualEffectsLayer.jsx';
import styles from './MainLayout.module.css';

const MainLayout = () => (
  <div className={styles.shell}>
    <VisualEffectsLayer />
    <div className={styles.inner}>
      <Navigation />
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  </div>
);

export default MainLayout;
