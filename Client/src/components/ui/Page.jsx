import React from 'react';
import { motion } from 'motion/react';

// Fade-up wrapper used by every page. Ends at y:0 so motion clears the transform
// (a leftover transform would trap position:fixed modals inside the page).
export function Page({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`mx-auto w-full max-w-7xl text-white ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className='mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between'>
      <div>
        <h1 className='text-gradient text-2xl font-bold tracking-tight sm:text-3xl'>{title}</h1>
        {subtitle && <p className='mt-1 text-sm text-neutral-400'>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// Staggered list/grid helpers
export const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export function EmptyState({ title, text }) {
  return (
    <div className='glass flex flex-col items-center justify-center rounded-3xl px-6 py-16 text-center'>
      <p className='text-lg font-semibold text-white'>{title}</p>
      {text && <p className='mt-1 max-w-sm text-sm text-neutral-400'>{text}</p>}
    </div>
  );
}

export function Spinner({ label = 'Loading…' }) {
  return (
    <div className='flex flex-col items-center justify-center gap-3 py-16 text-sm text-neutral-400'>
      <span className='h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-white' />
      {label}
    </div>
  );
}
