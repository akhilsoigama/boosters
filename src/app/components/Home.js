'use client';
import { motion } from 'framer-motion';
import SkeletonLoader from '../components/SkeletonLoader';
import { usePost } from '../contaxt/PostContaxt';
import RandomPostsPage from './RandomePost/RandomePost';


const HomePage = () => {
  const {
    visiblePosts,
    loading,
    hasMore,
    lastPostRef,
 
  } = usePost();

  if (loading) return (
    <div className="min-h-screen p-6 pt-20 w-full flex justify-center bg-gray-50 dark:bg-gray-900">
      <SkeletonLoader />
    </div>
  );

  return (
    <div className="min-h-screen p-2 md:p-6 pt-20 w-full flex justify-center bg-gradient-to-b dark:from-gray-950 dark:to-gray-950">
      <div className="space-y-6 max-w-md lg:max-w-2xl grid grid-cols-1 place-items-center">
        {visiblePosts.map((post, i) => (
          <motion.div
            key={post._id}
            ref={i === visiblePosts.length - 1 ? lastPostRef : null}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.1 }}
            className="w-full"
          >
           <RandomPostsPage/>
          </motion.div>
        ))}
        {!hasMore && <p className="text-gray-500 dark:text-gray-400 text-center">No more posts to load.</p>}
      </div>
   
    </div>
  );
};

export default HomePage;
