'use client';

import {
  Modal,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Button,
} from '@mui/material';
import {
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaTelegram,
  FaLink,
  FaEllipsisH,
  FaReddit,
  FaPinterest,
  FaSkype,
  FaEnvelope,
} from 'react-icons/fa';
import { toast } from 'sonner';
import { useState } from 'react';
import { useUser } from '@/app/contaxt/userContaxt';

const primaryOptions = [
  {
    label: 'WhatsApp',
    icon: <FaWhatsapp className="text-green-500" size={24} />,
    url: (link) => `https://wa.me/?text=${encodeURIComponent(link)}`,
  },
  {
    label: 'Facebook',
    icon: <FaFacebook className="text-blue-600" size={24} />,
    url: (link) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
  },
  {
    label: 'Twitter',
    icon: <FaTwitter className="text-sky-500" size={24} />,
    url: (link) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}`,
  },
  {
    label: 'LinkedIn',
    icon: <FaLinkedin className="text-blue-700" size={24} />,
    url: (link) =>
      `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(link)}`,
  },
  {
    label: 'Telegram',
    icon: <FaTelegram className="text-sky-400" size={24} />,
    url: (link) => `https://t.me/share/url?url=${encodeURIComponent(link)}`,
  },
];

const additionalOptions = [
  {
    label: 'Instagram',
    icon: <FaInstagram className="text-pink-500" size={24} />,
    url: (_) => `https://www.instagram.com/`,
  },
  {
    label: 'Reddit',
    icon: <FaReddit className="text-orange-500" size={24} />,
    url: (link) => `https://reddit.com/submit?url=${encodeURIComponent(link)}`,
  },
  {
    label: 'Pinterest',
    icon: <FaPinterest className="text-red-600" size={24} />,
    url: (link) => `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(link)}`,
  },
  {
    label: 'Skype',
    icon: <FaSkype className="text-blue-400" size={24} />,
    url: (link) => `https://web.skype.com/share?url=${encodeURIComponent(link)}`,
  },
  {
    label: 'Gmail',
    icon: <FaEnvelope className="text-red-500" size={24} />,
    url: (link) => `mailto:?subject=Check this out&body=${encodeURIComponent(link)}`,
  },
];

const staticOptions = [
  {
    label: 'Copy Link',
    icon: <FaLink size={24} />,
    action: 'copy',
  },
  {
    label: 'Other',
    icon: <FaEllipsisH size={24} />,
    action: 'toggleMore',
  },
];

const ShareModal = ({ open, handleClose }) => {
  const { user } = useUser();
  const [showMore, setShowMore] = useState(false);
  const shareLink = `https://boosters-sooty.vercel.app/pages/${user?._id || 'guest'}`;

  const handleAction = async (option) => {
    if (option.action === 'copy') {
      try {
        await navigator.clipboard.writeText(shareLink);
        toast.success('Link copied to clipboard!');
      } catch {
        toast.error('Failed to copy link.');
      }
    } else if (option.action === 'toggleMore') {
      setShowMore((prev) => !prev);
    } else {
      window.open(option.url(shareLink), '_blank');
    }
  };

  const shareOptions = [
    ...primaryOptions,
    ...(showMore ? additionalOptions : []),
    ...staticOptions,
  ];

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        className="bg-white dark:bg-gray-900 w-[105%] sm:w-[550px] max-w-[600px] mx-auto mt-32 rounded-xl p-6 text-center shadow-xl"
      >
        <Typography variant="h6" className="mb-4 font-semibold dark:text-white">
          Share this post
        </Typography>

        <Box className="flex justify-center flex-wrap gap-4">
          {shareOptions.map((option) => (
            <Tooltip title={option.label} key={option.label}>
              <IconButton onClick={() => handleAction(option)}>
                {option.icon}
              </IconButton>
            </Tooltip>
          ))}
        </Box>

        <Box className="mt-6">
          <Button
            variant="outlined"
            onClick={handleClose}
            className="capitalize dark:text-white"
          >
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ShareModal;
