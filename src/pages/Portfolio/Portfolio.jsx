import SectionGrid from '../../components/common/SectionGrid/SectionGrid.jsx';
import { SECTION_META } from '../../utils/sectionConfig.js';
import AboutSection from '../../features/about/AboutSection.jsx';
import SkillsSection from '../../features/skills/SkillsSection.jsx';
import WorkExperienceSection from '../../features/work/WorkExperienceSection.jsx';
import PersonalJourneySection from '../../features/journey/PersonalJourneySection.jsx';
import ProjectsSection from '../../features/projects/ProjectsSection.jsx';
import EducationSection from '../../features/education/EducationSection.jsx';
import ContactSection from '../../features/contact/ContactSection.jsx';
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

const PortfolioPage = () => (
  <div className={styles.page}>
    <section className={styles.hero}>
      <p className={styles.eyebrow}>Full-stack portfolio</p>
      <h1>Showcase professional story, skills, and work in one editable hub.</h1>
      <p className={styles.subtitle}>
        Visitors enjoy a fast, read-only experience. The owner can authenticate to update every
        section without touching the codebase.
      </p>
    </section>
    <SectionGrid>
      {SECTION_META.map((section) => {
        const SectionComponent = componentMap[section.key];
        return <SectionComponent key={section.key} meta={section} />;
      })}
    </SectionGrid>
  </div>
);

export default PortfolioPage;
