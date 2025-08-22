import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRecoilValue, useRecoilState } from 'recoil';
import { userAtom } from '../UserAtom';
import { sidebarOpenState } from '../atoms/sidebarAtom';
import {
  IconLayoutSidebarRightFilled,
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
  IconClipboardList
} from '@tabler/icons-react';

function SidebarIcon({ icon, label }) {
  return (
    <div className="relative group">
      <div className="flex items-center justify-center mb-4 text-xl sm:text-2xl cursor-pointer">
        {icon}
        <div 
        className="
    absolute left-full ml-3 top-1/2 -translate-y-1/2
    bg-gray-800 text-white text-xs rounded-md px-2 py-1
    opacity-0 group-hover:opacity-100 invisible group-hover:visible
    transition-opacity duration-200 ease-in-out z-[999]
    whitespace-nowrap border border-gray-700 shadow-lg
    after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2
    after:right-full after:border-8 after:border-solid
    after:border-transparent after:border-r-gray-800
  "
        >
         {label}
        </div>
      </div>
    </div>
  );
}

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

  const activeLinkStyle = "bg-[rgba(8,112,184,0.2)] border-l-2 border-[rgba(8,112,184,0.7)]";
  
  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-16 left-0 z-40 md:hidden p-2">
        <button onClick={toggleSidebar} aria-label="Toggle sidebar">
          <IconLayoutSidebarRightFilled
            size={28}
            stroke={2}
            className='text-white transition-transform duration-300'
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-screen bg-neutral-900
        transition-all duration-300 ease-in-out z-30
        border-r-2 md:border-r-4 border-[rgba(8,112,184,0.7)]
        pt-16 md:pt-20 overflow-visible 
        ${open ? 'w-60 translate-x-0 shadow-xl' : 'w-16 -translate-x-full md:translate-x-0 '}
      `}>
        {/* Desktop sidebar toggle */}
        <div className='hidden md:flex justify-end'>
          <button onClick={toggleSidebar} className="p-2" aria-label="Toggle sidebar">
            <IconLayoutSidebarRightFilled
              size={28}
              stroke={2}
              className='text-white transition-transform duration-300'
              style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>
        </div>

        {/* Sidebar content */}
        <div className='flex flex-col px-3 pt-4 h-full no-scrollbar'>
          {open ? (
            <>
              {/* Common links for all users */}
              <button 
                onClick={() => handleNavigation('')}
                className={`flex items-center mb-4 text-lg text-white hover:bg-neutral-800 px-2 py-1 rounded transition-colors ${location.pathname === basePath ? activeLinkStyle : ''}`}
              >
                <IconHome size={24} className='mr-2'/> Home
              </button>
              
              <button 
                onClick={() => handleNavigation('/events')}
                className={`flex items-center mb-4 text-lg text-white hover:bg-neutral-800 px-2 py-1 rounded transition-colors ${location.pathname.includes('/events') && !location.pathname.includes('/enrolled') ? activeLinkStyle : ''}`}
              >
                <IconPictureInPicture size={24} className='mr-2'/> Events
              </button>
              
              {/* Student-specific links */}
              {isStudent && (
                <>
                  <button 
                    onClick={() => handleNavigation('/enrolledevents')}
                    className={`flex items-center mb-4 text-lg text-white hover:bg-neutral-800 px-2 py-1 rounded transition-colors ${location.pathname.includes('/enrolledevents') ? activeLinkStyle : ''}`}
                  >
                    <IconAperture size={24} className='mr-2'/> Enrolled Events
                  </button>
                  <button 
                    onClick={() => handleNavigation('/studentCalender')}
                    className={`flex items-center mb-4 text-lg text-white hover:bg-neutral-800 px-2 py-1 rounded transition-colors ${location.pathname.includes('/studentCalender') ? activeLinkStyle : ''}`}
                  >
                    <IconCalendar size={24} className='mr-2'/> Events Calendar
                  </button>
                  <button 
                    onClick={() => handleNavigation('/galleryPage')}
                    className={`flex items-center mb-4 text-lg text-white hover:bg-neutral-800 px-2 py-1 rounded transition-colors ${location.pathname.includes('/galleryPage') ? activeLinkStyle : ''}`}
                  >
                    <IconLibraryPhoto size={24} className='mr-2'/> Gallery
                  </button>
                </>
              )}

              {/* Organizer-specific links */}
              {isOrganizer && (
                <>
                  <button 
                    onClick={() => handleNavigation('/postEvents')}
                    className={`flex items-center mb-4 text-lg text-white hover:bg-neutral-800 px-2 py-1 rounded transition-colors ${location.pathname.includes('/postEvents') ? activeLinkStyle : ''}`}
                  >
                    <IconPlus size={24} className='mr-2'/> Post Event
                  </button>
                  <button 
                    onClick={() => handleNavigation('/createdEvents')}
                    className={`flex items-center mb-4 text-lg text-white hover:bg-neutral-800 px-2 py-1 rounded transition-colors ${location.pathname.includes('/createdEvents') ? activeLinkStyle : ''}`}
                  >
                    <IconList size={24} className='mr-2'/> Created Events
                  </button>
                  <button 
                    onClick={() => handleNavigation('/eventDetails')}
                    className={`flex items-center mb-4 text-lg text-white hover:bg-neutral-800 px-2 py-1 rounded transition-colors ${location.pathname.includes('/eventDetails') ? activeLinkStyle : ''}`}
                  >
                    <IconUsers size={24} className='mr-2'/> Event Participants
                  </button>
                  <button 
                    onClick={() => handleNavigation('/view/organisercalender')}
                    className={`flex items-center mb-4 text-lg text-white hover:bg-neutral-800 px-2 py-1 rounded transition-colors ${location.pathname.includes('/organisercalender') ? activeLinkStyle : ''}`}
                  >
                    <IconCalendarEvent size={24} className='mr-2'/> Organizer Calendar
                  </button>
                </>
              )}

              {/* Common links continued */}
              <button 
                onClick={() => handleNavigation('/calender')}
                className={`flex items-center mb-4 text-lg text-white hover:bg-neutral-800 px-2 py-1 rounded transition-colors ${(location.pathname.includes('/calender') && !location.pathname.includes('/organisercalender')) ? activeLinkStyle : ''}`}
              >
                <IconCalendar size={24} className='mr-2'/> Calendar
              </button>
              
              <button 
                onClick={() => handleNavigation('/dashboard')}
                className={`flex items-center mb-4 text-lg text-white hover:bg-neutral-800 px-2 py-1 rounded transition-colors ${location.pathname.includes('/dashboard') ? activeLinkStyle : ''}`}
              >
                <IconLayoutDashboard size={24} className='mr-2'/> Dashboard
              </button>
            </>
          ) : (
            <div className='flex flex-col items-center'>
              <button onClick={() => handleNavigation('')} className={`mb-4 ${location.pathname === basePath ? 'text-[rgba(8,112,184,0.7)]' : 'text-white'}`}>
                <SidebarIcon icon={<IconHome size={24} stroke={1.5} />} label="Home" />
              </button>
              
              <button onClick={() => handleNavigation('/events')} className={`mb-4 ${location.pathname.includes('/events') && !location.pathname.includes('/enrolled') ? 'text-[rgba(8,112,184,0.7)]' : 'text-white'}`}>
                <SidebarIcon icon={<IconPictureInPicture size={24} stroke={1.5} />} label="Events" />
              </button>
              
              {isStudent && (
                <>
                  <button onClick={() => handleNavigation('/enrolledevents')} className={`mb-4 ${location.pathname.includes('/enrolledevents') ? 'text-[rgba(8,112,184,0.7)]' : 'text-white'}`}>
                    <SidebarIcon icon={<IconAperture size={24} stroke={1.5} />} label="Enrolled Events" />
                  </button>
                  <button onClick={() => handleNavigation('/studentCalender')} className={`mb-4 ${location.pathname.includes('/studentCalender') ? 'text-[rgba(8,112,184,0.7)]' : 'text-white'}`}>
                    <SidebarIcon icon={<IconCalendar size={24} stroke={1.5} />} label="Events Calendar" />
                  </button>
                  <button onClick={() => handleNavigation('/galleryPage')} className={`mb-4 ${location.pathname.includes('/galleryPage') ? 'text-[rgba(8,112,184,0.7)]' : 'text-white'}`}>
                    <SidebarIcon icon={<IconLibraryPhoto size={24} stroke={1.5} />} label="Gallery" />
                  </button>
                </>
              )}

              {isOrganizer && (
                <>
                  <button onClick={() => handleNavigation('/postEvents')} className={`mb-4 ${location.pathname.includes('/postEvents') ? 'text-[rgba(8,112,184,0.7)]' : 'text-white'}`}>
                    <SidebarIcon icon={<IconPlus size={24} stroke={1.5} />} label="Post Event" />
                  </button>
                  <button onClick={() => handleNavigation('/createdEvents')} className={`mb-4 ${location.pathname.includes('/createdEvents') ? 'text-[rgba(8,112,184,0.7)]' : 'text-white'}`}>
                    <SidebarIcon icon={<IconList size={24} stroke={1.5} />} label="Created Events" />
                  </button>
                  <button onClick={() => handleNavigation('/eventDetails')} className={`mb-4 ${location.pathname.includes('/eventDetails') ? 'text-[rgba(8,112,184,0.7)]' : 'text-white'}`}>
                    <SidebarIcon icon={<IconUsers size={24} stroke={1.5} />} label="Event Participants" />
                  </button>
                  <button onClick={() => handleNavigation('/view/organisercalender')} className={`mb-4 ${location.pathname.includes('/organisercalender') ? 'text-[rgba(8,112,184,0.7)]' : 'text-white'}`}>
                    <SidebarIcon icon={<IconCalendarEvent size={24} stroke={1.5} />} label="Organizer Calendar" />
                  </button>
                </>
              )}

              <button onClick={() => handleNavigation('/calender')} className={`mb-4 ${location.pathname.includes('/calender') && !location.pathname.includes('/organisercalender') ? 'text-[rgba(8,112,184,0.7)]' : 'text-white'}`}>
                <SidebarIcon icon={<IconCalendar size={24} stroke={1.5} />} label="Calendar" />
              </button>
              <button onClick={() => handleNavigation('/dashboard')} className={`mb-4 ${location.pathname.includes('/dashboard') ? 'text-[rgba(8,112,184,0.7)]' : 'text-white'}`}>
                <SidebarIcon icon={<IconLayoutDashboard size={24} stroke={1.5} />} label="Dashboard" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile */}
      {open && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </>
  );
}

export default Sidebar;
