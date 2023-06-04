import React, { useEffect, useMemo, useState } from 'react';
import SmartphoneOutlinedIcon from '@mui/icons-material/SmartphoneOutlined';
import AnimatedBattery from './AnimatedBattery';
import { PhoneUsageBattery } from 'pages/api/battery-phone-usage';
import { groupBy } from 'utils';

interface PhoneBatteryProps {
  loading: boolean;
  date: string;
}
const PhoneBattery = ({ loading, date }: PhoneBatteryProps) => {
  const [phoneData, setPhoneData] = useState<PhoneUsageBattery[]>();

  const batteryPercentage = useMemo(() => {
    if (phoneData) {
      return groupBy(phoneData, (v) => v.datetime)[date].reduce(
        (acc, cur) => (acc > cur.penalty_points ? cur.penalty_points : acc),
        100
      );
    }
    return 100;
  }, [date, phoneData]);

  const fetchData = async () => {
    try {
      const response = await fetch('api/battery-phone-usage');
      const jsonData = (await response.json()) as { data: PhoneUsageBattery[] };
      setPhoneData(jsonData.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AnimatedBattery
      loading={loading}
      Icon={<SmartphoneOutlinedIcon fontSize="large" color="primary" />}
      percentage={Math.round(batteryPercentage)}
    />
  );
};

export default React.memo(PhoneBattery);
