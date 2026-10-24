import React from 'react';
import { motion } from 'motion/react';
import { itemVariants } from './Page';

// Big-number tile for dashboards
export function StatTile({ label, value, icon: Icon }) {
  return (
    <motion.div variants={itemVariants} className='glass rounded-3xl p-5'>
      <div className='mb-3 flex items-center justify-between text-neutral-400'>
        <span className='text-xs font-medium uppercase tracking-wider'>{label}</span>
        {Icon && <Icon size={18} stroke={1.7} />}
      </div>
      <p className='text-3xl font-bold tracking-tight text-white tabular-nums'>{value}</p>
    </motion.div>
  );
}

// Label/value pair for profile details
export function InfoRow({ label, value }) {
  return (
    <div className='rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3'>
      <p className='text-[11px] font-medium uppercase tracking-wider text-neutral-500'>{label}</p>
      <p className='mt-0.5 truncate text-sm text-white'>{value ?? '—'}</p>
    </div>
  );
}

// Avatar initial for profile headers
export function Avatar({ name = '', size = 'h-16 w-16 text-2xl' }) {
  return (
    <div className={`flex shrink-0 items-center justify-center rounded-2xl bg-white font-bold uppercase text-black ${size}`}>
      {name?.[0] || '?'}
    </div>
  );
}
