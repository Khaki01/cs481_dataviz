import React from 'react';
import { NextPage } from 'next';

import BatteryComponent from 'components/battery/BatteryComponent';
import CalendarComponent from 'components/battery/CalendarComponent';

const BatteryExplorationPage: NextPage = () => {
  return (
    <div>
      <h1>My Calendar App</h1>
      <BatteryComponent />
      {/* <CalendarComponent /> */}
    </div>
  );

};

export default BatteryExplorationPage;
