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
import theme from 'styles/theme';
import { useSharedIdx } from 'components/data/HealthActivityPlot';
import { useSharedApp } from 'components/data/PhoneUsageDistAndPie';
import { AppTypeCustom } from 'components/data/PhoneUsageActivityPlot';
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
  const [app, setApp] = useSharedApp();
  useEffect(() => {
    setTimeout(() => {
      setPieLoading(false);
    }, 250);
  }, []);
  const [idx] = useSharedIdx();
  const pieByDay = useMemo(() => {
    return pieData[Number(idx)].data.filter((item) => item.name !== 'Total');
  }, [idx, pieData]);

  const handleClick = async (event: Readonly<PlotMouseEvent>) => {
    const point = event.points.find((item) => item.pointNumber) as unknown as any;
    if (point) {
      setApp(point['label']);
    }
  };

  const handleBadgeClick = (label: string) => () => {
    setApp(label as AppTypeCustom);
  };
  const total = pieData[Number(idx)].data.find((item) => item.name === 'Total');
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
        <Box width={500} height={500}>
          <Plot
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
            data={[
              {
                type: 'pie',
                labels: pieByDay?.map((item) => item.name),
                values: pieByDay?.map((item) => item.value),
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
        </Box>
      )}
      <Grid height="200px" xs={6} container rowSpacing={1} columnSpacing={1}>
        {pieByDay.map((item, idx) => (
          <Grid key={item.name}>
            <Chip
              onClick={handleBadgeClick(item.name)}
              key={item.name}
              sx={{
                background: pieColors[idx],
                color: 'secondary.main',
                '&:hover': { background: pieColors[idx], color: 'secondary.main' },
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
