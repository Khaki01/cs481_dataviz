import React from 'react';
import Box from '@mui/material/Box';
import BatteriesCalendarComponent from 'components/battery/BatteriesCalendarComponent';

const BatterPage = () => {
  return (
    <Box
      display="flex"
      height="calc(100vh - 112px)"
      flexDirection="column"
      width="100%"
      rowGap={2}
    >
      <BatteriesCalendarComponent />
    </Box>
  );
};

export default BatterPage;
