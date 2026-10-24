import React, { useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { AnimatePresence, motion } from 'motion/react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { userAtom } from '../UserAtom';
import Events from './Events';
import EnrolledEvents from '../students/EnrolledEvents';
import StudentCalender from '../students/StudentCalender';
import Customcalender from './Customcalender'; // Fixed casing to match the actual filename
import StudentDashBoard from '../students/StudentDashBoard';
import OrganizerDashBoard from '../organizer/OrganizerDashBoard';
import GalleryHomePage from './GalleryHomePage';
import PostEvent from '../organizer/PostEvent';
import CreatedEvents from '../organizer/CreatedEvents';

import Dock from '../ui/Dock';
import {
  CalendarDays,
  CalendarHeart,
  Compass,
  FolderKanban,
  Images,
  LayoutDashboard,
  SquarePlus,
  Ticket,
} from 'lucide-react';

gsap.registerPlugin(useGSAP);

// Every tab and which roles see it (icon = lucide component, rendered by the Dock)
const tabs = [
  { id: 'Events', label: 'Events', icon: Compass, roles: ['student', 'organizer'] },
  { id: 'EnrolledEvents', label: 'Enrolled', icon: Ticket, roles: ['student'] },
  { id: 'StudentCalender', label: 'My Calendar', icon: CalendarHeart, roles: ['student'] },
  { id: 'PostEvent', label: 'Post Event', icon: SquarePlus, roles: ['organizer'] },
  { id: 'CreatedEvents', label: 'Created', icon: FolderKanban, roles: ['organizer'] },
  { id: 'Calender', label: 'Calendar', icon: CalendarDays, roles: ['student', 'organizer'] },
  { id: 'Gallery', label: 'Gallery', icon: Images, roles: ['student'] },
  { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['student', 'organizer'] },
];

function Home() {
  const [tab, setTab] = useState('Events');
  const user = useRecoilValue(userAtom);
  const container = useRef(null);

  const isOrganizer = user?.role === 'organizer';
  const isStudent = user?.role === 'student';

  const roleTabs = tabs.filter((t) => t.roles.includes(user?.role));
  const visibleTabs = roleTabs.length ? roleTabs : tabs.filter((t) => t.id === 'Events');
  const active = visibleTabs.find((t) => t.id === tab) ?? visibleTabs[0];

  // Intro: heading, toolbar and panel ease in one after another
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // clearProps: leftover transforms would trap position:fixed modals inside the panel
      gsap.timeline({ defaults: { ease: 'expo.out', clearProps: 'all' } })
        .from('.home-intro', { y: 24, opacity: 0, duration: 1, stagger: 0.1 })
        .from('.home-panel', { y: 40, opacity: 0, duration: 1.1 }, '-=0.7');
    });
    return () => mm.revert();
  }, { scope: container });

  return (
    <div ref={container} className='relative min-h-[calc(100svh-3.5rem)] w-full text-white'>
      <div className='relative z-10 mx-auto flex max-w-7xl flex-col gap-5 pb-4'>
        <div className='home-intro px-1'>
          <h1 className='text-gradient text-2xl font-bold tracking-tight sm:text-3xl'>
            Welcome back{user?.username ? <>, <span className='capitalize'>{user.username}</span></> : ''}
          </h1>
          <p className='mt-1 text-sm text-neutral-400'>
            {isOrganizer
              ? 'Publish new events and keep an eye on your participants.'
              : 'Discover something new on campus today.'}
          </p>
        </div>

        {/* macOS Dock–style tab bar, centered */}
        <div className='home-intro sticky top-24 z-30'>
          <Dock items={visibleTabs} activeId={active.id} onSelect={setTab} />
        </div>

        {/* Content panel */}
        <div className='home-panel glass min-h-[60vh] rounded-[24px]'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className='px-2 py-4 sm:px-4 md:px-6'
            >
              {active.id === 'Events' && <Events />}
              {active.id === 'EnrolledEvents' && <EnrolledEvents />}
              {active.id === 'StudentCalender' && <StudentCalender />}
              {active.id === 'Calender' && <Customcalender />}
              {active.id === 'Dashboard' &&
                (isStudent ? <StudentDashBoard /> : isOrganizer ? <OrganizerDashBoard /> : null)}
              {active.id === 'Gallery' && <GalleryHomePage />}
              {active.id === 'PostEvent' && <PostEvent />}
              {active.id === 'CreatedEvents' && <CreatedEvents />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default Home;
