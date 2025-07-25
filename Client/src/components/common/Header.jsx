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
  return (
    <div className='bg-blue-500 p-3  flex justify-between'>
      <div className='p-1'>
        <Link to='/'>Logo</Link>
      
      </div>
      <div className='pr-8 bg-red-200'>
          <ul className='flex justify-between p-1'>
           {!user.isLoggedIn&& <li className='p-1'>
              <Link to='/signup'>Get Started</Link>
            </li>}
            <li className='p-1'>
            {user.isLoggedIn?<button onClick={logout}>
              Logout
              </button> :<Link to='/signin'>
              Signin
              </Link>}  
            </li>
          </ul>
      </div>
    </div>
  )
}

export default Header