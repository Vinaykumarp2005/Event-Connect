import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { IconMoon, IconSun } from '@tabler/icons-react';
import { useTheme } from './useTheme';

// Sun/moon button; icon spins and swaps on toggle
function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      type='button'
      onClick={toggleTheme}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.9 }}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className={`relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/[0.06] text-white ${className}`}
    >
      <AnimatePresence mode='wait' initial={false}>
        <motion.span
          key={theme}
          initial={{ y: 14, rotate: -90, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -14, rotate: 90, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className='flex'
        >
          {isDark ? <IconSun size={17} stroke={1.8} /> : <IconMoon size={17} stroke={1.8} />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

export default ThemeToggle;
