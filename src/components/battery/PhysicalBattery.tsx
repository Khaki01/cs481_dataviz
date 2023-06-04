import React, { useEffect, useMemo, useState } from 'react';
import DirectionsRunOutlinedIcon from '@mui/icons-material/DirectionsRunOutlined';
import AnimatedBattery from './AnimatedBattery';
import { groupBy } from 'utils';
import { PhysicalActivityBattery } from 'pages/api/battery-physical-activity';
import { Dayjs } from 'dayjs';

interface PhysicalBatteryProps {
  loading: boolean;
  date: string;
}
const PhysicalBattery = ({ loading, date }: PhysicalBatteryProps) => {
  const [physicalData, setPhysicalData] = useState<PhysicalActivityBattery[]>();
  const batteryPercentage = useMemo(() => {
    if (physicalData) {
      return groupBy(physicalData, (v) => v.timestamp)[date].reduce(
        (acc, cur) => acc + cur.reward,
        0
      );
    }
    return 0;
  }, [date, physicalData]);
  const fetchData = async () => {
    try {
      const response = await fetch('api/battery-physical-activity');
      const jsonData = (await response.json()) as {
        data: PhysicalActivityBattery[];
      };
      await setPhysicalData(jsonData.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AnimatedBattery
      loading={loading || !physicalData}
      Icon={<DirectionsRunOutlinedIcon fontSize="large" color="primary" />}
      percentage={Math.round(batteryPercentage)}
    />
  );
};

export default React.memo(PhysicalBattery);
