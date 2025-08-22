// Add correct content wrapper for event views

import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import LandingPage from './components/common/LandingPage';
import RootLayout from './RootLayout';
import EventsById from './components/student/EventsById';
import EventParticipants from './components/organizer/EventDetails';

const routes = createBrowserRouter([
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
  {
    path: '/student-profile/:email',
    element: <RootLayout />,
    children: [
      // ...existing student routes...
      {
        path: 'viewevent/:eventById',
        element: <EventsById />,
      },
    ],
  },
  {
    path: '/organizer-profile/:email',
    element: <RootLayout />,
    children: [
      // ...existing organizer routes...
      {
        path: 'viewevent/:eventById',
        element: <EventsById />,
      },
      {
        path: 'eventDetails',
        element: <EventParticipants />,
      },
    ],
  },
  // ...other routes...
]);

export default routes;
