import React, { useEffect, useMemo, useState } from 'react';
import SmartphoneOutlinedIcon from '@mui/icons-material/SmartphoneOutlined';
import AnimatedBattery from 'components/battery/AnimatedBattery';
import {
  PhoneBatteryCategory,
  PhoneUsageBattery,
} from 'pages/api/battery-phone-usage';
import { capitalize, groupBy, timeConversion } from 'utils';
import Stack from '@mui/material/Stack';
import TextAnimation from 'components/animated/TextAnimation';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useBetween } from 'use-between';
import LoadingTextSkeleton from 'components/animated/LoadingTextSkeleton';
import Grid from '@mui/system/Unstable_Grid';
import Box from '@mui/material/Box';
import InterestsIcon from '@mui/icons-material/Interests';
import MapsUgcIcon from '@mui/icons-material/MapsUgc';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import Typography from '@mui/material/Typography';

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
  const categoryTypeMap: {
    [key in PhoneBatteryCategory | string]: React.ReactNode;
  } = {
    Entertainment: <OndemandVideoIcon color="success" />,
    Communication: <MapsUgcIcon color="error" />,
    Other: <InterestsIcon color="warning" />,
  };

  const batteryPercentage = useMemo(() => {
    if (phoneData) {
      return groupBy(phoneData, (v) => v.datetime)[date].reduce(
        (acc, cur) => (acc > cur.penalty_points ? cur.penalty_points : acc),
        100
      );
    }
    return 100;
  }, [date, phoneData]);

  const breakdown = useMemo<{
    totalUsage: number;
    activities: { category: PhoneBatteryCategory | string; duration: number }[];
  }>(() => {
    if (phoneData) {
      const activities = groupBy(phoneData, (v) => v.datetime)[date];
      return {
        totalUsage: activities.reduce((acc, cur) => acc + cur.duration_ms, 0),
        activities: [
          ...(groupBy(activities, (v) => v.category)?.['Communication']
            ? [
                {
                  category: 'Communication',
                  duration: groupBy(activities, (v) => v.category)?.[
                    'Communication'
                  ].reduce((acc, cur) => cur.duration_ms + acc, 0),
                },
              ]
            : []),
          ...(groupBy(activities, (v) => v.category)?.['Entertainment']
            ? [
                {
                  category: 'Entertainment',
                  duration: groupBy(activities, (v) => v.category)[
                    'Entertainment'
                  ].reduce((acc, cur) => cur.duration_ms + acc, 0),
                },
              ]
            : []),
          ...(groupBy(activities, (v) => v.category)?.['Other']
            ? [
                {
                  category: 'Other',
                  duration: groupBy(activities, (v) => v.category)['Other'].reduce(
                    (acc, cur) => cur.duration_ms + acc,
                    0
                  ),
                },
              ]
            : []),
        ],
      };
    }
    return {
      totalUsage: 0,
      activities: [],
    };
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
      <Typography variant="h5">Daily phone usage</Typography>
      <AnimatedBattery
        type="phone"
        loading={loading}
        Icon={<SmartphoneOutlinedIcon fontSize="large" color="info" />}
        percentage={Math.round(batteryPercentage)}
      />
      {animatePhoneData ? (
        <TextAnimation
          sx={{ display: 'flex', alignItems: 'center' }}
          variant="subtitle1"
        >
          <Grid container spacing={1}>
            <Grid xs={12}>
              <Box display="flex" alignItems="center" columnGap={0.5}>
                <AccessTimeIcon color="info" />
                Total {timeConversion(Number(breakdown.totalUsage.toFixed(1)))}
              </Box>
            </Grid>
            {breakdown.activities.map((activity) => (
              <Grid key={activity.category} xs={12}>
                {categoryTypeMap[activity.category]} {capitalize(activity.category)}{' '}
                {timeConversion(activity.duration)}
              </Grid>
            ))}
          </Grid>
        </TextAnimation>
      ) : (
        <LoadingTextSkeleton />
      )}
    </Stack>
  );
};

export default React.memo(PhoneBattery);
