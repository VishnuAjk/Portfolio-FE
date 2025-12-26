import styles from './Footer.module.css';

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      <p>© {new Date().getFullYear()} Vishnu. Building thoughtful products.</p>
      <div className={styles.links}>
        <a href="#home">Top</a>
        <a href="#contact">Contact</a>
      </div>
    </div>
  </footer>
);

export default Footer;
