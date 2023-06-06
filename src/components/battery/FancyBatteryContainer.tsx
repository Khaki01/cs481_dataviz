import React, { PropsWithChildren } from 'react';
import { Box, styled } from '@mui/material';

const BatteryWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'flex-end',
  width: 100,
  height: 200,
  position: 'relative',
  border: '2px solid black',
  borderRadius: 5,
  overflow: 'hidden',
});

const BatteryContainer = ({ children }: PropsWithChildren) => {
  return <BatteryWrapper>{children}</BatteryWrapper>;
};

export default BatteryContainer;
