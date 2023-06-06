import React from 'react';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

const LoadingTextSkeleton = () => {
  return (
    <Stack width="80%" spacing={1}>
      <Box display="flex" flexDirection="row" columnGap={1}>
        <Skeleton width={28} height={28} variant="circular" />
        <Skeleton width="calc(100% - 28px - 8px)" variant="text" />
      </Box>
      <Skeleton variant="text" />
      <Skeleton variant="text" />
    </Stack>
  );
};

export default LoadingTextSkeleton;
