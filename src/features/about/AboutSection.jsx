import PropTypes from 'prop-types';
import SectionCard from '../../components/common/SectionCard/SectionCard.jsx';
import EditableField from '../../components/common/EditableField/EditableField.jsx';
import { usePortfolioData } from '../../hooks/usePortfolioData.js';
import styles from './AboutSection.module.css';

const AboutSection = ({ meta }) => {
  const { data, updateSection } = usePortfolioData();
  const about = data.about;

  const saveField = (field) => async (nextValue) => {
    const payload = { ...about, [field]: nextValue };
    if (field === 'highlights') {
      payload.highlights = nextValue
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
    }
    return updateSection('about', payload);
  };

  return (
    <SectionCard title={meta.title} description={meta.description}>
      <EditableField
        label="Summary"
        multiline
        value={about.summary}
        placeholder="Share your professional headline and focus areas."
        onSave={saveField('summary')}
      />
      <EditableField
        label="Highlights"
        multiline
        value={(about.highlights ?? []).join('\n')}
        placeholder={'Separate bullet points with line breaks\n- Building reliable systems\n- Leading teams'}
        onSave={saveField('highlights')}
      />
      {!!about.highlights?.length && (
        <ul className={styles.list}>
          {about.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
};

AboutSection.propTypes = {
  meta: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};

export default AboutSection;
