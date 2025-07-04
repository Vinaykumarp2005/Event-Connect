import React from 'react'
import { Link } from 'react-router-dom'
function Header() {
  return (
    <div className='bg-blue-500 p-3  flex justify-between'>
      <div className='p-1'>
      Logo
      </div>
      <div className='pr-8 bg-red-200'>
          <ul className='flex justify-between p-1'>
            <li className='p-1'>
              <Link to='/signup'>Get Started</Link>
            </li>
            <li className='p-1'>
              <Link to='/signin'>
              Signin
              </Link>
            </li>
          </ul>
      </div>
    </div>
  )
}

export default Header