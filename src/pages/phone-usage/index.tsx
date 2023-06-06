import React from 'react';
import { NextPage } from 'next';
import Grid from '@mui/system/Unstable_Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import PhoneUsageActivityPlot from 'components/data/PhoneUsageActivityPlot';
import PhoneUsageDistAndPie from 'components/data/PhoneUsageDistAndPie';
import { useSharedIdx } from 'components/data/HealthActivityPlot';

const PhoneUsagePage: NextPage = () => {
  const [idx] = useSharedIdx();
  return (
    <Grid container spacing={2}>
      <Grid xs={12}>
        <Card>
          <CardContent>
            <PhoneUsageActivityPlot />
          </CardContent>
        </Card>
      </Grid>
      {typeof idx === 'number' && (
        <Grid xs={12}>
          <Card>
            <CardContent>
              <PhoneUsageDistAndPie />
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};

export default PhoneUsagePage;
