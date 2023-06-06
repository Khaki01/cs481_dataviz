import React from 'react';
import { NextPage } from 'next';
import Grid from '@mui/system/Unstable_Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import HealthActivityPlot, {
  useSharedIdx,
} from 'components/data/HealthActivityPlot';
import HealthActivityDistAndPie from 'components/data/HealthActivityDistAndPie';
const HealthActivityPage: NextPage = () => {
  const [idx] = useSharedIdx();
  return (
    <Grid container spacing={3}>
      <Grid xs={12}>
        <Card>
          <CardContent>
            <HealthActivityPlot />
          </CardContent>
        </Card>
      </Grid>
      {typeof idx === 'number' && (
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
