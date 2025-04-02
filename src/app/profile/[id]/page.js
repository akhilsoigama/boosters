'use client';

import Sidebar from '@/app/components/Sidebar';
import BottomNavbar from '@/app/components/BottomNavbar';
import UserProfile from '../profile';
import Posts from './Posts';
import { use, useMemo } from 'react';

const Page = ({ params }) => {
  const {id}= use(params)

  const renderedPosts = useMemo(() => <Posts ids={id} />, [id]);

  return (
    <div className='relative w-full bg-gradient-to-b dark:from-gray-950 dark:to-gray-950 h-screen'>
      <div className='w-full flex flex-col'>
        <Sidebar />
        <UserProfile />
        {renderedPosts}
      </div>
      <BottomNavbar />
    </div>
  );
};

export default Page;
