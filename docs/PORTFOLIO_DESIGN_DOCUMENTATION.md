# Portfolio Design Documentation

## Overview
This documentation provides a complete guide to the minimal, user-friendly portfolio design system. It includes detailed specifications for UI components, animations, layouts, and integration patterns for coding agents to implement while preserving existing core functionalities.

---

## Design Philosophy

### Core Principles
- **Minimalism**: Clean layouts with ample white space, no visual clutter
- **Smooth Animations**: Subtle, purposeful animations that enhance user experience
- **Responsive**: Mobile-first approach, adapts seamlessly across devices
- **Accessible**: WCAG compliant with semantic HTML and keyboard navigation
- **Performance**: Optimized animations and lazy-loaded content

### Visual Style
- **Color Palette**: Neutral tones (grays, blacks, whites) with high contrast
- **Typography**: System defaults from `/src/styles/theme.css` - no custom font sizes unless specified
- **Spacing**: Generous padding and margins for breathing room
- **Borders**: Rounded corners (rounded-2xl, rounded-full) for modern feel
- **Shadows**: Subtle shadows on hover for depth

---

## Architecture

### File Structure
```
/src/app/
├── App.tsx                    # Main entry point
├── components/
│   ├── Navigation.tsx         # Fixed header with mobile menu
│   ├── Hero.tsx              # Landing section with CTA
│   ├── About.tsx             # About section with image
│   ├── Skills.tsx            # Grid of skill cards
│   ├── Projects.tsx          # Project showcase
│   ├── Contact.tsx           # Contact form/info
│   └── Footer.tsx            # Site footer
```

### Component Hierarchy
```
App
├── Navigation (Fixed, z-50)
├── Hero (Full viewport height)
├── About (Full viewport height)
├── Skills (Full viewport height, gray bg)
├── Projects (Full viewport height)
├── Contact (Full viewport height, gray bg)
└── Footer (Auto height)
```

---

## Components Specification

### 1. Navigation Component
**File**: `/src/app/components/Navigation.tsx`

#### Features
- Fixed position at top of viewport
- Background blur and shadow appear on scroll (after 50px)
- Mobile hamburger menu with full-screen overlay
- Smooth scroll to sections via anchor links

#### Key Elements
```tsx
- Desktop nav: Hidden on mobile, visible md:flex
- Mobile menu button: Visible on mobile, hidden on md+
- Nav items: Home, About, Skills, Projects, Contact
- Scroll detection: Changes background opacity/blur
```

#### Animation Patterns
- Initial slide down: `initial={{ y: -100 }}` → `animate={{ y: 0 }}`
- Logo hover: Scale 1.05
- Mobile menu: Fade in/out with staggered item animations
- Menu items: Stagger delay of 0.1s per item

#### Integration Points
```tsx
// To integrate with authentication:
{isAuthenticated && (
  <a href="/dashboard">Dashboard</a>
)}

// To add user avatar:
<div className="flex items-center gap-4">
  {/* nav items */}
  {user && <Avatar src={user.avatar} />}
</div>
```

---

### 2. Hero Component
**File**: `/src/app/components/Hero.tsx`

#### Features
- Full viewport height landing section
- Staggered text animations on load
- Two CTA buttons (primary and secondary)
- Animated scroll indicator at bottom

#### Key Elements
```tsx
- Greeting: "Hello, I'm" (small text)
- Name: Large heading with gradient text
- Tagline: Descriptive paragraph
- CTA buttons: "View Work" (filled) + "Get in Touch" (outlined)
- Scroll indicator: Bouncing arrow icon
```

#### Animation Patterns
- Fade in + slide up: Each text element with 0.2s stagger
- Scroll arrow: Infinite bounce (y: 0 ↔ -10px)
- Gradient text: `bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900`

#### Customization
```tsx
// Replace static content:
<h1>Your Name</h1>
<p>Your custom tagline here...</p>

// Dynamic content from props/state:
<h1>{user.name}</h1>
<p>{user.tagline}</p>
```

---

### 3. About Component
**File**: `/src/app/components/About.tsx`

#### Features
- Two-column layout (image + text)
- Scroll-triggered animations using `useInView`
- Responsive grid that stacks on mobile

#### Key Elements
```tsx
- Section ID: #about (for navigation)
- Image: Left column (or right on mobile)
- Text: 3 paragraphs describing background
- Grid: md:grid-cols-2 gap-12
```

#### Animation Patterns
- Trigger: When section enters viewport (margin: -100px)
- Image: Slide from left `x: -50 → 0`, delay 0.2s
- Text: Slide from right `x: 50 → 0`, delay 0.4s
- Once: Animations only play once

#### Integration Points
```tsx
// Fetch user bio from API:
const { data: bio } = await fetch('/api/user/bio');

// Replace static paragraphs:
{bio.paragraphs.map(p => <p key={p.id}>{p.content}</p>)}

// Dynamic image:
<img src={user.profileImage || defaultImage} />
```

---

### 4. Skills Component
**File**: `/src/app/components/Skills.tsx`

#### Features
- 3-column grid (responsive: 1 col mobile, 2 tablet, 3 desktop)
- Icon-based skill cards with hover effects
- Background color alternation (gray section)

#### Key Elements
```tsx
- Section ID: #skills
- Background: bg-neutral-50
- Grid: grid md:grid-cols-2 lg:grid-cols-3 gap-6
- Cards: 6 skills with icon, title, description
```

#### Card Structure
```tsx
{
  icon: LucideIcon,
  title: string,
  description: string
}
```

#### Animation Patterns
- Cards: Staggered fade + slide up, delay: `index * 0.1`
- Hover: Shadow increase, icon background → black, icon color → white
- Icons: 12x12 container, 6x6 icon size

#### Customization
```tsx
// Add more skills:
const skills = [
  ...existingSkills,
  { icon: Database, title: "Databases", description: "..." }
];

// Dynamic skills from CMS:
const skills = await fetchSkills();
skills.map((skill) => (
  <SkillCard key={skill.id} {...skill} />
));
```

---

### 5. Projects Component
**File**: `/src/app/components/Projects.tsx`

#### Features
- Alternating layout (image left/right)
- Hover effects on image and text
- External link indication
- Responsive stacking on mobile

#### Key Elements
```tsx
- Section ID: #projects
- Layout: 2-column grid per project
- Image: aspect-[4/3] with rounded corners
- Hover state management: useState for tracking
```

#### Project Structure
```tsx
{
  title: string,
  category: string,
  description: string,
  image: string (URL),
  link: string
}
```

#### Animation Patterns
- Projects: Staggered entry, delay: `index * 0.2`
- Image hover: Scale 1.05, overlay fade in
- Link hover: Gap increase (gap-2 → gap-3)
- Alternating: Even index = image right, odd = image left

#### Integration Points
```tsx
// Fetch from database:
const projects = await supabase
  .from('projects')
  .select('*')
  .order('created_at', { ascending: false });

// Add filtering:
const [filter, setFilter] = useState('all');
const filtered = projects.filter(p => 
  filter === 'all' || p.category === filter
);

// Add modal for project details:
<Dialog>
  <ProjectDetail project={selectedProject} />
</Dialog>
```

---

### 6. Contact Component
**File**: `/src/app/components/Contact.tsx`

#### Features
- Centered layout with CTA button
- Social media icon links
- Hover animations on interactive elements
- Background color alternation (gray section)

#### Key Elements
```tsx
- Section ID: #contact
- Background: bg-neutral-50
- CTA: Large email button
- Socials: GitHub, Twitter, LinkedIn, Mail
```

#### Social Structure
```tsx
{
  icon: LucideIcon,
  label: string,
  href: string
}
```

#### Animation Patterns
- Button hover: Scale 1.05
- Button tap: Scale 0.95
- Social icons: Scale 1.1 on hover, 0.9 on tap
- Icon containers: Background white → black on hover

#### Integration Points
```tsx
// Add contact form:
<form onSubmit={handleSubmit}>
  <Input name="email" />
  <Textarea name="message" />
  <Button type="submit">Send</Button>
</form>

// Add form validation:
const { register, handleSubmit, errors } = useForm();

// Connect to email service:
const sendEmail = async (data) => {
  await fetch('/api/contact', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};
```

---

### 7. Footer Component
**File**: `/src/app/components/Footer.tsx`

#### Features
- Simple horizontal layout
- Copyright and tagline
- Border top separator

#### Key Elements
```tsx
- Layout: Flex row on desktop, column on mobile
- Border: border-t border-neutral-200
- Text: Small, neutral-600 color
```

#### Customization
```tsx
// Add footer links:
<div className="flex gap-4">
  <a href="/privacy">Privacy</a>
  <a href="/terms">Terms</a>
</div>

// Dynamic year:
© {new Date().getFullYear()} Your Name
```

---

## Animation System

### Motion Library
Uses `motion/react` (Framer Motion) for all animations.

#### Common Patterns

**1. Fade + Slide**
```tsx
<motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
>
```

**2. Scroll-Triggered**
```tsx
const ref = useRef(null);
const isInView = useInView(ref, { 
  once: true, 
  margin: "-100px" 
});

<motion.div
  ref={ref}
  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
>
```

**3. Staggered Children**
```tsx
{items.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  />
))}
```

**4. Hover Interactions**
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
```

**5. Menu Animations**
```tsx
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
  )}
</AnimatePresence>
```

### Performance Guidelines
- Use `transform` and `opacity` for animations (GPU-accelerated)
- Set `once: true` for scroll animations to prevent re-triggering
- Use `AnimatePresence` for mounting/unmounting components
- Avoid animating `height`, `width`, or `top/left/right` directly

---

## Styling System

### Tailwind Classes

#### Layout
- Container: `max-w-6xl mx-auto px-6`
- Full height sections: `min-h-screen`
- Responsive grid: `grid md:grid-cols-2 lg:grid-cols-3`
- Flex center: `flex items-center justify-center`

#### Spacing
- Section padding: `py-20 px-6`
- Card padding: `p-8`
- Gap: `gap-4`, `gap-6`, `gap-8`, `gap-12`

#### Colors
- Primary text: `text-neutral-900`
- Secondary text: `text-neutral-600`
- Light bg: `bg-neutral-50`
- Dark bg: `bg-neutral-900`
- White text: `text-white`

#### Borders & Radius
- Large radius: `rounded-2xl`
- Full radius: `rounded-full`
- Border: `border border-neutral-300`

#### Effects
- Hover shadow: `hover:shadow-lg`
- Backdrop blur: `backdrop-blur-md`
- Gradient text: `bg-gradient-to-r ... bg-clip-text text-transparent`

### Responsive Breakpoints
- Mobile: default (< 768px)
- Tablet: `md:` (≥ 768px)
- Desktop: `lg:` (≥ 1024px)

---

## Integration Patterns

### 1. Adding Authentication

**Navigation Update**:
```tsx
// In Navigation.tsx
import { useAuth } from '@/hooks/useAuth';

export function Navigation() {
  const { user, signOut } = useAuth();
  
  return (
    <nav>
      {/* existing nav */}
      {user ? (
        <div className="flex items-center gap-4">
          <span>Welcome, {user.name}</span>
          <button onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <a href="/login">Sign In</a>
      )}
    </nav>
  );
}
```

### 2. CMS Integration

**Dynamic Content**:
```tsx
// In About.tsx
import { useEffect, useState } from 'react';

export function About() {
  const [content, setContent] = useState(null);
  
  useEffect(() => {
    fetch('/api/content/about')
      .then(res => res.json())
      .then(setContent);
  }, []);
  
  if (!content) return <LoadingSpinner />;
  
  return (
    <section>
      <h2>{content.title}</h2>
      <img src={content.image} />
      {content.paragraphs.map(p => (
        <p key={p.id}>{p.text}</p>
      ))}
    </section>
  );
}
```

### 3. Form Handling

**Contact Form**:
```tsx
// In Contact.tsx
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export function Contact() {
  const { register, handleSubmit, reset } = useForm();
  
  const onSubmit = async (data) => {
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      toast.success('Message sent!');
      reset();
    } catch (error) {
      toast.error('Failed to send message');
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email', { required: true })} />
      <textarea {...register('message', { required: true })} />
      <button type="submit">Send</button>
    </form>
  );
}
```

### 4. Database Queries (Supabase)

**Projects from Database**:
```tsx
// In Projects.tsx
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error) setProjects(data);
      setLoading(false);
    }
    
    fetchProjects();
  }, []);
  
  if (loading) return <LoadingState />;
  
  return (
    <section>
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </section>
  );
}
```

### 5. Adding Search/Filter

**Skills Filter**:
```tsx
// In Skills.tsx
const [searchTerm, setSearchTerm] = useState('');

const filteredSkills = skills.filter(skill =>
  skill.title.toLowerCase().includes(searchTerm.toLowerCase())
);

return (
  <section>
    <input
      type="search"
      placeholder="Search skills..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="mb-8 px-4 py-2 border rounded-full"
    />
    <div className="grid">
      {filteredSkills.map(skill => (
        <SkillCard key={skill.title} {...skill} />
      ))}
    </div>
  </section>
);
```

### 6. Loading States

**Skeleton Loader**:
```tsx
import { Skeleton } from '@/components/ui/skeleton';

function ProjectsSkeleton() {
  return (
    <div className="space-y-12">
      {[1, 2, 3].map(i => (
        <div key={i} className="grid md:grid-cols-2 gap-8">
          <Skeleton className="aspect-[4/3] rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
```

### 7. Modal/Dialog Integration

**Project Details Modal**:
```tsx
import { Dialog, DialogContent } from '@/components/ui/dialog';

const [selectedProject, setSelectedProject] = useState(null);

<Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
  <DialogContent>
    <h2>{selectedProject?.title}</h2>
    <img src={selectedProject?.image} />
    <p>{selectedProject?.fullDescription}</p>
    <a href={selectedProject?.link}>Visit Site</a>
  </DialogContent>
</Dialog>
```

---

## Accessibility

### ARIA Labels
- Navigation: `<nav aria-label="Main navigation">`
- Buttons: Screen reader text with `<span className="sr-only">`
- Links: Descriptive text or aria-label
- Sections: Semantic HTML5 tags (section, article, nav, footer)

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Focus states: Use browser defaults or add `focus:ring-2`
- Skip links: Add for keyboard users to skip to main content

### Color Contrast
- Text on white: neutral-900 (AAA rated)
- Secondary text: neutral-600 (AA rated)
- Links: Hover states for clarity

---

## Customization Guide

### Changing Colors

**From Neutral to Blue**:
```tsx
// Replace throughout:
bg-neutral-900 → bg-blue-900
text-neutral-600 → text-blue-600
border-neutral-300 → border-blue-300
```

### Adjusting Animation Speed

**Slower Animations**:
```tsx
// Change duration:
transition={{ duration: 0.8 }} → transition={{ duration: 1.2 }}

// Reduce stagger:
delay: index * 0.1 → delay: index * 0.05
```

### Adding New Sections

**Template**:
```tsx
import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";

export function NewSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="new-section" className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-16 text-center">Section Title</h2>
          {/* Your content */}
        </motion.div>
      </div>
    </section>
  );
}
```

### Changing Layout

**3-Column to 4-Column Grid**:
```tsx
// In Skills.tsx:
className="grid md:grid-cols-2 lg:grid-cols-3"
↓
className="grid md:grid-cols-2 lg:grid-cols-4"
```

---

## Image Guidelines

### Unsplash Integration
Current implementation uses Unsplash images. Replace with:

**User Uploads**:
```tsx
<img src={`/uploads/${image.filename}`} alt={image.alt} />
```

**CDN/Asset Management**:
```tsx
<img src={`${CDN_URL}/${image.id}`} alt={image.alt} />
```

**Figma Assets**:
```tsx
import img from "figma:asset/abc123.png";
<img src={img} alt="..." />
```

### Optimization
- Use `loading="lazy"` for below-fold images
- Provide `width` and `height` to prevent layout shift
- Use WebP format with fallbacks
- Consider `srcset` for responsive images

---

## Performance Optimization

### Code Splitting
```tsx
import { lazy, Suspense } from 'react';

const Projects = lazy(() => import('./components/Projects'));

<Suspense fallback={<LoadingSkeleton />}>
  <Projects />
</Suspense>
```

### Memo for Expensive Components
```tsx
import { memo } from 'react';

export const SkillCard = memo(({ skill }) => {
  // Component logic
});
```

### Debounce Search
```tsx
import { useMemo } from 'react';
import { debounce } from 'lodash';

const debouncedSearch = useMemo(
  () => debounce((term) => setSearchTerm(term), 300),
  []
);
```

---

## Testing Considerations

### Component Tests
```tsx
import { render, screen } from '@testing-library/react';
import { Hero } from './Hero';

test('renders hero with name', () => {
  render(<Hero name="John Doe" />);
  expect(screen.getByText('John Doe')).toBeInTheDocument();
});
```

### Animation Tests
```tsx
test('animates on scroll', async () => {
  const { container } = render(<About />);
  
  // Simulate scroll
  fireEvent.scroll(window, { target: { scrollY: 100 } });
  
  await waitFor(() => {
    expect(container.querySelector('.animated')).toBeVisible();
  });
});
```

---

## Deployment Checklist

- [ ] Replace placeholder content (name, bio, projects)
- [ ] Update social media links
- [ ] Add real project images
- [ ] Set up contact form endpoint
- [ ] Configure environment variables
- [ ] Test on mobile devices
- [ ] Run accessibility audit
- [ ] Optimize images
- [ ] Set up analytics
- [ ] Test all animations on different browsers

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Note**: Motion animations may be reduced for users with `prefers-reduced-motion` enabled.

---

## Troubleshooting

### Animations Not Working
- Ensure motion is installed: `npm install motion`
- Check import: `import { motion } from "motion/react"`
- Verify ref is attached to element with useInView

### Icons Not Displaying
- Verify icon exists: Use bash tool to grep lucide-react exports
- Check import: `import { IconName } from "lucide-react"`
- Ensure correct casing (e.g., `Github` not `GitHub`)

### Layout Breaking on Mobile
- Test with browser dev tools responsive mode
- Check for fixed widths instead of responsive classes
- Ensure `px-6` padding on all sections for mobile margins

### Scroll Not Smooth
- Add to CSS: `html { scroll-behavior: smooth; }`
- Or use: `window.scrollTo({ top: 0, behavior: 'smooth' })`

---

## Support & Resources

### Documentation
- Motion (Framer Motion): https://motion.dev
- Lucide Icons: https://lucide.dev
- Tailwind CSS: https://tailwindcss.com

### Code Examples
All components are located in `/src/app/components/` and can be referenced for implementation details.

---

## Version History

**v1.0.0** - Initial portfolio design
- Hero section with animated text
- About section with scroll animations
- Skills grid with hover effects
- Projects showcase with alternating layout
- Contact section with social links
- Responsive navigation with mobile menu
- Footer component

---

## License & Attribution

This design system is created for use with existing application functionalities. Feel free to customize and extend as needed for your specific use case.
