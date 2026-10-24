// Add correct content wrapper for event views

import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import SignIn from './components/common/SignIn';
import SignUp from './components/common/SignUp';
import LandingPage from './components/common/LandingPage';
import RootLayout from './RootLayout';
import LandingPageLayout from './LandingPageLayout';
import EventsById from './components/common/EventsById';
import EventParticipants from './components/organizer/EventParticipants';
import AdminDashBoard from './components/admin/AdminDashBoard';
import StudentDashBoard from './components/students/StudentDashBoard';
import OrganizerDashBoard from './components/organizer/OrganizerDashBoard';
import PostEvent from './components/organizer/PostEvent';
import CreatedEvents from './components/organizer/CreatedEvents';
import EnrolledEvents from './components/students/EnrolledEvents';
import VerifyPage from './components/common/VerifyPage';
import Events from './components/common/Events';
import StudentCalender from './components/students/StudentCalender';
import OrganiserCalender from './components/organizer/OrganiserCalender';
import ManageEvents from './components/admin/ManageEvents';
import { Navigate } from 'react-router-dom';
import Home from './components/common/Home';

const routes = createBrowserRouter([
  {
    path: '/',
    element: <LandingPageLayout />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/signin',
        element: <SignIn />,
      },
      {
        path: '/signup',
        element: <SignUp />,
      },
    ]
  },
  {
    path:'/verify',
    element:<VerifyPage/>
  },
  {
    path: '/student-profile/:email',
    element: <RootLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="home" replace />
      },
      {
        path: 'home',
        element: <Home/>,
      },
      {
        path: 'events',
        element: <Events/>,
      },
      {
        path: 'viewevent/:eventById',
        element: <EventsById />,
      },
      {
        path:'enrolled-events',
        element:<EnrolledEvents/>
      },
      {
        path:'student-calender',
        element:<StudentCalender/>
      },
      {
        path: 'dashboard',
        element: <StudentDashBoard />,
      },
    ],
  },
  {
    path: '/organizer-profile/:email',
    element: <RootLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="home" replace />
      },
      {
        path: 'home',
        element: <Home />,
      },
      {
        path: 'events',
        element: <Events/>,
      },
      {
        path: 'viewevent/:eventById',
        element: <EventsById />,
      },
      {
        path: 'event-participants/:eventId',
        element: <EventParticipants />,
      },
      {
        path: 'post-event',
        element: <PostEvent/>,
      },
      {
        path: 'created-events',
        element: <CreatedEvents/>,
      },
      {
        path:'organizer-calender',
        element:<OrganiserCalender/>
      },
      {
        path: 'dashboard',
        element: <OrganizerDashBoard />,
      },
    ],
  },
  {
    path: '/admin-profile/:email',
    element: <RootLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="home" replace />
      },
      {
        path: 'home',
        element: <Home />,
      },
      {
        path: 'events',
        element: <Events/>,
      },
      {
        path: 'viewevent/:eventById',
        element: <EventsById />,
      },
      {
        path:'manage-events',
        element:<ManageEvents/>
      },
      {
        path: 'dashboard',
        element: <AdminDashBoard />,
      },
    ],
  },
]);

export default routes;
