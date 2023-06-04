import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import BatteriesCalendarComponent from '../../components/battery/BatteriesCalendarComponent';

const BatterPage = () => {
  return (
    <Box display="flex" flexDirection="column" width="100%" rowGap={2}>
      <BatteriesCalendarComponent />
    </Box>
  );
};

export default BatterPage;
