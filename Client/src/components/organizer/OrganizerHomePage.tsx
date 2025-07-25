import React from 'react'
import { Link, Outlet, useParams } from 'react-router-dom'
import { userAtom } from '../UserAtom';
import OrganizerDashBoard from './OrganizerDashBoard'
import { useRecoilValue } from 'recoil';
function OrganizerHomePage() {
  const param=useParams();
  return (
    <div className='flex flex-start'>
     <div className='min-w-40 bg-red-400 min-h-screen'>
      
      <ul className='pt-4 pl-3' >
        <li>
<Link to='dashboard'>DashBoard</Link>
        </li>
        <li>
          <Link to='events'>Events</Link>
        </li>
        <li>
          <Link to='postEvents'>PostEvent</Link>
        </li>

      </ul>
    
     </div>
     <div >
        <Outlet />
        
     </div>
    </div>
  )
}

export default OrganizerHomePage