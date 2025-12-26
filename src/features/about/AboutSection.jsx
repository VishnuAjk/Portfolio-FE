import PropTypes from 'prop-types';
import SectionCard from '../../components/common/SectionCard/SectionCard.jsx';
import EditableField from '../../components/common/EditableField/EditableField.jsx';
import { usePortfolioData } from '../../hooks/usePortfolioData.js';
import styles from './AboutSection.module.css';
import formStyles from '../../styles/forms.module.css';
import { useState } from 'react';
import { uploadService } from '../../services/uploadService.js';

const AboutSection = ({ meta }) => {
  const { data, updateSection } = usePortfolioData();
  const about = data.about;
  const [imageInput, setImageInput] = useState(about.imageUrl ?? '');
  const [uploading, setUploading] = useState(false);

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

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadService.uploadImage(file);
      if (url) {
        setImageInput(url);
        await saveField('imageUrl')(url);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to upload about image', error);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <SectionCard title={meta.title} description={meta.description}>
      <div className={styles.imageRow}>
        <p className={styles.imageLabel}>About image</p>
        <div className={styles.imageControls}>
          <input
            value={imageInput}
            onChange={(event) => setImageInput(event.target.value)}
            placeholder="https://images.unsplash.com/..."
          />
          <button
            type="button"
            className={formStyles.buttonPrimary}
            onClick={() => saveField('imageUrl')(imageInput)}
            disabled={uploading}
          >
            Save image
          </button>
          <label className={formStyles.buttonGhost}>
            Upload
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              disabled={uploading}
            />
          </label>
        </div>
      </div>
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
