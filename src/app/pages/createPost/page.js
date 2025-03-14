'use client'
import React from 'react'
import CreatePost from './CreatePost'
import { UserProvider } from '@/app/contaxt/userContaxt'
import Sidebar from '@/app/components/Sidebar'
import BottomNavbar from '@/app/components/BottomNavbar'

const page = () => {
  return (
    <div className='relative w-full h-screen'>
    <UserProvider>
      <div className='w-full flex '>
        {/* <Sidebar /> */}
        <CreatePost/>
      </div>
      <BottomNavbar />
    </UserProvider>
  </div>
  )
}

export default page