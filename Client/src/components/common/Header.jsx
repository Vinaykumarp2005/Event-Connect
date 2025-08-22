import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRecoilValue, useResetRecoilState } from 'recoil'
import { userAtom } from '../UserAtom';
function Header() {
  const user=useRecoilValue(userAtom);
  const navigate=useNavigate()
  const resetUser=useResetRecoilState(userAtom);
  function logout(){
    resetUser();
    localStorage.removeItem('token');
    navigate('/')
  }
  const headerclass = `fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-3 sm:px-6 py-2 text-white ${
  user.isLoggedIn ? 'border-b-2 border-[rgba(8,112,184,0.7)] bg-neutral-900' : ''
}`;

  return (
    <div className={headerclass}>
      <div className='py-1'>
        <Link to='/'>
          <h1 className='font-bold text-lg sm:text-xl'>Event Connect</h1>
        </Link>
      </div>
      <div>
        <ul className='flex items-center gap-2 sm:gap-4'>
          {!user.isLoggedIn && 
            <li>
              <button className='rounded-md py-1 px-2 text-xs sm:text-sm border border-[rgba(8,_112,_184,_0.7)] hover:bg-neutral-800 transition-colors'>
                <Link to='/signup'>Get Started</Link>
              </button>
            </li>
          }
          <li>
            {user.isLoggedIn ? 
              <button onClick={logout} className='py-1 px-2 rounded-md text-xs sm:text-sm border border-[rgba(8,_112,_184,_0.7)] hover:bg-neutral-800 transition-colors'>
                Log Out
              </button> :
              <button className='py-1 px-2 rounded-md text-xs sm:text-sm border border-[rgba(8,_112,_184,_0.7)] hover:bg-neutral-800 transition-colors'>
                <Link to='/signin'>Sign In</Link>
              </button>
            } 
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Header