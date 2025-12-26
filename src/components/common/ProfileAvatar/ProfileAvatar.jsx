import PropTypes from 'prop-types';
import styles from './ProfileAvatar.module.css';

const ProfileAvatar = ({ imageUrl, alt, fallbackText, size = 'lg' }) => {
  const sizeClass = styles[size] ?? styles.lg;

  if (imageUrl) {
    return <img className={`${styles.avatar} ${sizeClass}`} src={imageUrl} alt={alt} />;
  }

  return (
    <div className={`${styles.placeholder} ${sizeClass}`} aria-label={alt}>
      <span>{fallbackText?.slice(0, 2)?.toUpperCase() ?? 'VP'}</span>
    </div>
  );
};

ProfileAvatar.propTypes = {
  imageUrl: PropTypes.string,
  alt: PropTypes.string,
  fallbackText: PropTypes.string,
  size: PropTypes.oneOf(['md', 'lg', 'xl']),
};

export default ProfileAvatar;
