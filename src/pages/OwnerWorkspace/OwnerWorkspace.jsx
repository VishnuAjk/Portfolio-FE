import SectionGrid from '../../components/common/SectionGrid/SectionGrid.jsx';
import SectionCard from '../../components/common/SectionCard/SectionCard.jsx';
import { SECTION_META } from '../../utils/sectionConfig.js';
import { usePortfolioData } from '../../hooks/usePortfolioData.js';
import styles from './OwnerWorkspace.module.css';

const OwnerWorkspace = () => {
  const { data, reload } = usePortfolioData();

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Owner studio</p>
          <h1>Control panel</h1>
          <p>Update any section, manage items, and sync instantly with the backend.</p>
        </div>
        <button type="button" onClick={reload}>
          Refresh data
        </button>
      </section>
      <SectionGrid>
        {SECTION_META.map((section) => (
          <SectionCard key={section.key} title={section.title} description={section.description}>
            <pre className={styles.preview}>{JSON.stringify(data[section.key], null, 2)}</pre>
          </SectionCard>
        ))}
      </SectionGrid>
    </div>
  );
};

export default OwnerWorkspace;
