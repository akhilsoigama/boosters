import { motion } from 'framer-motion';

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

export const slideInLeft = {
  hidden: { x: -300, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
};

export const bounce = {
  hidden: { y: 0 },
  visible: { y: 0 },
  hover: { y: -10, transition: { type: 'spring', stiffness: 300 } },
  tap: { y: 0, scale: 0.9 },
};


export const sidebarVariants = {
  open: { width: 220 },
  closed: { width: 72 },
};
export const slideInRight = {
  hidden: { x: 100 }, 
  visible: { x: 0, transition: { duration: 0.8 } },
};

export const slideInUp = {
  hidden: { y: 50 }, 
  visible: { y: 0, transition: { duration: 0.8 } },
};

export const bounceText = {
  hidden: { y: -20 }, 
  visible: { y: 0, transition: { type: 'spring', stiffness: 120 } },
};
export const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const fieldVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};
export const MotionDiv = motion.div;