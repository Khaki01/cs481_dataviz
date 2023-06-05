import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Wave from 'react-wavify';
import { percentageToColor } from 'utils';
import { useSharedAnimatePhoneData } from 'components/battery/PhoneBattery';
import { useSharedAnimatePhysicalData } from 'components/battery/PhysicalBattery';

export type BatteryType = 'physical' | 'phone';
const MemoizedWave = ({
  percentage,
  inverse = false,
  type = 'physical',
}: {
  percentage: number;
  inverse?: boolean;
  type?: BatteryType;
}) => {
  const [waveHeight, setWaveHeight] = useState(0);

  const [, setAnimatePhoneData] = useSharedAnimatePhoneData();
  const [, setAnimatePhysicalData] = useSharedAnimatePhysicalData();
  const coefficient = 1.2;
  const increment = useCallback(() => {
    setWaveHeight((prev) => prev + 2);
  }, []);
  let timer: NodeJS.Timer;
  useEffect(() => {
    clearInterval(timer);
    timer = setInterval(() => {
      if (waveHeight === percentage * 2) {
        clearInterval(timer);
        if (type === 'physical') setAnimatePhysicalData(true);
        else setAnimatePhoneData(true);
        return;
      }
      increment();
    }, 50);
    return () => clearInterval(timer);
  }, [waveHeight]);

  const memoizedWave = useMemo(() => {
    return waveHeight * coefficient;
  }, [waveHeight]);

  const memoizedColor = useMemo(() => {
    // adjust to percentage of battery
    if (inverse) return percentageToColor(100 - waveHeight / 200);
    return percentageToColor(waveHeight / 200);
  }, [inverse, waveHeight]);

  return (
    <Wave
      fill={memoizedColor}
      style={{ height: memoizedWave }}
      options={{
        amplitude: 10,
        speed: 0.25,
        points: 3,
      }}
    />
  );
};

export default MemoizedWave;
