import React, { useEffect, useMemo, useState } from 'react';
import DirectionsRunOutlinedIcon from '@mui/icons-material/DirectionsRunOutlined';
import AnimatedBattery from './AnimatedBattery';
import { groupBy } from 'utils';
import { PhysicalActivityBattery } from 'pages/api/battery-physical-activity';
import TextAnimation from 'components/animated/TextAnimation';
import Stack from '@mui/material/Stack';
import { useBetween } from 'use-between';
import LoadingTextSkeleton from 'components/animated/LoadingTextSkeleton';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';

interface PhysicalBatteryProps {
  loading: boolean;
  date: string;
}

const useAnimatePhysicalData = () => {
  return useState(false);
};

export const useSharedAnimatePhysicalData = () => useBetween(useAnimatePhysicalData);

const PhysicalBattery = ({ loading, date }: PhysicalBatteryProps) => {
  const [physicalData, setPhysicalData] = useState<PhysicalActivityBattery[]>();
  const [animatePhysicalData] = useSharedAnimatePhysicalData();
  const batteryPercentage = useMemo(() => {
    if (physicalData) {
      return groupBy(physicalData, (v) => v.timestamp)[date].reduce(
        (acc, cur) => acc + cur.reward,
        0
      );
    }
    return 0;
  }, [date, physicalData]);

  const totalActivity = useMemo(() => {
    if (physicalData) {
      return (
        groupBy(physicalData, (v) => v.timestamp)[date].reduce(
          (acc, cur) => acc + cur.duration,
          0
        ) /
        (1000 * 60 * 60)
      );
    }
    return;
  }, [date, physicalData]);
  const fetchData = async () => {
    try {
      const response = await fetch('api/battery-physical-activity');
      const jsonData = (await response.json()) as {
        data: PhysicalActivityBattery[];
      };
      await setPhysicalData(jsonData.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Stack
      height="100%"
      width={300}
      direction="column"
      alignItems="center"
      spacing={2}
    >
      <AnimatedBattery
        loading={loading || !physicalData}
        Icon={<DirectionsRunOutlinedIcon fontSize="large" color="primary" />}
        percentage={Math.round(batteryPercentage)}
      />
      {animatePhysicalData ? (
        <TextAnimation
          sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}
          variant="h6"
        >
          <MonitorHeartIcon color="error" />
          Total activity {totalActivity?.toFixed(1)} hours
        </TextAnimation>
      ) : (
        <LoadingTextSkeleton />
      )}
    </Stack>
  );
};

export default React.memo(PhysicalBattery);
