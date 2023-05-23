import React from 'react';
import { NextPage } from 'next';
import Grid from '@mui/system/Unstable_Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import PhoneUsageActivityPlot from '../../components/data/PhoneUsageActivityPlot';

const PhoneUsagePage: NextPage = () => {
  return (
    <Grid container>
      <Grid xs={12}>
        <Card>
          <CardContent>
            <PhoneUsageActivityPlot />
          </CardContent>
        </Card>
      </Grid>
      <Grid xs={12}>
        <Card></Card>
      </Grid>
    </Grid>
  );
};

export default PhoneUsagePage;
