export const SECTION_KEYS = {
  SHOWCASE: 'showcase',
  ABOUT: 'about',
  SKILLS: 'skills',
  WORK: 'work',
  JOURNEY: 'journey',
  PROJECTS: 'projects',
  EDUCATION: 'education',
  CONTACT: 'contact',
};

export const SECTION_META = [
  {
    key: SECTION_KEYS.ABOUT,
    title: 'About Me',
    description: 'Professional summary and mission statement.',
  },
  {
    key: SECTION_KEYS.SKILLS,
    title: 'Skills',
    description: 'Technical and soft skills grouped by category.',
  },
  {
    key: SECTION_KEYS.WORK,
    title: 'Work Experience',
    description: 'Recent roles, responsibilities, and achievements.',
  },
  {
    key: SECTION_KEYS.JOURNEY,
    title: 'Personal Journey',
    description: 'Milestones and transitions that shaped the career path.',
  },
  {
    key: SECTION_KEYS.PROJECTS,
    title: 'Projects',
    description: 'Flagship work samples with links and tech stacks.',
  },
  {
    key: SECTION_KEYS.EDUCATION,
    title: 'Education & Qualifications',
    description: 'Academic background and certifications.',
  },
  {
    key: SECTION_KEYS.CONTACT,
    title: 'Contact',
    description: 'Owner email, phone, and availability windows.',
  },
];

export const defaultPortfolioShape = {
  [SECTION_KEYS.SHOWCASE]: {
    title: '',
    subtitle: '',
    logoUrl: '',
    profileImageUrl: '',
  },
  [SECTION_KEYS.ABOUT]: {
    summary: '',
    highlights: [],
    imageUrl: '',
  },
  [SECTION_KEYS.SKILLS]: {
    headline: '',
    categories: [],
  },
  [SECTION_KEYS.WORK]: {
    roles: [],
  },
  [SECTION_KEYS.JOURNEY]: {
    timeline: [],
  },
  [SECTION_KEYS.PROJECTS]: {
    items: [],
  },
  [SECTION_KEYS.EDUCATION]: {
    milestones: [],
  },
  [SECTION_KEYS.CONTACT]: {
    email: '',
    phone: '',
    location: '',
    availability: '',
    socials: [],
  },
};
