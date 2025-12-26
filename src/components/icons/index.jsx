import PropTypes from 'prop-types';

const iconPropTypes = {
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
  className: PropTypes.string,
};

const defaultProps = {
  size: 18,
  strokeWidth: 1.7,
  className: undefined,
};

export const EditIcon = ({ size, strokeWidth, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path d="M4 21.5v-4.38L17.66 3.46a2.25 2.25 0 113.18 3.19L7.18 20.31z" />
    <path d="M13.5 6L18 10.5" />
  </svg>
);

EditIcon.propTypes = iconPropTypes;
EditIcon.defaultProps = defaultProps;

export const TrashIcon = ({ size, strokeWidth, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 15H6L5 6" />
    <path d="M10 11v7" />
    <path d="M14 11v7" />
    <path d="M9 6V4h6v2" />
  </svg>
);

TrashIcon.propTypes = iconPropTypes;
TrashIcon.defaultProps = defaultProps;
