import React, { useEffect, useState } from 'react';
import { styled } from '@mui/system';
import { Box, TextField, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CalendarToday } from '@mui/icons-material';
import { DatePicker, StaticDatePicker, DateCalendar } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import Wave from 'react-wavify';

type InnerBoxInputProps = {
  color: string;
  height: number;
};

const BatteryComponent = () => {
  const OuterBoxWrapper = styled(Box)`
    width: 100px;
    height: 200px;
    background: var(--black);
    position: relative;
    margin: 0 auto;
    border: 2px solid #9e9e9e;
    border-radius: 18px;
    overflow: hidden;
    transition: background-color 0.5s;
  `;
  const InnerBoxWrapper = styled(Box)<InnerBoxInputProps>`
    width: 100%;
    position: absolute;
    height: ${(props) => props.height}%;
    margin: 0 auto;
    bottom: 0;
    background-color: ${(props) => props.color};
    transition: background-color 0.5s;
  `;

  const [inputValue, setInputValue] = useState('');
  const [boxColor, setBoxColor] = useState('#000000');
  const [chargeHeight, setChargeHeight] = useState(0);
  const [todayDate, setTodayDate] = useState('may');
  const [value, setValue] = useState(null);
  const [data, setData] = useState(null);
  const [displayText, setDisplayText] = useState('');
  const intervalDuration = 500; // 0.5 seconds

  useEffect(() => {
    fetch('api/battery-data')
      .then((response) => response.json())
      .then((jsonData) => {
        setData(jsonData);
        console.log(jsonData);
      });
  }, []);

  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, '0'); // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const batteryAnimate = () => {
    const dailyData = data['data'];
    let currentIndex = 0;

    const interval = setInterval(() => {
      setChargeHeight(data['data'][currentIndex]['penalty_points']);

      var hue = Math.floor(((100 - chargeHeight) * 120) / 100); // go from green to red
      var saturation = Math.abs(chargeHeight - 50) / 50;
      setBoxColor(hslToHex(hue, saturation * 100, 50));
      console.log(chargeHeight);
      currentIndex = (currentIndex + 1) % dailyData.length;
    }, intervalDuration);

    return () => {
      clearInterval(interval);
    };
  };

  const handleInputChange = (event: any) => {
    const value = event.target.value;
    setInputValue(value);

    // Update the box color based on the input value
    const color = `#${value}`;
    setBoxColor(color);
  };

  const handleBatteryClick = (event: any) => {
    batteryAnimate();
    console.log('clicked');
  };

  return (
    <div>
      <TextField label="Color" value={inputValue} onChange={handleInputChange} />
      <Typography variant="h5">{todayDate}</Typography>
      <OuterBoxWrapper onClick={handleBatteryClick}>
        {/* <InnerBoxWrapper color={boxColor} height={chargeHeight} /> */}
        <Wave
          id="wave_container"
          style={{
            height: `${chargeHeight}%`,
            position: 'absolute',
            bottom: '0',
            transition: 'height 0.5s',
          }}
          fill={boxColor}
          paused={false}
          options={{
            height: 2,
            amplitude: 5,
            speed: 0.25,
            points: 4,
          }}
        />
      </OuterBoxWrapper>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          value={value}
          onChange={(newValue) => {
            console.log(newValue);
            setTodayDate(`${newValue}`);
          }}
        />
      </LocalizationProvider>
    </div>
  );
};

export default BatteryComponent;
