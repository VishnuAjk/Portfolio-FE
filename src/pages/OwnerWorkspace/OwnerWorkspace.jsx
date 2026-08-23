import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionCard from '../../components/common/SectionCard/SectionCard.jsx';
import { SECTION_META, SECTION_KEYS } from '../../utils/sectionConfig.js';
import { usePortfolioData } from '../../hooks/usePortfolioData.js';
import { useAuth } from '../../hooks/useAuth.js';
import AboutSection from '../../features/about/AboutSection.jsx';
import SkillsSection from '../../features/skills/SkillsSection.jsx';
import WorkExperienceSection from '../../features/work/WorkExperienceSection.jsx';
import PersonalJourneySection from '../../features/journey/PersonalJourneySection.jsx';
import ProjectsSection from '../../features/projects/ProjectsSection.jsx';
import EducationSection from '../../features/education/EducationSection.jsx';
import ContactSection from '../../features/contact/ContactSection.jsx';
import formStyles from '../../styles/forms.module.css';
import styles from './OwnerWorkspace.module.css';

const componentMap = {
  about: AboutSection,
  skills: SkillsSection,
  work: WorkExperienceSection,
  journey: PersonalJourneySection,
  projects: ProjectsSection,
  education: EducationSection,
  contact: ContactSection,
};

const SHOWCASE_KEY = 'showcase';

const OwnerWorkspace = () => {
  const { data, reload, updateSection } = usePortfolioData();
  const { canEdit } = useAuth();
  const showcase = useMemo(() => data[SECTION_KEYS.SHOWCASE] ?? {}, [data]);
  const [formState, setFormState] = useState(showcase);
  const [activeKey, setActiveKey] = useState(SHOWCASE_KEY);

  useEffect(() => {
    setFormState(showcase);
  }, [showcase]);

  const handleFileAsDataUrl = (field) => async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const nextValue = typeof reader.result === 'string' ? reader.result : '';
      setFormState((prev) => ({ ...prev, [field]: nextValue }));
    };
    reader.readAsDataURL(file);
  };

  if (!canEdit) {
    return (
      <div className={styles.page}>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>Owner studio</p>
            <h1>Control panel</h1>
            <p>Sign in as owner to edit your portfolio.</p>
          </div>
        </section>
      </div>
    );
  }

  const handleSaveShowcase = async (event) => {
    event.preventDefault();
    await updateSection(SECTION_KEYS.SHOWCASE, formState);
  };

  const sectionTabs = [
    { key: SHOWCASE_KEY, title: 'Showcase' },
    ...SECTION_META.map((section) => ({ key: section.key, title: section.title })),
  ];

  const activeMeta = SECTION_META.find((item) => item.key === activeKey);
  const ActiveSection = componentMap[activeKey];
  const adminProps = activeKey === SECTION_KEYS.WORK || activeKey === SECTION_KEYS.JOURNEY
    ? { adminView: true }
    : {};

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Owner studio</p>
          <h1>Control panel</h1>
          <p>Update one section at a time. Changes sync with the live site.</p>
        </div>
        <div className={styles.heroActions}>
          <Link to="/" className={styles.ghostLink}>
            View site
          </Link>
          <button type="button" onClick={reload} className={styles.primaryDark}>
            Refresh data
          </button>
        </div>
      </section>

      <div className={styles.tabs} role="tablist" aria-label="Portfolio sections">
        {sectionTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeKey === tab.key}
            className={`${styles.tab} ${activeKey === tab.key ? styles.tabActive : ''}`}
            onClick={() => setActiveKey(tab.key)}
          >
            {tab.title}
          </button>
        ))}
      </div>

      <div className={styles.adminContent}>
        {activeKey === SHOWCASE_KEY ? (
          <SectionCard
            title="Showcase"
            description="Controls the hero headline, subtitle, logo, and portrait."
          >
            <form className={formStyles.formShell} onSubmit={handleSaveShowcase}>
              <div className={formStyles.formGrid}>
                <div className={formStyles.inputGroup}>
                  <label htmlFor="showcase-logo-url">Logo URL</label>
                  <input
                    id="showcase-logo-url"
                    value={formState.logoUrl ?? ''}
                    onChange={(event) => setFormState((prev) => ({ ...prev, logoUrl: event.target.value }))}
                    placeholder="https://images.unsplash.com/...png"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileAsDataUrl('logoUrl')}
                    aria-label="Upload logo image"
                  />
                </div>
                <div className={formStyles.inputGroup}>
                  <label htmlFor="showcase-title">Showcase title</label>
                  <input
                    id="showcase-title"
                    value={formState.title ?? ''}
                    onChange={(event) => setFormState((prev) => ({ ...prev, title: event.target.value }))}
                    placeholder="Build trust with a strong headline"
                  />
                </div>
              </div>
              <div className={formStyles.inputGroup}>
                <label htmlFor="showcase-subtitle">Showcase subtitle</label>
                <textarea
                  id="showcase-subtitle"
                  value={formState.subtitle ?? ''}
                  onChange={(event) => setFormState((prev) => ({ ...prev, subtitle: event.target.value }))}
                  placeholder="Share the mission and value proposition in a couple of sentences."
                />
              </div>
              <div className={formStyles.inputGroup}>
                <label htmlFor="showcase-profile-image">Profile image URL</label>
                <input
                  id="showcase-profile-image"
                  value={formState.profileImageUrl ?? ''}
                  onChange={(event) => setFormState((prev) => ({ ...prev, profileImageUrl: event.target.value }))}
                  placeholder="https://images.unsplash.com/...jpeg"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileAsDataUrl('profileImageUrl')}
                  aria-label="Upload profile image"
                />
              </div>
              <div className={formStyles.formActions}>
                <button type="button" className={formStyles.buttonGhost} onClick={() => setFormState(showcase)}>
                  Reset
                </button>
                <button type="submit" className={formStyles.buttonPrimary}>
                  Save showcase
                </button>
              </div>
            </form>
          </SectionCard>
        ) : (
          ActiveSection && <ActiveSection meta={activeMeta} {...adminProps} />
        )}
      </div>
    </div>
  );
};

export default OwnerWorkspace;
