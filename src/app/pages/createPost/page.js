'use client';
import React, { Suspense, useMemo } from 'react';
import CreatePost from './CreatePost';
import Sidebar from '@/app/components/Sidebar';
import BottomNavbar from '@/app/components/BottomNavbar';

const Page = () => {
  const createPostMemo = useMemo(() => <CreatePost />, []);

  return (
    <div className='relative w-full h-screen'>
      <div className='w-full flex'>
        {/* <Sidebar /> */}
        <Suspense fallback={<div>Loading...</div>}>
            {/* <CreatePostComponent /> */}
        {createPostMemo}
        </Suspense>
      </div>
      <BottomNavbar />
    </div>
  );
};

export default Page;
