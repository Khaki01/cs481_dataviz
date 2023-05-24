import React from 'react';
import { NextPage } from 'next';
import Grid from '@mui/system/Unstable_Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import HealthActivityPlot from '../../components/data/HealthActivityPlot';
import HealthActivityDistAndPie from '../../components/data/HealthActivityDistAndPie';
import { useRouter } from 'next/router';
const HealthActivityPage: NextPage = () => {
  const { query } = useRouter();
  return (
    <Grid container spacing={3}>
      <Grid xs={12}>
        <Card>
          <CardContent>
            <HealthActivityPlot />
          </CardContent>
        </Card>
      </Grid>
      {query?.idx && (
        <Grid xs={12}>
          <Card>
            <CardContent>
              <HealthActivityDistAndPie />
            </CardContent>
          </Card>
        </Grid>
      )}

    </Grid>
  );
};

export default HealthActivityPage;
