import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import pieJson from '../../../public/task1_phoneUsagePieChartByApp.json';
import { useRouter } from 'next/router';
import { PlotMouseEvent } from 'plotly.js';
import Stack from '@mui/material/Stack';
import { Chip } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import Box from '@mui/material/Box';
import { ScaleLoader } from 'react-spinners';
import theme from '../../styles/theme';
interface PhoneUsagePieChart {
  date: string;
  data: {
    name: string;
    value: number;
  }[];
}

export const pieColors = [
  '#003f5c',
  '#305881',
  '#5c70a5',
  '#8c89c7',
  '#c0a0e5',
  '#f7b8ff',
  '#f79ee2',
  '#f584c1',
  '#ef6b9d',
  '#e45377',
  '#de425b',
];
const PieChart = () => {
  const { query, push } = useRouter();

  const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });
  const pieData = pieJson as PhoneUsagePieChart[];
  const [pieLoading, setPieLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setPieLoading(false);
    }, 250);
  }, []);
  const pieByDay = useMemo(() => {
    return pieData[Number(query?.idx ?? 0)].data.filter(
      (item) => item.name !== 'Total'
    );
  }, [pieData, query?.idx]);

  const handleClick = async (event: Readonly<PlotMouseEvent>) => {
    const point = event.points.find((item) => item.pointNumber) as unknown as any;
    if (point) {
      await push({ query: { ...query, app: point['label'] } }, undefined, {
        scroll: false,
        shallow: true,
      });
    }
  };

  const handleBadgeClick = (label: string) => () => {
    push({ query: { ...query, app: label } }, undefined, {
      scroll: false,
      shallow: true,
    });
  };
  const total = pieData[Number(query?.idx ?? 0)].data.find(
    (item) => item.name === 'Total'
  );
  return (
    <Stack direction="row" display="flex" alignItems="center" id="pp1step5">
      {pieLoading && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width={500}
          height={500}
        >
          <ScaleLoader color={theme.palette.primary.main} loading={pieLoading} />
        </Box>
      )}
      {pieData && !pieLoading && (
        <Plot
          onClick={handleClick}
          style={{ cursor: 'pointer' }}
          data={[
            {
              type: 'pie',
              labels: pieByDay?.map((item) => item.name),
              values: pieByDay?.map((item) => item.value),
              // .sort((a, b) => (a > b ? -1 : 1)),
              hoverinfo: 'label+percent',
              insidetextorientation: 'horizontal',
              marker: {
                colors: pieColors,
              },
            },
          ]}
          config={{ displayModeBar: false }}
          layout={{
            margin: { t: 0, b: 0 },
            showlegend: false,
            width: 500,
            height: 500,
          }}
        />
      )}
      <Grid height="200px" xs={6} container rowSpacing={1} columnSpacing={1}>
        {pieByDay
          // .sort((a, b) => (a.value > b.value ? -1 : 1))
          .map((item, idx) => (
            <Grid key={item.name}>
              <Chip
                onClick={handleBadgeClick(item.name)}
                key={item.name}
                sx={{
                  background: pieColors[idx],
                  color: 'secondary.main',
                  '&:hover': { background: pieColors[idx] },
                }}
                label={`${item.name} - ${(
                  (item.value * 100) /
                  Number(total?.value)
                ).toFixed(2)}%`}
              />
            </Grid>
          ))}
      </Grid>
    </Stack>
  );
};

export default PieChart;
