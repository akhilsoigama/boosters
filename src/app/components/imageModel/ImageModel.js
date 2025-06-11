'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

export default function ImageModal({ open, onClose, imageUrl }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative p-2 max-w-3xl w-[90%] rounded-lg bg-white dark:bg-gray-900 shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <IconButton
              onClick={onClose}
              className="absolute top-2 right-2 text-black dark:text-white"
            >
              <Close />
            </IconButton>
            <img
              src={imageUrl}
              alt="Profile Full"
              className="w-full h-auto rounded-md object-contain"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
