import React from 'react';
import Box from '@mui/material/Box';
import BatteryContainer from 'components/battery/FancyBatteryContainer';
import MemoizedWave from './MemoizedWave';
import PumpAnimation from 'components/animated/PumpAnimation';
import { ScaleLoader } from 'react-spinners';
import theme from 'styles/theme';
interface AnimatedBatteryProps {
  loading: boolean;
  percentage: number;
  Icon: React.ReactNode;
  inverse?: boolean;
}
const AnimatedBattery = ({
  percentage,
  Icon,
  loading,
  inverse = false,
}: AnimatedBatteryProps) => {
  return (
    <Box height="100%" alignItems="flex-end">
      <BatteryContainer>
        {loading ? (
          <Box
            height="100%"
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <ScaleLoader color={theme.palette.primary.main} loading={loading} />
          </Box>
        ) : (
          <>
            <MemoizedWave percentage={percentage} inverse={inverse} />
            <Box
              sx={{
                position: 'absolute',
                left: 'calc(50% - 17.5px)',
                top: 'calc(50% - 17.5px)',
              }}
            >
              <PumpAnimation>{Icon}</PumpAnimation>
            </Box>
          </>
        )}
      </BatteryContainer>
    </Box>
  );
};

export default AnimatedBattery;
