import { useNavigate } from 'react-router-dom';
import { SECTION_KEYS, SECTION_META } from '../../utils/sectionConfig.js';
import WorkExperienceSection from '../../features/work/WorkExperienceSection.jsx';
import PersonalJourneySection from '../../features/journey/PersonalJourneySection.jsx';
import { usePortfolioData } from '../../hooks/usePortfolioData.js';
import { useAuth } from '../../hooks/useAuth.js';
import Hero from '../../app/components/Hero.jsx';
import About from '../../app/components/About.jsx';
import Skills from '../../app/components/Skills.jsx';
import Projects from '../../app/components/Projects.jsx';
import Contact from '../../app/components/Contact.jsx';
import Footer from '../../app/components/Footer.jsx';
import AnimatedSection from '../../app/components/AnimatedSection.jsx';
import styles from './Portfolio.module.css';

const SHOWCASE_FALLBACK = {
  title: '',
  subtitle: '',
  logoUrl: '',
  profileImageUrl: '',
};

const getMeta = (key) => SECTION_META.find((item) => item.key === key) || {};

const PortfolioPage = () => {
  const { data } = usePortfolioData();
  const { canEdit } = useAuth();
  const navigate = useNavigate();
  const showcase = data[SECTION_KEYS.SHOWCASE] ?? SHOWCASE_FALLBACK;

  const fallbackInitials = (showcase.title || 'VP').slice(0, 2);
  const titleText = showcase.title?.trim() || 'Showcase your story in one editable hub.';
  const subtitleText =
    showcase.subtitle?.trim() ||
    'Visitors enjoy a fast, read-only experience while you keep every section up to date from the browser.';

  return (
    <div className={styles.page}>
      <Hero
        title={titleText}
        subtitle={subtitleText}
        profileImageUrl={showcase.profileImageUrl}
        logoUrl={showcase.logoUrl}
        fallbackInitials={fallbackInitials}
        showEditorShortcut={canEdit}
        onEdit={() => navigate('/admin')}
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
    </div>
  );
};

export default PortfolioPage;
