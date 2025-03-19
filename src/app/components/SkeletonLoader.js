'use client';
import { motion } from 'framer-motion';
import { Card, CardHeader, Skeleton, CardContent, CardActions } from '@mui/material';

const SkeletonLoader = () => (
  <div className="space-y-6 max-w-md lg:max-w-2xl grid grid-cols-1 place-items-center">
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: i * 0.1 }}
        className="w-full"
      >
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:text-white">
          <CardHeader
            avatar={<Skeleton variant="circular" width={40} height={40} />}
            title={<Skeleton variant="text" width={150} />}
            subheader={<Skeleton variant="text" width={100} />}
            className="bg-blue-50 dark:bg-gray-700 italic"
          />
          <CardContent className="w-full flex justify-center">
            <Skeleton variant="rectangular" width={512} height={256} />
          </CardContent>
          <CardContent className="h-60 overflow-y-auto w-full">
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="80%" height={20} />
          </CardContent>
          <CardActions disableSpacing className="bg-gray-100 dark:bg-gray-700">
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="circular" width={40} height={40} />
          </CardActions>
        </Card>
      </motion.div>
    ))}
  </div>
);

export default SkeletonLoader;
