import React, { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import dynamic from 'next/dynamic';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import theme from 'styles/theme';
import { extendArray, generateArray } from '../../utils';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { AirbnbSlider, AirbnbThumbComponent } from '../custom/slider';
import { useGoalContext } from '../context/GoalProvider';
import BoopAnimation from '../animated/BoopAnimation';
import { ListItem, ListItemText } from '@mui/material';
import { PlotMouseEvent } from 'plotly.js';
import { useRouter } from 'next/router';
import { ScaleLoader } from 'react-spinners';
import json from '../../../public/task1_phoneUsageBarChartByApp.json';
import HelpIconButton from '../HelpIconButton';
import Typography from '@mui/material/Typography';
import { useBetween } from 'use-between';
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

  const days = dailyActivityData
    ?.find((item) => item)
    ?.data.map((item) => moment(item.date).format('MMM DD'));

  const handleSelect = (event: SelectChangeEvent) => {
    setDaysFilter(Number(event.target.value));
  };

  const [sliderLoading, setSliderLoading] = useState(true)
  const handleAppFilterSelect = (event: SelectChangeEvent) => {
    setAppFilter(event.target.value as AppType);
  };

  const {
    usage: [value, setValue, remove],
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
    setGraphLoading(false);
    setSliderLoading(false)
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
    await push({ query: { idx } }, undefined, { scroll: false, shallow: true });
    await setGraphLoading(false);
  };

  return (
    <Stack sx={{ minHeight: 450 }} spacing={2}>
      <ListItem>
        <ListItemText
          primaryTypographyProps={{ variant: 'h5', color: 'primary' }}
          secondaryTypographyProps={{ variant: 'h6' }}
          primary="Phone usage patterns"
          secondary="Visualize and analyze your daily phone usage patterns to foster digital well-being!"
        />
        <BoopAnimation>
          <HelpIconButton>
            <Box maxWidth={150} p={2}>
              <Typography>
                You can visualize the daily data by clicking on one of the columns
              </Typography>
            </Box>
          </HelpIconButton>
        </BoopAnimation>
      </ListItem>

      <Box display="flex" flexDirection="row" alignItems="center" columnGap={2}>
        <Select size="small" onChange={handleSelect} value={String(daysFilter)}>
          {daysOptions.map((option) => (
            <MenuItem key={option.label} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        <Select size="small" onChange={handleAppFilterSelect} value={appFilter}>
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
            columnGap={2}
          >
            <AirbnbSlider
              valueLabelDisplay="auto"
              disabled={appFilter !== 'all'}
              min={0}
              value={Number(value)}
              marks={[
                { value: 0, label: 0 },
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
        <Plot
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
      )}
    </Stack>
  );
};

export default PhoneUsageActivityPlot;
