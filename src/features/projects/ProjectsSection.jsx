import { useState } from 'react';
import PropTypes from 'prop-types';
import SectionCard from '../../components/common/SectionCard/SectionCard.jsx';
import { usePortfolioData } from '../../hooks/usePortfolioData.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useConfirmation } from '../../hooks/useConfirmation.js';
import formStyles from '../../styles/forms.module.css';
import { EditIcon, TrashIcon } from '../../components/icons/index.jsx';
import { uploadService } from '../../services/uploadService.js';
import styles from './ProjectsSection.module.css';

const emptyProject = {
  name: '',
  link: '',
  stackInput: '',
  summary: '',
  image: '',
};

const ProjectsSection = ({ meta }) => {
  const { data, updateSection } = usePortfolioData();
  const { canEdit } = useAuth();
  const { confirm } = useConfirmation();
  const items = data.projects.items ?? [];

  const [formState, setFormState] = useState(emptyProject);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const resetForm = () => {
    setFormState(emptyProject);
    setEditingIndex(null);
    setFormOpen(false);
  };

  const startCreate = () => {
    setFormState(emptyProject);
    setEditingIndex(null);
    setFormOpen(true);
  };

  const startEdit = (index) => {
    const project = items[index];
    setFormState({
      name: project.name,
      link: project.link,
      summary: project.summary,
      stackInput: project.stack?.join(', ') ?? '',
      image: project.image ?? project.imageUrl ?? '',
    });
    setEditingIndex(index);
    setFormOpen(true);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadService.uploadImage(file);
      if (url) {
        setFormState((prev) => ({ ...prev, image: url }));
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to upload project image', error);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formState.name.trim()) return;

    const payload = {
      name: formState.name.trim(),
      link: formState.link.trim(),
      summary: formState.summary.trim(),
      image: formState.image.trim(),
      imageUrl: formState.image.trim(),
      stack: formState.stackInput
        .split(',')
        .map((token) => token.trim())
        .filter(Boolean),
    };

    const nextItems =
      editingIndex === null
        ? [...items, payload]
        : items.map((project, idx) => (idx === editingIndex ? payload : project));

    await updateSection('projects', { items: nextItems });
    resetForm();
  };

  const handleDelete = async (index) => {
    const accepted = await confirm({
      title: 'Delete project?',
      message: 'This project will disappear from the showcase.',
      confirmLabel: 'Delete project',
      variant: 'danger',
    });
    if (!accepted) return;

    const nextItems = items.filter((_, idx) => idx !== index);
    await updateSection('projects', { items: nextItems });
  };

  return (
    <SectionCard title={meta.title} description={meta.description}>
      <div className={styles.projects}>
        {items.map((project, index) => (
          <article key={`${project.name}-${project.link}`} className={styles.project}>
            <div>
              <h3>{project.name}</h3>
              <p>{project.summary}</p>
            </div>
            <div className={styles.meta}>
              <div className={styles.stack}>
                {project.stack?.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
              <div className={styles.metaActions}>
                {project.link && (
                  <a href={project.link} target="_blank" rel="noreferrer">
                    Visit
                  </a>
                )}
                {canEdit && (
                  <div className={formStyles.listActions}>
                    <button
                      type="button"
                      className={formStyles.iconButton}
                      onClick={() => startEdit(index)}
                      aria-label="Edit project"
                    >
                      <EditIcon size={16} />
                      <span className={formStyles.iconButtonLabel}>Edit</span>
                    </button>
                    <button
                      type="button"
                      className={formStyles.iconButtonDanger}
                      onClick={() => handleDelete(index)}
                      aria-label="Delete project"
                    >
                      <TrashIcon size={16} />
                      <span className={formStyles.iconButtonLabel}>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
        {!items.length && <p className={styles.empty}>Add projects to highlight your shipped work.</p>}
      </div>
      {canEdit && (
        <div className={styles.editorArea}>
          {!formOpen ? (
            <div className={styles.addRow}>
              <button type="button" className={formStyles.buttonPrimary} onClick={startCreate}>
                Add project
              </button>
            </div>
          ) : (
            <form className={formStyles.formShell} onSubmit={handleSubmit}>
              <div className={formStyles.formGrid}>
                <div className={formStyles.inputGroup}>
                  <label htmlFor="project-name">Name</label>
                  <input
                    id="project-name"
                    value={formState.name}
                    onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
                    placeholder="Realtime Portfolio"
                    required
                  />
                </div>
                <div className={formStyles.inputGroup}>
                  <label htmlFor="project-link">Link</label>
                  <input
                    id="project-link"
                    value={formState.link}
                    onChange={(event) => setFormState((prev) => ({ ...prev, link: event.target.value }))}
                    placeholder="https://portfolio.dev"
                  />
                </div>
              </div>
              <div className={formStyles.inputGroup}>
                <label htmlFor="project-image">Image URL</label>
                <div className={styles.imageControls}>
                  <input
                    id="project-image"
                    value={formState.image}
                    onChange={(event) => setFormState((prev) => ({ ...prev, image: event.target.value }))}
                    placeholder="https://images.unsplash.com/..."
                  />
                  <label className={`${formStyles.buttonGhost} ${styles.uploadButton}`}>
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
              <div className={formStyles.inputGroup}>
                <label htmlFor="project-stack">Stack (comma separated)</label>
                <input
                  id="project-stack"
                  value={formState.stackInput}
                  onChange={(event) => setFormState((prev) => ({ ...prev, stackInput: event.target.value }))}
                  placeholder="React, Node.js, MongoDB"
                />
              </div>
              <div className={formStyles.inputGroup}>
                <label htmlFor="project-summary">Summary</label>
                <textarea
                  id="project-summary"
                  value={formState.summary}
                  onChange={(event) => setFormState((prev) => ({ ...prev, summary: event.target.value }))}
                  placeholder="Editable portfolio experience"
                />
              </div>
              <div className={formStyles.formActions}>
                <button type="button" className={formStyles.buttonGhost} onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className={formStyles.buttonPrimary}>
                  {editingIndex === null ? 'Add project' : 'Update project'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </SectionCard>
  );
};

ProjectsSection.propTypes = {
  meta: PropTypes.shape({ title: PropTypes.string, description: PropTypes.string }).isRequired,
};

export default ProjectsSection;
