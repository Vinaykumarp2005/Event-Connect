import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
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

import {
  IconLayoutSidebarRightFilled,
  IconPictureInPicture,
  IconAperture,
  IconCalendar,
  IconLibraryPhoto,
  IconPlus,
  IconList,
  IconCalendarEvent,
  IconLayoutDashboard,
} from '@tabler/icons-react';

// Sidebar icon tooltip component
function SidebarIcon({ icon, label }) {
  return (
    <div className="relative group mt-2">
      <div className="flex mt-1 mb-4 text-xl sm:text-2xl">{icon}</div>
      <div
        className="
          absolute left-full top-1/2 -translate-y-1/2 ml-2
          bg-gray-800 text-white text-xs rounded px-2 py-1 z-50
          opacity-0 group-hover:opacity-100 invisible group-hover:visible
          transition-all duration-300 whitespace-nowrap
        "
      >
        {label}
      </div>
    </div>
  );
}

function Home() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('Events');
  const user = useRecoilValue(userAtom);

  const isOrganizer = user?.role === 'organizer';
  const isStudent = user?.role === 'student';

  // Mobile menu button
  const mobileMenuButton = (
    <div className="fixed top-16 left-0 z-40 md:hidden p-2">
      <button onClick={() => setOpen(!open)}>
        <IconLayoutSidebarRightFilled
          size={28}
          stroke={4}
          className="transition-transform duration-300"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
    </div>
  );

  return (
    <div className="bg-black min-h-screen w-full text-white">
      <div className="flex relative">
        {mobileMenuButton}

      
        {/* Main Content */}
        <div
          className={`
            w-full transition-all duration-300 ease-in-out pt-16
            px-2 sm:px-4 md:px-6
            md:ml-16
          `}
        >
          {tab === 'Events' && <Events />}
          {tab === 'EnrolledEvents' && <EnrolledEvents />}
          {tab === 'StudentCalender' && <StudentCalender />}
          {tab === 'Calender' && <Customcalender />}
          {tab === 'Dashboard' &&
            (isStudent ? <StudentDashBoard /> : isOrganizer ? <OrganizerDashBoard /> : null)}
          {tab === 'Gallery' && <GalleryHomePage />}
          {tab === 'PostEvent' && <PostEvent />}
          {tab === 'CreatedEvents' && <CreatedEvents />}
        </div>
      </div>
    </div>
  );
}

export default Home;

