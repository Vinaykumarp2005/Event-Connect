import React, { useEffect, useRef } from 'react'
import Header from '../src/components/common/Header'
import Footer from '../src/components/common/Footer'
import Sidebar from '../src/components/common/Sidebar'
import { Outlet, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { sidebarOpenState } from './components/atoms/sidebarAtom';
import { userAtom } from './components/UserAtom';

function RootLayout() {
  const sidebarOpen = useRecoilValue(sidebarOpenState);
  const setSidebarOpen = useSetRecoilState(sidebarOpenState);
  const user = useRecoilValue(userAtom);
  const location = useLocation();
  const initialLoadRef = useRef(true);
  
  // Modified effect to only force sidebar open on initial load, not during navigation
  useEffect(() => {
    // Only set sidebar open on initial load, not during navigation within organizer profile
    if (initialLoadRef.current && location.pathname.includes('/organizer-profile/') && user?.role === 'organizer') {
      // On desktop only
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      }
      initialLoadRef.current = false;
    }
  }, [location.pathname, user, setSidebarOpen]);

  return (
    <div className="flex flex-col min-h-screen bg-black overflow-x-hidden">
      <Header/>
      <div className="flex-grow flex relative">
        <Sidebar />
        <div className={`flex-grow transition-all duration-300 ${sidebarOpen ? 'md:ml-48' : 'md:ml-16'} pt-14 overflow-y-auto`}>
          <main className="w-full px-2 sm:px-4 md:px-6 py-4">
            <Outlet/>
          </main>
          <Footer/>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  )
}

export default RootLayout