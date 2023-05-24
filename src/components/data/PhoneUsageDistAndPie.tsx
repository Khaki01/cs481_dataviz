import React, { useMemo, useState } from 'react';
import json from '../../../public/dist_app_usage.json';
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/router';
import PieChart, { pieColors } from 'components/data/PieChart';
import theme from '../../styles/theme';
import { PlotData } from 'plotly.js';
import { AppTypeCustom } from './PhoneUsageActivityPlot';

import dynamic from 'next/dynamic';
import Typography from '@mui/material/Typography';
import moment from 'moment/moment';
import BoopAnimation from '../animated/BoopAnimation';
import HelpIconButton from '../HelpIconButton';
import Box from '@mui/material/Box';
import { ScaleLoader } from 'react-spinners';
interface DistDataType {
  day: string;
  data: {
    timestamp: string;
    Total: number;
    '10000!': number;
    Chrome: number;
    YouTube: number;
    리디북스: number;
    마이리틀셰프: number;
    문피아: number;
    '웹소설 조아라': number;
    카카오톡: number;
    카카오페이지: number;
    트위터: number;
    Others: number;
  }[];
}

const appTypesCustom = [
  '10000!',
  'Chrome',
  'YouTube',
  '리디북스',
  '마이리틀셰프',
  '문피아',
  '웹소설 조아라',
  '카카오톡',
  '카카오페이지',
  '트위터',
];
const PhoneUsageDistAndPie = () => {
  const { query } = useRouter();
  const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });
  const [graphLoading, setGraphLoading] = useState(false);
  const distData = json as DistDataType[];
  const dayData = useMemo<DistDataType>(() => {
    const day = Number(query?.idx ?? 0);
    if (day >= 0 && day <= 6) {
      return distData[day];
    }
    return { day: '', data: [] };
  }, [distData, query?.idx]);

  const activityData = useMemo(() => {
    const activity = query?.app as AppTypeCustom;
    return activity ? dayData.data.map((item) => item[activity] ?? 0) : [];
  }, [dayData.data, query?.app]);

  const distAppData: Partial<PlotData> = useMemo(() => {
    return {
      x: Array.from(Array(24).keys()),
      y: activityData,
      type: 'scatter',
      name: String(query?.app),
      mode: 'lines',
      line: {
        color: pieColors[appTypesCustom.indexOf(String(query?.app))],
        shape: 'spline',
        width: 3,
      },
      fill: 'tozeroy',
      fillcolor: `${pieColors[appTypesCustom.indexOf(String(query?.app))]}80`,
    };
  }, [activityData, query?.app]);

  return (
    <Stack width="100%" spacing={2}>
      {dayData?.data && (
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
            <HelpIconButton>
              <Box maxWidth={150} p={2}>
                <Typography>
                  You can visualize activities by clicking on pie chart
                </Typography>
              </Box>
            </HelpIconButton>
          </BoopAnimation>
        </Box>
      )}
      {graphLoading && (
        <Box
          height={950}
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
          onInitialized={() => setGraphLoading(false)}
          data={[
            {
              x: Array.from(Array(24).keys()),
              y: dayData.data.map((item) => item.Total),
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
            distAppData,
          ]}
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
              range: [1, 23],
            },
            yaxis: {
              showgrid: false,
              title: 'Minutes',
              titlefont: {
                color: theme.palette.text.primary,
              },
            },
          }}
        />
      )}
      <PieChart />
    </Stack>
  );
};

export default PhoneUsageDistAndPie;
