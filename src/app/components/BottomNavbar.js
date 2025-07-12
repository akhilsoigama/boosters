'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Settings } from '@mui/icons-material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ChatIcon from '@mui/icons-material/Chat';
import { useUser } from '../contaxt/userContaxt';
import { useProfiles } from '../hooks/Profile';

const BottomNavbar = () => {
  const { user } = useUser();
  const { profiles } = useProfiles();
  const pathname = usePathname();

  const userId = user?._id;
  const isActive = (link) => pathname === link;

  const ProfileLogo = ({ user }) => {
    if (!user) return null;

    const profile = profiles?.find((p) => p.userId._id === userId);
    if (profile?.avatar) {
      return (
        <img
          src={profile.avatar}
          alt="avatar"
          className="w-8 h-8 rounded-full object-cover border border-gray-300"
        />
      );
    }

    return (
      <div className="w-8 h-8 grid place-items-center rounded-full bg-white dark:bg-gray-800 text-black dark:text-white border">
        {user.fullName?.charAt(0).toUpperCase()}
      </div>
    );
  };

  const menuItems = [
    { text: 'Home', icon: <Home />, link: '/' },
    { text: 'Settings', icon: <Settings />, link: '/settings' },
    { text: 'Chat', icon: <ChatIcon />, link: '/pages/chatbot' },
    { text: 'Profile', icon: <ProfileLogo user={user} />, link: `/profile/${userId}` },
  ];

  return (
    <div className="fixed bottom-0 w-full z-50 md:hidden">
      <div className="relative">
        <div className="absolute inset-0 h-16 bg-white dark:bg-black rounded-t-3xl shadow-md z-0" />

        <div className="relative z-10 flex justify-between items-center h-16">
          {menuItems.slice(0, 2).map((item, index) => (
            <Link href={item.link} key={index} className="flex-1 text-center">
              <motion.div
                whileTap={{ scale: 0.85 }}
                whileHover={{ scale: 1.1 }}
                className="flex justify-center items-center h-full"
              >
                <span
                  className={`text-2xl ${
                    isActive(item.link) ? 'text-sky-500' : 'text-gray-600 dark:text-white'
                  }`}
                >
                  {item.icon}
                </span>
              </motion.div>
            </Link>
          ))}

          {/* Floating Center Post Button */}
          <div className="relative -top-6">
            <Link href="/pages/createPost">
              <motion.div
                whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="bg-white dark:bg-gray-900 p-3 rounded-full shadow-xl border-4 border-white dark:border-black"
              >
                <AddCircleIcon className="text-sky-500 text-4xl" />
              </motion.div>
            </Link>
          </div>

          {menuItems.slice(2).map((item, index) => (
            <Link href={item.link} key={index + 2} className="flex-1 text-center">
              <motion.div
                whileTap={{ scale: 0.85 }}
                whileHover={{ scale: 1.1 }}
                className="flex justify-center items-center h-full"
              >
                <span
                  className={`text-2xl ${
                    isActive(item.link) ? 'text-sky-500' : 'text-gray-600 dark:text-white'
                  }`}
                >
                  {item.icon}
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BottomNavbar;
