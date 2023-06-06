import React, { useEffect, useMemo, useState } from 'react';
import AnimatedBattery from 'components/battery/AnimatedBattery';
import { capitalize, groupBy, timeConversion } from 'utils';
import {
  ActivityBatteryType,
  PhysicalActivityBattery,
} from 'pages/api/battery-physical-activity';
import TextAnimation from 'components/animated/TextAnimation';
import Stack from '@mui/material/Stack';
import { useBetween } from 'use-between';
import LoadingTextSkeleton from 'components/animated/LoadingTextSkeleton';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import Grid from '@mui/system/Unstable_Grid';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface PhysicalBatteryProps {
  loading: boolean;
  date: string;
}

const useAnimatePhysicalData = () => {
  return useState(false);
};

export const useSharedAnimatePhysicalData = () => useBetween(useAnimatePhysicalData);

const PhysicalBattery = ({ loading, date }: PhysicalBatteryProps) => {
  const activityTypeMap: { [key in ActivityBatteryType]: React.ReactNode } = {
    RUNNING: <DirectionsRunIcon color="primary" />,
    OTHERS: <AccessibilityNewIcon color="info" />,
    WORKOUT: <FitnessCenterIcon color="inherit" />,
    CYCLING: <DirectionsBikeIcon color="warning" />,
  };
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

  const breakdown = useMemo<{
    totalActivity: number;
    activities: PhysicalActivityBattery[];
  }>(() => {
    if (physicalData) {
      const activities = groupBy(physicalData, (v) => v.timestamp)[date];
      return {
        totalActivity: activities.reduce((acc, cur) => acc + cur.duration, 0),
        activities: activities,
      };
    }
    return {
      activities: [],
      totalActivity: 0,
    };
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
    <Stack width={300} direction="column" alignItems="center" spacing={2}>
      <Typography variant="h5">Daily physical activity</Typography>
      <AnimatedBattery
        loading={loading || !physicalData}
        Icon={<FavoriteIcon fontSize="large" color="error" />}
        percentage={Math.round(batteryPercentage)}
      />
      {animatePhysicalData ? (
        <TextAnimation
          sx={{ display: 'flex', alignItems: 'center' }}
          variant="subtitle1"
        >
          <Grid container spacing={1}>
            <Grid xs={12}>
              <Box display="flex" alignItems="center" columnGap={0.5}>
                <MonitorHeartIcon color="error" />
                Total {timeConversion(Number(breakdown.totalActivity.toFixed(1)))}
              </Box>
            </Grid>
            {breakdown.activities.map((activity) => (
              <>
                {timeConversion(activity.duration) ? (
                  <Grid key={activity.duration} xs={12}>
                    {activityTypeMap[activity.type]} {capitalize(activity.type)}{' '}
                    {timeConversion(activity.duration)}
                  </Grid>
                ) : null}
              </>
            ))}
          </Grid>
        </TextAnimation>
      ) : (
        <LoadingTextSkeleton />
      )}
    </Stack>
  );
};

export default React.memo(PhysicalBattery);
