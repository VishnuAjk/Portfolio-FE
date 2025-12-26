import { useEffect, useRef, useState } from 'react';
import SectionCard from '../../components/common/SectionCard/SectionCard.jsx';
import OwnerEditorPanel from '../../components/common/OwnerEditorPanel/OwnerEditorPanel.jsx';
import { SECTION_META, SECTION_KEYS } from '../../utils/sectionConfig.js';
import AboutSection from '../../features/about/AboutSection.jsx';
import SkillsSection from '../../features/skills/SkillsSection.jsx';
import WorkExperienceSection from '../../features/work/WorkExperienceSection.jsx';
import PersonalJourneySection from '../../features/journey/PersonalJourneySection.jsx';
import ProjectsSection from '../../features/projects/ProjectsSection.jsx';
import EducationSection from '../../features/education/EducationSection.jsx';
import ContactSection from '../../features/contact/ContactSection.jsx';
import { usePortfolioData } from '../../hooks/usePortfolioData.js';
import { useAuth } from '../../hooks/useAuth.js';
import formStyles from '../../styles/forms.module.css';
import Hero from '../../app/components/Hero.jsx';
import About from '../../app/components/About.jsx';
import Skills from '../../app/components/Skills.jsx';
import Projects from '../../app/components/Projects.jsx';
import Contact from '../../app/components/Contact.jsx';
import Footer from '../../app/components/Footer.jsx';
import AnimatedSection from '../../app/components/AnimatedSection.jsx';
import styles from './Portfolio.module.css';

const componentMap = {
  about: AboutSection,
  skills: SkillsSection,
  work: WorkExperienceSection,
  journey: PersonalJourneySection,
  projects: ProjectsSection,
  education: EducationSection,
  contact: ContactSection,
};

const SHOWCASE_FALLBACK = {
  title: '',
  subtitle: '',
  logoUrl: '',
  profileImageUrl: '',
};

const getMeta = (key) => SECTION_META.find((item) => item.key === key) || {};

const PortfolioPage = () => {
  const { data, updateSection } = usePortfolioData();
  const { canEdit } = useAuth();
  const showcase = data[SECTION_KEYS.SHOWCASE] ?? SHOWCASE_FALLBACK;
  const [editorOpen, setEditorOpen] = useState(false);
  const editorRef = useRef(null);
  const [showcaseFormState, setShowcaseFormState] = useState(showcase);

  useEffect(() => {
    setShowcaseFormState(showcase);
  }, [showcase]);

  const handleFileAsDataUrl = (field) => async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const nextValue = typeof reader.result === 'string' ? reader.result : '';
      setShowcaseFormState((prev) => ({ ...prev, [field]: nextValue }));
    };
    reader.readAsDataURL(file);
  };

  const handleShowcaseChange = (field) => (event) => {
    setShowcaseFormState((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleShowcaseSubmit = async (event) => {
    event.preventDefault();
    await updateSection(SECTION_KEYS.SHOWCASE, showcaseFormState);
  };

  const fallbackInitials = (showcase.title || 'VP').slice(0, 2);
  const titleText = showcase.title?.trim() || 'Showcase your story in one editable hub.';
  const subtitleText =
    showcase.subtitle?.trim() ||
    'Visitors enjoy a fast, read-only experience while you keep every section up to date from the browser.';

  const editorSections = [
    <SectionCard
      key="showcase-editor"
      title="Showcase"
      description="Controls the hero headline, subtitle, logo, and portrait."
    >
      <form className={formStyles.formShell} onSubmit={handleShowcaseSubmit}>
        <div className={formStyles.formGrid}>
              <div className={formStyles.inputGroup}>
                <label htmlFor="showcase-logo-url">Logo URL</label>
                <input
                  id="showcase-logo-url"
                  value={showcaseFormState.logoUrl ?? ''}
                  onChange={handleShowcaseChange('logoUrl')}
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
              value={showcaseFormState.title ?? ''}
              onChange={handleShowcaseChange('title')}
              placeholder="Build trust with a strong headline"
            />
          </div>
        </div>
        <div className={formStyles.inputGroup}>
          <label htmlFor="showcase-subtitle">Showcase subtitle</label>
          <textarea
            id="showcase-subtitle"
            value={showcaseFormState.subtitle ?? ''}
            onChange={handleShowcaseChange('subtitle')}
            placeholder="Share the mission and value proposition in a couple of sentences."
          />
        </div>
            <div className={formStyles.inputGroup}>
              <label htmlFor="showcase-profile-image">Profile image URL</label>
              <input
                id="showcase-profile-image"
                value={showcaseFormState.profileImageUrl ?? ''}
                onChange={handleShowcaseChange('profileImageUrl')}
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
          <button
            type="button"
            className={formStyles.buttonGhost}
            onClick={() => setShowcaseFormState(showcase)}
          >
            Reset
          </button>
          <button type="submit" className={formStyles.buttonPrimary}>
            Save showcase
          </button>
        </div>
      </form>
    </SectionCard>,
    ...SECTION_META.map((section) => {
      const SectionComponent = componentMap[section.key];
      return <SectionComponent key={section.key} meta={section} />;
    }),
  ];

  return (
    <div className={styles.page}>
      <Hero
        title={titleText}
        subtitle={subtitleText}
        profileImageUrl={showcase.profileImageUrl}
        logoUrl={showcase.logoUrl}
        fallbackInitials={fallbackInitials}
        showEditorShortcut={canEdit}
        onEdit={() => {
          setEditorOpen(true);
          if (editorRef.current) {
            editorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }}
      />
      <About
        summary={data.about.summary}
        highlights={data.about.highlights}
        imageUrl={data.about.imageUrl || showcase.profileImageUrl || showcase.logoUrl}
        fallbackInitials={fallbackInitials}
      />
      <Skills headline={data.skills.headline} categories={data.skills.categories} />
      <AnimatedSection>
        <WorkExperienceSection meta={getMeta(SECTION_KEYS.WORK)} />
      </AnimatedSection>
      <AnimatedSection>
        <PersonalJourneySection meta={getMeta(SECTION_KEYS.JOURNEY)} />
      </AnimatedSection>
      <Projects items={data.projects.items} />
      <Contact
        email={data.contact.email}
        phone={data.contact.phone}
        location={data.contact.location}
        availability={data.contact.availability}
        socials={data.contact.socials}
      />
      <Footer />
      {canEdit && (
        <div className={styles.editorShell} id="owner-editor" ref={editorRef}>
          <OwnerEditorPanel
            sections={editorSections}
            open={editorOpen}
            onToggle={setEditorOpen}
          />
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;
