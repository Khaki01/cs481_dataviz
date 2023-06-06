import React, { Dispatch, MouseEventHandler, SetStateAction, useState } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Box from '@mui/material/Box';
import Grid from '@mui/system/Unstable_Grid';
import { ActivityType } from './HealthActivityDistAndPie';
import { useBetween } from 'use-between';
import Chip from '@mui/material/Chip';
import DirectionsBikeRoundedIcon from '@mui/icons-material/DirectionsBikeRounded';
import DirectionsRunRoundedIcon from '@mui/icons-material/DirectionsRunRounded';
import FitnessCenterRoundedIcon from '@mui/icons-material/FitnessCenterRounded';
import AccessibilityNewRoundedIcon from '@mui/icons-material/AccessibilityNewRounded';
import Typography from '@mui/material/Typography';
import theme from 'styles/theme';
export interface MultiValuedProgressBarProps {
  setGraphLoading: Dispatch<SetStateAction<boolean>>;
  values: {
    value: number;
    name: ActivityType;
  }[];
}

export const progressBarColors: {
  color: string;
  hoverColor: string;
  icon: React.ReactElement;
}[] = [
  { color: '#F16A70', hoverColor: '#EE444D', icon: <DirectionsRunRoundedIcon /> },
  { color: '#B6DA81', hoverColor: '#92C841', icon: <AccessibilityNewRoundedIcon /> },
  { color: '#F9F976', hoverColor: '#F7F73B', icon: <FitnessCenterRoundedIcon /> },
  { color: '#70E5FF', hoverColor: '#1FD6FF', icon: <DirectionsBikeRoundedIcon /> },
];

const useActivity = () => {
  return useState<ActivityType>('running');
};

export const useSharedActivity = () => useBetween(useActivity);
const MultiValuedProgressBar = ({
  values,
  setGraphLoading,
}: MultiValuedProgressBarProps) => {
  const [, setActivity] = useSharedActivity();
  const handleClick: (label: ActivityType) => MouseEventHandler<HTMLInputElement> =
    (label) => async (event) => {
      setGraphLoading(true);
      setActivity(label);
      setTimeout(() => {
        setGraphLoading(false);
      }, 250);
    };

  return (
    <Box
      display="flex"
      flexDirection="column"
      rowGap={2}
      maxWidth="50%"
      id="hp2step5"
    >
      <ProgressBar
        style={{
          backgroundColor: `${theme.palette.text.primary}80`,
          height: 24,
          border: `2px solid ${theme.palette.text.primary}`,
        }}
      >
        {values.map((item, idx) => (
          <ProgressBar
            style={{ cursor: 'pointer', background: progressBarColors[idx].color }}
            striped
            onClick={handleClick(item.name)}
            key={item.value}
            now={Math.round(item.value) ?? 1}
          >
            here
          </ProgressBar>
        ))}
      </ProgressBar>
      <Grid container spacing={1}>
        {values.map((item, idx) => (
          <Grid key={item.name}>
            <Chip
              icon={progressBarColors[idx].icon}
              sx={{
                backgroundColor: progressBarColors[idx].color,
                '&:hover': {
                  backgroundColor: progressBarColors[idx].hoverColor,
                  color: 'text.primary',
                },
              }}
              label={
                <Typography color="inherit">
                  {item.name} {item.value.toFixed(2)}%
                </Typography>
              }
              onClick={handleClick(item.name)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MultiValuedProgressBar;
