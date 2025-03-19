'use client';
import React, { useMemo } from 'react';
import CreatePost from './CreatePost';
import Sidebar from '@/app/components/Sidebar';
import BottomNavbar from '@/app/components/BottomNavbar';

const Page = () => {
  const createPostMemo = useMemo(() => <CreatePost />, []);

  return (
    <div className='relative w-full h-screen'>
      <div className='w-full flex'>
        {/* <Sidebar /> */}
        {createPostMemo}
      </div>
      <BottomNavbar />
    </div>
  );
};

export default Page;
