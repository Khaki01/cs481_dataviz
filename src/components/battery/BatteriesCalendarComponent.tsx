import React, { useState, useEffect } from 'react';
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PickerSelectionState } from '@mui/x-date-pickers/internals/hooks/usePicker/usePickerValue.types';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import dayjs, { Dayjs } from 'dayjs';
import Tooltip from '@mui/material/Tooltip';
import { Grid } from '@mui/material';
import BoopAnimation from 'components/animated/BoopAnimation';
import HelpIconButton from 'components/HelpIconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Joyride from 'react-joyride';

import Box from '@mui/material/Box';
import BatteryCharging20Icon from '@mui/icons-material/BatteryCharging20';
import BatteryCharging30Icon from '@mui/icons-material/BatteryCharging30';
import BatteryCharging50Icon from '@mui/icons-material/BatteryCharging50';
import BatteryCharging60Icon from '@mui/icons-material/BatteryCharging60';
import BatteryCharging80Icon from '@mui/icons-material/BatteryCharging80';
import BatteryCharging90Icon from '@mui/icons-material/BatteryCharging90';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import BatteryAlertIcon from '@mui/icons-material/BatteryAlert';
import PhysicalBattery, { useSharedAnimatePhysicalData } from './PhysicalBattery';
import PhoneBattery, { useSharedAnimatePhoneData } from './PhoneBattery';
import json from '../../../public/calendar_total.json';
import theme from 'styles/theme';

const roundToNearest = (n: number) => {
  const numbers = [20, 30, 50, 60, 80, 90, 100];
  let nearestNumber = numbers[0];
  let minDifference = Math.abs(n - nearestNumber);

  for (let i = 1; i < numbers.length; i++) {
    const difference = Math.abs(n - numbers[i]);
    if (difference < minDifference) {
      minDifference = difference;
      nearestNumber = numbers[i];
    }
  }

  return nearestNumber;
};

const batteryMap: {
  [key: number | string]: React.ReactElement<any, any>;
} = {
  absent: <BatteryAlertIcon fontSize="small" color="action" />,
  20: <BatteryCharging20Icon fontSize="small" color="error" />,
  30: <BatteryCharging30Icon fontSize="small" color="error" />,
  50: <BatteryCharging50Icon fontSize="small" color="warning" />,
  60: <BatteryCharging60Icon fontSize="small" color="warning" />,
  80: <BatteryCharging80Icon fontSize="small" color="success" />,
  90: <BatteryCharging90Icon fontSize="small" color="success" />,
  100: <BatteryChargingFullIcon fontSize="small" color="success" />,
};

const renderDay = ({ day, ...rest }: PickersDayProps<Dayjs>) => {
  const jsonCalendar = json as { date: string; value: number }[];
  const date =
    jsonCalendar?.find((item) => item.date == day.format('YYYY-MM-DD')) ?? null;
  return (
    <Box display="flex" flexDirection="column" alignItems="center" rowGap={0.5}>
      {date ? (
        <Tooltip placement="left-start" title={`${date.value.toFixed(1)}%`}>
          {batteryMap[roundToNearest(date.value)]}
        </Tooltip>
      ) : (
        batteryMap['absent']
      )}
      <PickersDay disabled day={day} {...rest} />
    </Box>
  );
};

const BatteriesCalendarComponent = () => {
  const [date, setDate] = useState<Dayjs>(dayjs('2019-05-02'));
  const [loading, setLoading] = useState(false);
  const [, setAnimatePhysicalData] = useSharedAnimatePhysicalData();
  const [, setAnimatePhoneData] = useSharedAnimatePhoneData();
  const handleChange = async <TDate,>(
    value: TDate | null,
    selectionState?: PickerSelectionState
  ) => {
    await setLoading(true);
    setDate(value as Dayjs);
    setAnimatePhoneData(false);
    setAnimatePhysicalData(false);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  const jsonCalendar = json as { date: string; value: number }[];
  const maxDate = jsonCalendar.reduce((a, b) => (a.date > b.date ? a : b));
  const minDate = jsonCalendar.reduce((a, b) => (a.date < b.date ? a : b));
  const shouldDisableDate = (date: Dayjs) => {
    return (
      dayjs(date).isAfter(dayjs(maxDate.date)) || dayjs(date).isBefore(minDate.date)
    );
  };

  const [domLoaded, setDomLoaded] = useState(false);
  const [runJoyride1, setRunJoyride1] = useState(false);

  useEffect(() => {
    setRunJoyride1(false);
    setDomLoaded(true);
  }, []);

  const steps = [
    {
      target: '#bpstep1',
      content: (
        <Typography>
          Shows daily phone usage score. The result is calculated using a simple
          penalty system. Apps are classified by categories and each category has a
          penalty factor. For example, health/food category has a low penalty factor.
          Final penalty is calculated using the total daily duration of app usage and
          multiplying by its penalty factor. The charge starts to decrease only after
          exceeding the target daily usage hours.
        </Typography>
      ),
      disableBeacon: true,
      showProgress: true,
    },
    {
      target: '#bpstep2',
      content: (
        <Typography>
          {' '}
          You can select the day of interest to see the details for that day. Days
          with no data are shown with gray battery. Hover over to see the average
          charge of phone usage and physical activity.
        </Typography>
      ),
      disableBeacon: true,
      showProgress: true,
    },
    {
      target: '#bpstep3',
      content: (
        <Typography>
          Shows daily physical activity. Given the set calorie goal, each physical
          activity accounts for that goal are calculated. If reaching and exceeding
          the goal, charge remains at 100%
        </Typography>
      ),
      disableBeacon: true,
      showProgress: true,
    },
  ];

  const handleStartJoyride = () => {
    setRunJoyride1(true);
  };

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;

    if (status === 'finished' || status === 'skipped') {
      setRunJoyride1(false);
    }
  };

  return (
    <div>
      <Stack height="100%" spacing={5}>
        <Grid container direction="row" justifyContent="space-between" spacing={2}>
          <Grid item>
            {<Typography variant="h4">{date?.format('MMM DD')}</Typography>}
          </Grid>
          <Grid item>
            {
              <BoopAnimation>
                <HelpIconButton onStart={handleStartJoyride}>
                  <Box maxWidth={150} p={2}>
                    <Typography>
                      You can visualize activities by clicking on progress plot or
                      badge
                    </Typography>
                  </Box>
                </HelpIconButton>
              </BoopAnimation>
            }
          </Grid>
        </Grid>

        <Stack
          height="100%"
          direction={{ md: 'row', xs: 'column' }}
          // alignItems="flex-start"
          justifyContent="space-between"
          // justifyContent="center"
          rowGap={4}
        >
          <PhoneBattery date={date.format('YYYY-MM-DD')} loading={loading} />
          <Box id="bpstep2">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                showDaysOutsideCurrentMonth
                shouldDisableDate={shouldDisableDate}
                sx={{
                  '& > *': {
                    minHeight: '300px',
                  },
                }}
                slots={{ day: renderDay }}
                slotProps={{
                  day: {
                    selectedDay: date,
                  } as any,
                }}
                value={date}
                onChange={handleChange}
              />
            </LocalizationProvider>
          </Box>
          <PhysicalBattery date={date.format('YYYY-MM-DD')} loading={loading} />
        </Stack>
      </Stack>
      <>
        {domLoaded && (
          <div>
            <Joyride
              steps={steps}
              continuous
              run={runJoyride1}
              callback={handleJoyrideCallback}
              styles={{
                options: {
                  primaryColor: theme.palette.primary.main,
                  textColor: theme.palette.text.secondary,
                  width: '500px',
                  zIndex: theme.zIndex.appBar + 1,
                },
              }}
            />
          </div>
        )}
      </>
    </div>
  );
};

export default BatteriesCalendarComponent;
