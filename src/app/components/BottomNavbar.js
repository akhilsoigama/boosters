'use client'
import { motion } from 'framer-motion';
import { Home, People, Settings } from '@mui/icons-material';
import { bounce, fadeIn, slideInLeft } from './motion/motion';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import Link from 'next/link';
import AddCircleIcon from '@mui/icons-material/AddCircle';
const BottomNavbar = () => {
  const menuItems = [
    { text: 'Home', icon: <Home />, link: '/' },
    { text: 'Friends', icon: <People />, link: '/friends' },
    { text: 'create post', icon: <AddCircleIcon className='text-3xl'/>, link: '/pages/createPost' },
    { text: 'Settings', icon: <Settings />, link: '/settings' },
    { text: 'Profile', icon: <AccountBoxIcon />, link: '/pages/profile' },
  ];

  return (
    <motion.div
      variants={fadeIn} 
      initial="hidden" 
      animate="visible" 
      className="fixed bottom-0 w-full shadow-md backdrop-blur-md  transition-all duration-300 md:hidden z-50"
    >
      <motion.div
        variants={slideInLeft} 
        initial="hidden"
        animate="visible" 
        className="flex justify-around px-2 py-1"
      >
        {menuItems.map((item, index) => (
          <Link href={item.link} key={index} passHref>
          <div className="hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors duration-200">
            <motion.div
              variants={bounce}
              whileHover="hover"
              whileTap="tap"
              className="p-2 flex gap-3 items-center rounded-lg"
            >
              <span className="dark:text-white text-gray-700">{item.icon}</span>
              
            </motion.div>
          </div>
        </Link>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default BottomNavbar;