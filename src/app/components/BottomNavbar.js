'use client'
import { motion } from 'framer-motion';
import { Home,  Settings } from '@mui/icons-material';
import { bounce, fadeIn, slideInLeft } from './motion/motion';
import Link from 'next/link';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useUser } from '../contaxt/userContaxt';
import ChatIcon from '@mui/icons-material/Chat';

const BottomNavbar = () => {
  const { user } = useUser()
  const userId = user ? user._id : ''
  const ProfileLogo = ({ user }) => {
    return (
      <div className='size-8 grid place-items-center rounded-full border '>
        {user ? user.fullName.charAt(0).toUpperCase() : ''}
      </div>
    )
  }
  const menuItems = [
    { text: 'Home', icon: <Home />, link: '/' },
    { text: 'AI chatbot', icon: <ChatIcon/>, link: '/pages/chatbot' },
    { text: 'create post', icon: <AddCircleIcon className='text-3xl' />, link: '/pages/createPost' },
    { text: 'Settings', icon: <Settings />, link: '' },
    { text: 'Profile', icon: <ProfileLogo user={user} />, link: `/profile/${userId} ` },
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