import React from 'react';
import { NextPage } from 'next';
import Grid from '@mui/system/Unstable_Grid';
import Card from '@mui/material/Card';
<<<<<<< HEAD

const PhoneUsagePage: NextPage = () => {
  return (
    <Grid container>
      <Grid>
        <Card></Card>
      </Grid>
=======
import CardContent from '@mui/material/CardContent';
import PhoneUsageActivityPlot from '../../components/data/PhoneUsageActivityPlot';
import PhoneUsageDistAndPie from '../../components/data/PhoneUsageDistAndPie';
import { useRouter } from 'next/router';

const PhoneUsagePage: NextPage = () => {
  const { query } = useRouter();
  return (
    <Grid container spacing={2}>
      <Grid xs={12}>
        <Card>
          <CardContent>
            <PhoneUsageActivityPlot />
          </CardContent>
        </Card>
      </Grid>
      {query?.idx && (
        <Grid xs={12}>
          <Card>
            <CardContent>
              <PhoneUsageDistAndPie />
            </CardContent>
          </Card>
        </Grid>
      )}
>>>>>>> main
    </Grid>
  );
};

export default PhoneUsagePage;
