import React, { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import dynamic from 'next/dynamic';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import theme from 'styles/theme';
import { extendArray, generateArray } from 'utils';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { AirbnbSlider, AirbnbThumbComponent } from 'components/custom/slider';
import { useGoalContext } from 'components/context/GoalProvider';
import BoopAnimation from 'components/animated/BoopAnimation';
import { ListItem, ListItemText } from '@mui/material';
import { PlotMouseEvent } from 'plotly.js';
import { useRouter } from 'next/router';
import { ScaleLoader } from 'react-spinners';
import json from '../../../public/task1_phoneUsageBarChartByApp.json';
import HelpIconButton from 'components/HelpIconButton';
import Typography from '@mui/material/Typography';
import { useBetween } from 'use-between';
import HourglassBottomRoundedIcon from '@mui/icons-material/HourglassBottomRounded';
import PumpAnimation from 'components/animated/PumpAnimation';
import { useSharedIdx } from 'components/data/HealthActivityPlot';
import Joyride from 'react-joyride';

export type AppType =
  | 'all'
  | '10000!'
  | 'Chrome'
  | 'YouTube'
  | '리디북스'
  | '마이리틀셰프'
  | '문피아'
  | '웹소설 조아라'
  | '카카오톡'
  | '카카오페이지'
  | '트위터'
  | 'Others';

export type AppTypeCustom =
  | '10000!'
  | 'Chrome'
  | 'YouTube'
  | '리디북스'
  | '마이리틀셰프'
  | '문피아'
  | '웹소설 조아라'
  | '카카오톡'
  | '카카오페이지'
  | '트위터'
  | 'Others';
interface Option<T extends string> {
  label: string;
  value: T;
}

interface PhoneUsageDataByActivity {
  name: AppType | 'Total' | 'Goal' | 'Extra';
  data: {
    date: string;
    value: number;
  }[];
}

const useLoading = () => {
  return useState(true);
};

export const useSharedLoading = () => useBetween(useLoading);
const PhoneUsageActivityPlot = () => {
  const { push } = useRouter();
  const daysOptions: Option<string>[] = [
    { label: 'Week', value: '7' },
    { label: '5 days', value: '5' },
    { label: '3 days', value: '3' },
  ];
  const appOptions: Option<AppType>[] = [
    { label: 'All apps', value: 'all' },
    { label: '10000!', value: '10000!' },
    { label: 'Chrome', value: 'Chrome' },
    { label: 'YouTube', value: 'YouTube' },
    { label: '리디북스', value: '리디북스' },
    { label: '마이리틀셰프', value: '마이리틀셰프' },
    { label: '문피아', value: '문피아' },
    { label: '웹소설 조아라', value: '웹소설 조아라' },
    { label: '카카오톡', value: '카카오톡' },
    { label: '카카오페이지', value: '카카오페이지' },
    { label: '트위터', value: '트위터' },
    { label: 'Others', value: 'Others' },
  ];
  const dailyActivityData = json as PhoneUsageDataByActivity[];
  const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });
  const [graphLoading, setGraphLoading] = useSharedLoading();
  const [daysFilter, setDaysFilter] = useState<number>(7);
  const [appFilter, setAppFilter] = useState<AppType>('all');
  const [idx, setSharedIdx] = useSharedIdx();
  const days = dailyActivityData
    ?.find((item) => item)
    ?.data.map((item) => moment(item.date).format('MMM DD'));

  const handleSelect = (event: SelectChangeEvent) => {
    setDaysFilter(Number(event.target.value));
  };

  const [sliderLoading, setSliderLoading] = useState(true);
  const handleAppFilterSelect = (event: SelectChangeEvent) => {
    setAppFilter(event.target.value as AppType);
  };

  const {
    usage: [value, setValue],
  } = useGoalContext();
  const handleSlider = (event: Event, newValue: number | number[]) => {
    setGraphLoading(true);
    setValue(String(newValue));
    setTimeout(() => {
      setGraphLoading(false);
    }, 250);
  };

  const returnBarData = useMemo(() => {
    const total = dailyActivityData.find((item) => item.name === 'Total');
    const bar1Data =
      dailyActivityData
        .find((item) => item.name === 'Goal')
        ?.data.map((item, idx) =>
          appFilter === 'all'
            ? item.value + Number(value ?? 0)
            : Number(
                dailyActivityData.find((item) => item.name === appFilter)?.data[idx]
                  .value
              )
        ) ?? [];

    const bar2Data =
      dailyActivityData
        .find((item) => item.name === 'Extra')
        ?.data.map((item, idx) =>
          appFilter === 'all'
            ? item.value - Number(value ?? 0)
            : Number(total?.data[idx]?.value) -
              Number(
                dailyActivityData.find((item) => item.name === appFilter)?.data[idx]
                  .value
              )
        ) ?? [];
    return {
      bar1: bar1Data?.slice(-daysFilter),
      bar2: bar2Data?.slice(-daysFilter),
    };
  }, [appFilter, dailyActivityData, daysFilter, value]);

  useEffect(() => {
    setTimeout(() => {
      setGraphLoading(false);
    }, 500);
    setSliderLoading(false);
  }, [setGraphLoading]);
  const returnScatterData = useMemo(() => {
    const scatter1Data = dailyActivityData
      .find((item) => item.name === 'Goal')
      ?.data.map((item) => item.value + Number(value ?? 0));
    const scatter2Data = dailyActivityData
      .find((item) => item.name === 'Total')
      ?.data.map((item) => item.value);
    return {
      scatter1: appFilter === 'all' ? scatter1Data?.slice(-daysFilter) : [],
      scatter2: scatter2Data?.slice(-daysFilter),
    };
  }, [dailyActivityData, daysFilter, value, appFilter]);

  const generatedArrayColors = useMemo(() => {
    return generateArray(
      dailyActivityData
        .find((item) => item.name === 'Extra')
        ?.data.map((item) => item.value - Number(value ?? 0)) ?? [],
      0,
      theme.palette.success.main,
      theme.palette.error.main
    )?.slice(-daysFilter);
  }, [dailyActivityData, daysFilter, value]);

  const handleBarClick = async (event: Readonly<PlotMouseEvent>) => {
    setGraphLoading(true);
    const idx = event.points.find((item) => item.pointIndex)?.pointIndex ?? 0;
    setSharedIdx(idx);
    await push({ hash: 'phone-usage' }, undefined, {
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
      target: '#ppstep1',
      content: <Typography>Welcome to the phone usage page of yours.</Typography>,
      disableBeacon: true,
      showProgress: true,
      scrollOffset: 400,
    },
    {
      target: '#ppstep2',
      content: <Typography>Freely set the time filters here.</Typography>,
      disableBeacon: true,
      showProgress: true,
      scrollOffset: 400,
    },
    {
      target: '#ppstep3',
      content: <Typography>Filter by the apps you are interested.</Typography>,
      disableBeacon: true,
      showProgress: true,
      scrollOffset: 400,
    },
    {
      target: '#ppstep4',
      content: (
        <Typography>Slide the bar to the the phone usage goals in hours.</Typography>
      ),
      disableBeacon: true,
      showProgress: true,
      scrollOffset: 400,
    },
    {
      target: '#ppstep5',
      content: (
        <Typography>
          Explore the graph to get fresh insights. Click on a bar to see the details
          for the day.
        </Typography>
      ),
      disableBeacon: true,
      showProgress: true,
      scrollOffset: 400,
    },
  ];

  const handleStartJoyride = () => {
    setRunJoyride(true);
  };

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;

    if (status === 'finished' || status === 'skipped') {
      setRunJoyride(false);
    }
  };
  return (
    <div>
      <Stack sx={{ minHeight: 450 }} spacing={2}>
        <ListItem>
          <ListItemText
            primaryTypographyProps={{ variant: 'h5', color: 'primary' }}
            secondaryTypographyProps={{ variant: 'h6' }}
            primary="Phone usage patterns"
            secondary="Visualize and analyze your daily phone usage patterns to foster digital well-being!"
            id="ppstep1"
          />
          <BoopAnimation>
            <HelpIconButton onStart={handleStartJoyride} />
          </BoopAnimation>
        </ListItem>

        <Box display="flex" flexDirection="row" alignItems="center" columnGap={2}>
          <Select
            size="small"
            onChange={handleSelect}
            value={String(daysFilter)}
            id="ppstep2"
          >
            {daysOptions.map((option) => (
              <MenuItem key={option.label} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          <Select
            size="small"
            onChange={handleAppFilterSelect}
            value={appFilter}
            id="ppstep3"
          >
            {appOptions.map((option) => (
              <MenuItem key={option.label} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {!sliderLoading && (
            <Stack
              display="flex"
              alignItems="center"
              width="100%"
              direction="row"
              columnGap={3}
              id="ppstep4"
            >
              <PumpAnimation>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <HourglassBottomRoundedIcon fontSize="large" color="info" />
                  <Typography color="info.main" variant="caption">
                    Hours
                  </Typography>
                </Box>
              </PumpAnimation>

              <AirbnbSlider
                valueLabelDisplay="auto"
                disabled={appFilter !== 'all'}
                min={2}
                value={Number(value)}
                marks={[
                  { value: 2, label: 2 },
                  { value: 12, label: 12 },
                ]}
                step={1}
                max={12}
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
              divId="ppstep5"
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
                      theme.palette.primary.main,
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
      <>
        {domLoaded && (
          <div>
            <Joyride
              steps={steps}
              continuous
              run={runJoyride}
              callback={handleJoyrideCallback}
              styles={{
                options: {
                  primaryColor: theme.palette.primary.main,
                  textColor: theme.palette.text.secondary,
                  width: '100%',
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

export default PhoneUsageActivityPlot;
