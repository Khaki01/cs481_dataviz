import React, { useEffect, useMemo, useState } from 'react';
import SmartphoneOutlinedIcon from '@mui/icons-material/SmartphoneOutlined';
import AnimatedBattery from './AnimatedBattery';
import { PhoneUsageBattery } from 'pages/api/battery-phone-usage';
import { groupBy } from 'utils';
import Stack from '@mui/material/Stack';
import TextAnimation from 'components/animated/TextAnimation';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Box from '@mui/material/Box';
import { useBetween } from 'use-between';
import LoadingTextSkeleton from 'components/animated/LoadingTextSkeleton';

interface PhoneBatteryProps {
  loading: boolean;
  date: string;
}

const useAnimatePhoneData = () => {
  return useState(false);
};

export const useSharedAnimatePhoneData = () => useBetween(useAnimatePhoneData);
const PhoneBattery = ({ loading, date }: PhoneBatteryProps) => {
  const [phoneData, setPhoneData] = useState<PhoneUsageBattery[]>();
  const [animatePhoneData] = useSharedAnimatePhoneData();

  const batteryPercentage = useMemo(() => {
    if (phoneData) {
      return groupBy(phoneData, (v) => v.datetime)[date].reduce(
        (acc, cur) => (acc > cur.penalty_points ? cur.penalty_points : acc),
        100
      );
    }
    return 100;
  }, [date, phoneData]);

  const totalUsage = useMemo(() => {
    if (phoneData) {
      return (
        groupBy(phoneData, (v) => v.datetime)[date].reduce(
          (acc, cur) => acc + cur.duration_ms,
          0
        ) /
        (1000 * 60 * 60)
      );
    }
    return;
  }, [date, phoneData]);

  const fetchData = async () => {
    try {
      const response = await fetch('api/battery-phone-usage');
      const jsonData = (await response.json()) as { data: PhoneUsageBattery[] };
      setPhoneData(jsonData.data);
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
        type="phone"
        loading={loading}
        Icon={<SmartphoneOutlinedIcon fontSize="large" color="primary" />}
        percentage={Math.round(batteryPercentage)}
      />
      {animatePhoneData ? (
        <TextAnimation
          sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}
          variant="h6"
        >
          <AccessTimeIcon color="info" />
          Total usage {totalUsage?.toFixed(1)} hours
        </TextAnimation>
      ) : (
        <LoadingTextSkeleton />
      )}
    </Stack>
  );
};

export default React.memo(PhoneBattery);
