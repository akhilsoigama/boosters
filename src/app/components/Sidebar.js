'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { List, ListItem, IconButton } from '@mui/material';
import { Home, People, Notifications, Mail, Settings } from '@mui/icons-material';
import { bounce, sidebarVariants, slideInUp, } from './motion/motion';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Image from 'next/image';
import Link from 'next/link';
import { ModeToggle } from '../ModeToggle';
import { DropdownMenuDemo } from './profile/Profile';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { text: 'Home', icon: <Home />, link: '/' },
    { text: 'Friends', icon: <People />, link: '/friends' },
    { text: 'Create Post', icon: <AddCircleIcon />, link: '/pages/createPost' },
    { text: 'Messages', icon: <Mail />, link: '/messages' },
    { text: 'Settings', icon: <Settings />, link: '/settings' },
  ];

  return (
    <>
      <div className="w-full flex fixed ">
        <motion.div
          className={`h-screen hidden fixed md:flex flex-col border-r shadow-md z-50 backdrop-blur-md lg:w-64 ${isOpen ? 'w-64' : 'w-20 lg:w-64'
            } transition-all duration-300 relative`}
          initial="closed"
          animate={isOpen ? 'open' : 'closed'}
          variants={sidebarVariants}
        >
          <IconButton
            onClick={toggleSidebar}
            className="self-end m-2 dark:text-white fixed right-[-20px] top-12 bg-white z-30"
          >
            {!isOpen ? (
              <KeyboardArrowRightIcon className="border-2 rounded-full text-3xl bg-white dark:bg-black" />
            ) : (
              <KeyboardArrowRightIcon className="transform rotate-180 border-2 rounded-full text-3xl bg-white dark:bg-black" />
            )}
          </IconButton>

          <Image src="/logo-transparent-svg.svg" alt="Booster" width={150} height={40} />

          <List>
            {menuItems.map((item, index) => (
              <Link href={item.link} key={index} passHref>
                <ListItem
                  component="div"
                  className="hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                >
                  <motion.div
                    variants={bounce}
                    whileHover="hover"
                    whileTap="tap"
                    className="p-2 flex gap-3 items-center rounded-lg"
                  >
                    <span className="dark:text-white text-gray-700">{item.icon}</span>
                    {isOpen && (
                      <span className="dark:text-white text-gray-700">{item.text}</span>
                    )}
                  </motion.div>
                </ListItem>
              </Link>
            ))}
          </List>
        </motion.div>
        <motion.div
          className="hidden p-4 fixed right-0 md:flex gap-2 items-center justify-between"
          variants={slideInUp}
          initial="hidden"
          animate="visible"
        >
          <ModeToggle />
          <DropdownMenuDemo />

        </motion.div>
      </div>

    </>
  );
};

export default Sidebar;