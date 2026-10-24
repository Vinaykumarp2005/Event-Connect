import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRecoilValue, useRecoilState } from 'recoil';
import { AnimatePresence, motion } from 'motion/react';
import { userAtom } from '../UserAtom';
import { sidebarOpenState } from '../atoms/sidebarAtom';
import {
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconPictureInPicture,
  IconAperture,
  IconCalendar,
  IconCalendarEvent,
  IconLayoutDashboard,
  IconLibraryPhoto,
  IconHome,
  IconPlus,
  IconList,
  IconUsers,
} from '@tabler/icons-react';

function Sidebar() {
  const [open, setOpen] = useRecoilState(sidebarOpenState);
  const location = useLocation();
  const navigate = useNavigate();
  const user = useRecoilValue(userAtom);

  const isOrganizer = user?.role === 'organizer';
  const isStudent = user?.role === 'student';
  const isAdmin = user?.role === 'admin';

  // Force sidebar closed on mobile when navigating
  useEffect(() => {
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  }, [location.pathname, setOpen]);

  // Don't render sidebar for non-logged in users or on auth pages
  if (!user?.isLoggedIn ||
      location.pathname === '/' ||
      location.pathname === '/signin' ||
      location.pathname === '/signup') {
    return null;
  }

  let basePath = '';
  if (isStudent && user?.email) basePath = `/student-profile/${user.email}`;
  if (isOrganizer && user?.email) basePath = `/organizer-profile/${user.email}`;
  if (isAdmin && user?.email) basePath = `/admin-profile/${user.email}`;

  // Modified to not toggle sidebar state on navigation
  const handleNavigation = (path, shouldToggleSidebar = false) => {
    // Only navigate if we're not already on this path
    if (!location.pathname.endsWith(path) || path === '') {
      // Fix the calendar path for organizers
      if (isOrganizer && path === '/view/organisercalender') {
        navigate(`${basePath}${path}`);
      }
      else if (isOrganizer && path === '/calender') {
        navigate(`${basePath}/view/calender`);
      }
      else {
        navigate(`${basePath}${path}`);
      }
    }

    // Only toggle sidebar if explicitly requested or on mobile
    if (shouldToggleSidebar || window.innerWidth < 768) {
      setOpen(false);
    }
  };

  // Toggle sidebar without navigation
  const toggleSidebar = () => {
    setOpen(!open);
  };

  const p = location.pathname;
  const links = [
    { path: '', label: 'Home', icon: IconHome, active: p === basePath, show: true },
    { path: '/events', label: 'Events', icon: IconPictureInPicture, active: p.includes('/events') && !p.includes('/enrolled'), show: true },
    { path: '/enrolledevents', label: 'Enrolled Events', icon: IconAperture, active: p.includes('/enrolledevents'), show: isStudent },
    { path: '/studentCalender', label: 'My Calendar', icon: IconCalendarEvent, active: p.includes('/studentCalender'), show: isStudent },
    { path: '/galleryPage', label: 'Gallery', icon: IconLibraryPhoto, active: p.includes('/galleryPage'), show: isStudent },
    { path: '/postEvents', label: 'Post Event', icon: IconPlus, active: p.includes('/postEvents'), show: isOrganizer },
    { path: '/createdEvents', label: 'Created Events', icon: IconList, active: p.includes('/createdEvents'), show: isOrganizer },
    { path: '/eventDetails', label: 'Participants', icon: IconUsers, active: p.includes('/eventDetails'), show: isOrganizer },
    { path: '/view/organisercalender', label: 'My Calendar', icon: IconCalendarEvent, active: p.includes('/organisercalender'), show: isOrganizer },
    { path: '/calender', label: 'Calendar', icon: IconCalendar, active: p.includes('/calender') && !p.includes('/organisercalender'), show: true },
    { path: '/dashboard', label: 'Dashboard', icon: IconLayoutDashboard, active: p.includes('/dashboard'), show: true },
  ].filter((link) => link.show);

  return (
    <>
      {/* Floating sidebar (mobile toggle lives in the Header) */}
      <aside className={`
        glass-bar fixed bottom-3 left-3 top-20 z-40 flex flex-col rounded-3xl
        transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
        md:bottom-4 md:left-4 md:top-24 md:z-30
        ${open ? 'w-56 translate-x-0' : 'w-16 -translate-x-[calc(100%+1rem)] md:translate-x-0'}
      `}>
        {/* Desktop sidebar toggle */}
        <div className={`hidden px-3 pb-2 pt-2 md:flex ${open ? 'justify-end' : 'justify-center'}`}>
          <button
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            {open ? <IconLayoutSidebarLeftCollapse size={20} stroke={1.8} /> : <IconLayoutSidebarLeftExpand size={20} stroke={1.8} />}
          </button>
        </div>

        {/* Sidebar content */}
        <nav className='no-scrollbar flex flex-1 flex-col gap-1 px-2 pb-3 pt-2 md:pt-0'>
          {links.map(({ path, label, icon: Icon, active }) => (
            <button
              key={path + label}
              onClick={() => handleNavigation(path)}
              title={open ? undefined : label}
              className={`group relative flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition-colors duration-200 ${
                open ? 'px-3' : 'justify-center px-0'
              } ${active ? 'text-black' : 'text-neutral-400 hover:bg-white/[0.06] hover:text-white'}`}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active-pill"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  className="absolute inset-0 rounded-xl bg-white"
                />
              )}
              <Icon size={20} stroke={1.7} className="relative z-10 shrink-0" />
              <AnimatePresence initial={false}>
                {open && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10 whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Tooltip when collapsed */}
              {!open && (
                <span className="glass-strong pointer-events-none invisible absolute left-full z-[999] ml-3 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:visible group-hover:opacity-100">
                  {label}
                </span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;
