import { Outlet } from 'react-router-dom';
import SiteHeader from '../../components/navigation/SiteHeader.jsx';
import styles from './MainLayout.module.css';

const MainLayout = () => (
  <div className={styles.shell}>
    <SiteHeader />
    <main className={styles.content}>
      <Outlet />
    </main>
  </div>
);

export default MainLayout;
