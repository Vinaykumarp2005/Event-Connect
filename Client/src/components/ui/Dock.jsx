import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useMedia } from 'react-use';
import gsap from 'gsap';

const PEAK_SCALE = 1.16; // tile scale right under the cursor
const RANGE = 170; // how far (px) the magnification reaches (wider = gentler falloff)

// One Dock tile. Magnification uses transform scale only, so the bar's layout never shifts.
function DockItem({ item, active, mouseX, magnify, onSelect }) {
  const ref = useRef(null);
  const tileRef = useRef(null);

  const distance = useTransform(mouseX, (x) => {
    const b = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return x - b.x - b.width / 2;
  });
  const target = useTransform(distance, [-RANGE, 0, RANGE], [1, magnify ? PEAK_SCALE : 1, 1]);
  // Soft, well-damped spring: glides without overshoot
  const scale = useSpring(target, { stiffness: 150, damping: 24, mass: 0.6 });

  const Icon = item.icon;

  const handleClick = () => {
    // Subtle press feedback
    if (tileRef.current && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      gsap.fromTo(tileRef.current, { scale: 0.94 }, { scale: 1, duration: 0.6, ease: 'power3.out', clearProps: 'scale' });
    }
    onSelect(item.id);
  };

  return (
    <button
      ref={ref}
      type='button'
      onClick={handleClick}
      aria-label={item.label}
      aria-current={active ? 'page' : undefined}
      className='group relative flex w-[68px] shrink-0 flex-col items-center gap-2 pb-1.5 pt-1 sm:w-[84px]'
    >
      <motion.span style={{ scale }} className='block will-change-transform'>
        <span
          ref={tileRef}
          className={`flex h-12 w-12 items-center justify-center rounded-[15px] border transition-colors duration-500 ease-out ${
            active
              ? 'border-white bg-white text-black shadow-[0_6px_20px_-8px_rgb(var(--c-white)/0.6)]'
              : 'border-white/10 bg-gradient-to-b from-white/[0.12] to-white/[0.03] text-neutral-300 group-hover:border-white/25 group-hover:text-white'
          }`}
        >
          <Icon size={22} strokeWidth={1.75} />
        </span>
      </motion.span>

      <span
        className={`max-w-full truncate text-[10px] font-medium transition-colors duration-500 ease-out sm:text-[11px] ${
          active ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-300'
        }`}
      >
        {item.label}
      </span>

      {/* Single active indicator that slides between tabs */}
      {active && (
        <motion.span
          layoutId='dock-active-indicator'
          transition={{ type: 'spring', stiffness: 260, damping: 30, mass: 0.8 }}
          className='absolute -bottom-0.5 h-[3px] w-6 rounded-full bg-white'
        />
      )}
    </button>
  );
}

/**
 * macOS Dock–style tab bar.
 * items: [{ id, label, icon: LucideIcon }]
 */
function Dock({ items, activeId, onSelect, className = '' }) {
  const mouseX = useMotionValue(Infinity);
  // Magnify only with a real pointer and enough room
  const magnify = useMedia('(hover: hover) and (min-width: 768px)', false);

  return (
    <div className={`flex justify-center ${className}`}>
      <nav
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className='glass-strong no-scrollbar flex max-w-full items-start gap-1.5 overflow-x-auto rounded-[26px] px-3 pb-2.5 pt-3 sm:gap-2 sm:px-5'
      >
        {items.map((item) => (
          <DockItem
            key={item.id}
            item={item}
            active={item.id === activeId}
            mouseX={mouseX}
            magnify={magnify}
            onSelect={onSelect}
          />
        ))}
      </nav>
    </div>
  );
}

export default Dock;
