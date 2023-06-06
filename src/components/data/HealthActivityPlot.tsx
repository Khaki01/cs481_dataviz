import React, { useEffect, useMemo, useState } from 'react';
import { ParseResult } from 'papaparse';
import { PhysicalDays } from 'pages/api/health-activity';
import moment from 'moment';
import dynamic from 'next/dynamic';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import theme from 'styles/theme';
import { extendArray, generateArray } from 'utils';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Joyride from 'react-joyride';

import { AirbnbSlider, AirbnbThumbComponent } from '../custom/slider';
import { useGoalContext } from '../context/GoalProvider';
import PumpAnimation from '../animated/PumpAnimation';
import BoopAnimation from '../animated/BoopAnimation';
import Typography from '@mui/material/Typography';
import { PlotMouseEvent } from 'plotly.js';
import { useRouter } from 'next/router';
import { ScaleLoader } from 'react-spinners';
import HelpIconButton from '../HelpIconButton';
import { activityMap, ActivityType } from './HealthActivityDistAndPie';
import { WhatshotOutlined } from '@mui/icons-material';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useBetween } from 'use-between';

const useIdx = () => {
  return useState<number>();
};

export const useSharedIdx = () => useBetween(useIdx);
interface Option<T extends string> {
  label: string;
  value: T;
}
const HealthActivityPlot = () => {
  const { push } = useRouter();
  const daysOptions: Option<string>[] = [
    { label: 'Week', value: '7' },
    { label: '5 days', value: '5' },
    { label: '3 days', value: '3' },
  ];
  const appOptions: Option<ActivityType>[] = [
    { label: 'All activities', value: 'all' },
    { label: 'Cycling', value: 'cycling' },
    { label: 'Running', value: 'running' },
    { label: 'Workout', value: 'workout' },
    { label: 'Others', value: 'others' },
  ];
  const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });
  const [data, setData] = useState<ParseResult<PhysicalDays> | null>(null);
  const [graphLoading, setGraphLoading] = useState(true);
  const [daysFilter, setDaysFilter] = useState<number>(7);
  const [activityFilter, setActivityFilter] = useState<ActivityType>('all');
  const [idx, setIdx] = useSharedIdx();
  const fetchData = async () => {
    try {
      const response = await fetch('api/health-activity');
      const jsonData = await response.json();
      setData(jsonData);
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    fetchData().then(() => setTimeout(() => setGraphLoading(false), 500));
  }, []);

  const days = useMemo(() => {
    return (
      data?.data
        ?.map((item) => moment(item.timestamp).format('MMM DD'))
        .slice(-daysFilter) ?? []
    );
  }, [data?.data, daysFilter]);

  const handleSelect = (event: SelectChangeEvent) => {
    setDaysFilter(Number(event.target.value));
  };

  const handleActivitySelect = (event: SelectChangeEvent) => {
    setActivityFilter(event.target.value as ActivityType);
  };

  const {
    activity: [value, setValue],
  } = useGoalContext();
  const handleSlider = (event: Event, newValue: number | number[]) => {
    setGraphLoading(true);
    setValue(String(newValue));
    setTimeout(() => {
      setGraphLoading(false);
    }, 250);
  };

  const returnBarData = useMemo(() => {
    const bar1Data = data?.data.map(
      (item) =>
        activityFilter === 'all'
          ? item.GOAL + Number(value ?? 0)
          : item[activityMap[activityFilter]] //Orange
    );
    const bar2Data = data?.data.map(
      (item) =>
        activityFilter === 'all'
          ? item.EXTRA - Number(value ?? 0)
          : item.TOTAL - item[activityMap[activityFilter]] //Green and scatter
    );
    return {
      bar1: bar1Data?.slice(-daysFilter),
      bar2: bar2Data?.slice(-daysFilter),
    };
  }, [activityFilter, data?.data, daysFilter, value]);

  const returnScatterData = useMemo(() => {
    const scatter1Data =
      activityFilter === 'all'
        ? data?.data.map((item) => item.GOAL + Number(value ?? 0))
        : [];
    const scatter2Data = data?.data.map((item) => item.TOTAL);
    return {
      scatter1: scatter1Data?.slice(-daysFilter),
      scatter2: scatter2Data?.slice(-daysFilter),
    };
  }, [activityFilter, data?.data, daysFilter, value]);

  const generatedArrayColors = useMemo(() => {
    return activityFilter === 'all'
      ? generateArray(
          data?.data?.map((item) => item.EXTRA - Number(value ?? 0)) ?? [],
          0,
          theme.palette.success.main,
          theme.palette.error.main
        )?.slice(-daysFilter)
      : extendArray(Number(days?.length), [theme.palette.info.main]).slice(
          -daysFilter
        );
  }, [activityFilter, data?.data, days?.length, daysFilter, value]);

  const handleBarClick = async (event: Readonly<PlotMouseEvent>) => {
    setGraphLoading(true);

    const idx = event.points.find((item) => item.pointIndex)?.pointIndex ?? 0;
    setIdx(idx);
    await push({ hash: 'health-details' }, undefined, {
      scroll: false,
      shallow: true,
    });
    setTimeout(() => {
      setGraphLoading(false);
    }, 200);
  };

  const [domLoaded, setDomLoaded] = useState(false);
  const [runJoyride, setRunJoyride] = useState(false);

  useEffect(() => {
    setRunJoyride(false);
    setDomLoaded(true);
  }, []);

  // match component ids with order and content of steps
  const steps = [
    {
      target: '#hpstep1',
      content: 'Welcome to the first page of your results display. ',
      disableBeacon: true,
      showProgress: true,
    },
    {
      target: '#hpstep2',
      content: 'Freely set the time filters here.',
      disableBeacon: true,
      showProgress: true,
    },
    {
      target: '#hpstep3',
      content: 'Select the type of activity.',
      disableBeacon: true,
      showProgress: true,
    },
    {
      target: '#hpstep4',
      content: 'Slide the bar to set your target goal.',
      disableBeacon: true,
      showProgress: true,
    },
    {
      target: '#hpstep5',
      content:
        'Explore the graph to get fresh insights. Click on a bar to see the details for the day.',
      disableBeacon: true,
      showProgress: true,
    },
  ];

  const handleStartJoyride = () => {
    setRunJoyride(true);
  };

  const handleJoyrideCallback = (data: any) => {
    const { action, status } = data;

    if (status === 'finished' || status === 'skipped') {
      setRunJoyride(false);
    }
  };

  const buttonReset = {
    backgroundColor: 'transparent',
    border: 0,
    borderRadius: 0,
    color: '#555',
    outline: 'none',
    lineHeight: 1,
    padding: 8,
    WebkitAppearance: 'none',
  };

  // return (
  //   <Stack sx={{ minHeight: 450 }} spacing={2}>
  //     <ListItem>
  //       <ListItemText
  //         primaryTypographyProps={{ variant: 'h5', color: 'primary' }}
  //         secondaryTypographyProps={{ variant: 'h6' }}
  //         primary="Health activity patterns"
  //         secondary="Track your daily physical activity levels and progress with our interactive
  //       graph!"
  //       />
  //       <BoopAnimation>
  //         <HelpIconButton>
  //           <Box maxWidth={150} p={2}>
  //             <Typography>
  //               You can visualize the daily data by clicking on one of the columns
  //             </Typography>
  //           </Box>
  //         </HelpIconButton>
  //       </BoopAnimation>
  //     </ListItem>

  return (
    <div>
      <Stack sx={{ minHeight: 450 }} spacing={2}>
        <ListItem>
          <ListItemText
            primaryTypographyProps={{
              variant: 'h5',
              color: 'primary',
              id: 'hpstep1',
            }}
            secondaryTypographyProps={{ variant: 'h6' }}
            primary="Health activity patterns"
            secondary="Track your daily physical activity levels and progress with our interactive
        graph!"
          />
          <BoopAnimation>
            <HelpIconButton onStart={handleStartJoyride}>
              <Box maxWidth={150} p={2}>
                <Typography>
                  You can visualize the daily data by clicking on one of the columns
                </Typography>
              </Box>
            </HelpIconButton>
          </BoopAnimation>
        </ListItem>

        <Box display="flex" flexDirection="row" alignItems="center" columnGap={2}>
          <Select
            size="small"
            onChange={handleSelect}
            value={String(daysFilter)}
            id="hpstep2"
          >
            {daysOptions.map((option) => (
              <MenuItem key={option.label} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          <Select
            size="small"
            onChange={handleActivitySelect}
            value={activityFilter}
            id="hpstep3"
          >
            {appOptions.map((option) => (
              <MenuItem key={option.label} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {data && (
            <Stack
              display="flex"
              alignItems="center"
              width="100%"
              direction="row"
              columnGap={2}
              id="hpstep4"
            >
              <PumpAnimation>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <WhatshotOutlined fontSize="large" color="error" />
                  <Typography color="error" variant="caption">
                    Calories
                  </Typography>
                </Box>
              </PumpAnimation>
              <AirbnbSlider
                disabled={activityFilter !== 'all'}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => value + 2000}
                min={0}
                value={Number(value) ?? 0}
                marks={[
                  { value: 0, label: 2000 },
                  { value: 2500, label: 4500 },
                ]}
                step={50}
                max={2500}
                onChange={handleSlider}
                slots={{ thumb: AirbnbThumbComponent }}
              />
            </Stack>
          )}
        </Box>
        {graphLoading && (
          <Box
            height={450}
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
          >
            <ScaleLoader color={theme.palette.primary.main} loading={graphLoading} />
          </Box>
        )}
        {!graphLoading && (
          <Box minHeight={450}>
            <Plot
              divId="hpstep5"
              style={{ width: '100%' }}
              onClick={handleBarClick}
              data={[
                {
                  type: 'bar',
                  x: days,
                  y: returnBarData.bar1,
                  name: 'Goal',
                  marker: {
                    color: extendArray(Number(days?.length), [
                      activityFilter === 'all'
                        ? theme.palette.primary.main
                        : theme.palette.warning.main,
                    ]).slice(-daysFilter),
                  },
                  opacity: 0.7,
                },
                {
                  type: 'bar',
                  x: days,
                  y: returnBarData.bar2,
                  name: 'Extra/Left',
                  marker: {
                    color: generatedArrayColors,
                  },
                  opacity: 0.7,
                },
                {
                  type: 'scatter',
                  x: days,
                  y: returnScatterData.scatter1,
                  name: 'Goal',
                  marker: {
                    color: theme.palette.info.main,
                  },
                },
                {
                  type: 'scatter',
                  x: days,
                  y: returnScatterData.scatter2,
                  name: 'Done',
                  marker: {
                    color: theme.palette.error.main,
                  },
                },
              ]}
              config={{ displayModeBar: false }}
              layout={{
                autosize: true,
                barmode: 'stack',
                bargap: 0.3,
                margin: { t: 0 },
              }}
            />
          </Box>
        )}
      </Stack>
    </div>
  );
};

export default HealthActivityPlot;
