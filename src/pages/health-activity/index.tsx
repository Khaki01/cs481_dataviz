import React from 'react';
import { NextPage } from 'next';
import Grid from '@mui/system/Unstable_Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
<<<<<<< HEAD
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import Select from '@mui/material/Select';
import HealthActivityPlot from '../../components/data/HealthActivityPlot';
const HealthActivityPage: NextPage = () => {
  return (
    <Grid container spacing={3}>
      <Grid xs={12}>
        <Card elevation={0} color="background.paper">
          <CardContent>
            <Typography variant="h5" color="primary">
              Explore
            </Typography>
            <Typography variant="h6">
              Following patterns, towards healthier life!
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid xs={12}>
        <Card>
          <CardContent>
            <Select size="small" variant="outlined"></Select>
          </CardContent>
          <CardMedia>
            <HealthActivityPlot />
          </CardMedia>
        </Card>
      </Grid>
=======
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
>>>>>>> main
    </Grid>
  );
};

export default HealthActivityPage;
