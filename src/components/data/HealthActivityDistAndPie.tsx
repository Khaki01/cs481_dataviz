import React, { useEffect, useMemo, useState } from 'react';
import Stack from '@mui/material/Stack';
import theme from '../../styles/theme';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import MultiValuedProgressBar, {
  MultiValuedProgressBarProps,
  progressBarColors,
  useSharedActivity,
} from './MultiValuedProgressBar';
import json from '../../../public/nested_json_readable.json';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import { PlotData } from 'plotly.js';
import { useGoalContext } from '../context/GoalProvider';
import Box from '@mui/material/Box';
import { ScaleLoader } from 'react-spinners';
import HelpIconButton from 'components/HelpIconButton';
import BoopAnimation from 'components/animated/BoopAnimation';
import Joyride from 'react-joyride';

import { useSharedIdx } from 'components/data/HealthActivityPlot';

interface DailyActivity {
  day: string;
  data: {
    timestamp: string;
    ON_FOOT: number | null;
    STILL: number | null;
    TILTING: number | null;
    OTHERS: number | null;
    TOTAL: number | null;
  }[];
}
export type ActivityProp = 'ON_FOOT' | 'STILL' | 'TILTING' | 'OTHERS' | 'TOTAL';
export type ActivityType = 'running' | 'cycling' | 'all' | 'others' | 'workout';
export const activityMap: { [key in ActivityType]: ActivityProp } = {
  running: 'ON_FOOT',
  cycling: 'TILTING',
  all: 'TOTAL',
  others: 'OTHERS',
  workout: 'STILL',
};
const HealthActivityDistAndPie = () => {
  const { query } = useRouter();
  const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });
  const dailyActivityData = json as DailyActivity[];
  const [activity] = useSharedActivity();
  const [idx] = useSharedIdx();
  const dayData = useMemo<DailyActivity>(() => {
    const day = Number(idx);
    if (day >= 0 && day <= 6) {
      return dailyActivityData[day];
    }
    return { day: '', data: [] };
  }, [dailyActivityData, idx]);

  const [graphLoading, setGraphLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setGraphLoading(false);
    }, 250);
  }, []);
  const activityData = useMemo(() => {
    return activity
      ? dayData.data.map((item) => item[activityMap[activity]] ?? 0)
      : [];
  }, [activity, dayData.data]);

  const {
    activity: [value],
  } = useGoalContext();
  const progressBarValues = useMemo<Partial<MultiValuedProgressBarProps>>(() => {
    return {
      values: [
        {
          value:
            (dayData.data.reduce((acc, cur) => acc + (cur?.ON_FOOT ?? 0), 0) * 100) /
            Number(value),
          name: 'running',
        },
        {
          value:
            (dayData.data.reduce((acc, cur) => acc + (cur?.OTHERS ?? 0), 0) * 100) /
            Number(value),
          name: 'others',
        },
        {
          value:
            (dayData.data.reduce((acc, cur) => acc + (cur?.STILL ?? 0), 0) * 100) /
            Number(value),
          name: 'workout',
        },
        {
          value:
            (dayData.data.reduce((acc, cur) => acc + (cur?.TILTING ?? 0), 0) * 100) /
            Number(value),
          name: 'cycling',
        },
      ],
    };
  }, [dayData.data, value]);

  const idxColor = useMemo(() => {
    return (
      progressBarValues?.values?.map((item) => item.name).indexOf(activity) ?? 0
    );
  }, [activity, progressBarValues?.values]);

  const distData: Partial<PlotData> = {
    x: Array.from(Array(24).keys()),
    y: activityData,
    type: 'scatter',
    name: activity,
    mode: 'lines',
    line: { color: theme.palette.primary.main, shape: 'spline', width: 3 },
    fill: 'tozeroy',
    fillcolor: `${progressBarColors[idxColor]}`,
  };

  const [domLoaded, setDomLoaded] = useState(false);
  const [runJoyride1, setRunJoyride1] = useState(false);

  useEffect(() => {
    setRunJoyride1(false);
    setDomLoaded(true);
  }, []);

  const steps = [
    {
      target: '#hp2step5',
      content: (
        <Typography>
          {' '}
          Check what each activity accounts for throughout the day. Click on one of
          them to see its distribution throgh the day.
        </Typography>
      ),
      disableBeacon: true,
      showProgress: true,
    },
    {
      target: '#hp2step6',
      content: (
        <Typography>Explore the distribution of activity by each hour.</Typography>
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
      <Stack width="100%" spacing={2}>
        {dayData && (
          <>
            <Box
              alignItems="center"
              width="100%"
              display="flex"
              justifyContent="space-between"
            >
              <Typography variant="h6">
                {moment(dayData?.day).format('MMM DD')}
              </Typography>
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
            </Box>

            {graphLoading && (
              <Box
                height={450}
                display="flex"
                justifyContent="center"
                alignItems="center"
                width="100%"
              >
                <ScaleLoader color={theme.palette.primary.main} loading={true} />
              </Box>
            )}
            {!graphLoading && (
              <Box height={450} width="100%">
                <Plot
                  divId="hp2step6"
                  data={[
                    {
                      x: Array.from(Array(24).keys()),
                      y: dayData.data.map((item) => item.TOTAL),
                      type: 'scatter',
                      name: 'total',
                      mode: 'lines',
                      line: {
                        color: theme.palette.text.primary,
                        shape: 'spline',
                        width: 3,
                      },
                      fill: 'tozeroy',
                      fillcolor: `${theme.palette.text.primary}80`,
                    },
                    distData,
                  ]}
                  style={{ minHeight: 450 }}
                  config={{ displayModeBar: false }}
                  layout={{
                    autosize: true,
                    margin: { t: 0 },
                    xaxis: {
                      showgrid: false,
                      title: 'Hours',
                      titlefont: {
                        color: theme.palette.text.primary,
                      },
                      range: [1, 24],
                    },
                    yaxis: {
                      showgrid: false,
                      title: 'Calories',
                      titlefont: {
                        color: theme.palette.text.primary,
                      },
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
        {progressBarValues.values && (
          <MultiValuedProgressBar
            setGraphLoading={setGraphLoading}
            values={progressBarValues.values}
          />
        )}
        <div id="health-details" />
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

export default React.memo(HealthActivityDistAndPie);
