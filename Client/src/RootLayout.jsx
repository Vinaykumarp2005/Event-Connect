import React from 'react'
import Header from '../src/components/common/Header'
import Footer from '../src/components/common/Footer'
import { Outlet } from 'react-router-dom'
function RootLayout() {
  return (
    <div>
      <Header/>
      <div className='min-h-screen'>
        <Outlet/>
      </div>
      <Footer/>
    </div>
  )
}

export default RootLayout