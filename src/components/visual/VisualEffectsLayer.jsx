import { useEffect, useRef } from 'react';
import styles from './VisualEffectsLayer.module.css';

const VisualEffectsLayer = () => {
  const layerRef = useRef(null);
  const cursorRef = useRef(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef(null);
  const boundsRef = useRef({ left: 0, top: 0, width: 0, height: 0 });

  useEffect(() => {
    const updateBounds = () => {
      if (!layerRef.current) return;
      const bounds = layerRef.current.getBoundingClientRect();
      boundsRef.current = bounds;
      const centerX = bounds.width / 2;
      const centerY = bounds.height / 2;
      positionRef.current = { x: centerX, y: centerY };
      targetRef.current = { x: centerX, y: centerY };
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${centerX - 60}px, ${centerY - 60}px, 0)`;
      }
    };

    const handlePointerMove = (event) => {
      const { left, top } = boundsRef.current;
      targetRef.current = {
        x: event.clientX - left,
        y: event.clientY - top,
      };
    };

    const animate = () => {
      positionRef.current.x += (targetRef.current.x - positionRef.current.x) * 0.12;
      positionRef.current.y += (targetRef.current.y - positionRef.current.y) * 0.12;

      if (cursorRef.current) {
        const { x, y } = positionRef.current;
        cursorRef.current.style.transform = `translate3d(${x - 60}px, ${y - 60}px, 0)`;
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    updateBounds();

    window.addEventListener('resize', updateBounds);
    window.addEventListener('pointermove', handlePointerMove);
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', updateBounds);
      window.removeEventListener('pointermove', handlePointerMove);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div className={styles.layer} aria-hidden="true" ref={layerRef}>
      <div className={styles.cursorGlow} ref={cursorRef} />
      <div className={`${styles.orb} ${styles.orbOne}`} />
      <div className={`${styles.orb} ${styles.orbTwo}`} />
      <div className={`${styles.orb} ${styles.orbThree}`} />
      <div className={styles.gridSheen} />
    </div>
  );
};

export default VisualEffectsLayer;
