import React, { useEffect, useState } from 'react';
import { styled } from '@mui/system';
import { Box, TextField, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CalendarToday } from '@mui/icons-material';
import { DatePicker, StaticDatePicker, DateCalendar } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import Wave from 'react-wavify';
import { useSpring, animated } from 'react-spring';

type InnerBoxInputProps = {
  color: string;
  height: number;
};

const AnimatedText3 = ({ text }) => {
  const styles = useSpring({
    margin: 'auto',
    overflowY: 'visible',
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 1000 },
  });

  if (text.length > 2) {
    let finalCharge = 100;
    let arr = [];
    let reward = 0;
    for (let i = 0; i < text.length; i++) {
      let elem = text[i];
      reward += elem['reward'];
      arr[elem['name']] = elem['duration'];
    }
    // Create items array
    var items = Object.keys(arr).map(function (key) {
      return [key, arr[key]];
    });

    // Sort the array based on the second element
    items.sort(function (first, second) {
      return second[1] - first[1];
    });
    // let percentage = parseFloat(finalCharge).toFixed(2);
    return (
      <animated.div style={styles}>
        <h1>Total Charge {reward}%</h1>
        <h1>Most Popular Activity {items[0][0]}</h1>
      </animated.div>
    );
  } else {
    let percentage = parseFloat(text[1]).toFixed(2);
    return (
      <animated.div style={styles}>
        <h1>{text[0]}</h1>
        <h1
          style={{
            color: 'green',
            // fontSize: '24px',
            // fontWeight: 'bold',
            // marginBottom: '10px',
          }}
        >
          {percentage >= 0 ? percentage + '%' : ''}
        </h1>
      </animated.div>
    );
  }
};

const AnimatedText = ({ text }) => {
  const styles = useSpring({
    margin: 'auto',
    overflowY: 'visible',
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 1000 },
  });

  if (text.length > 2) {
    let finalCharge = 100;
    let arr = [];
    for (let i = 0; i < text.length; i++) {
      let elem = text[i];
      if (elem['penalty_points'] < finalCharge) finalCharge = elem['penalty_points'];
      arr[elem['name']] = elem['duration_ms'];
    }
    // Create items array
    var items = Object.keys(arr).map(function (key) {
      return [key, arr[key]];
    });

    // Sort the array based on the second element
    items.sort(function (first, second) {
      return second[1] - first[1];
    });
    let percentage = parseFloat(finalCharge).toFixed(2);
    return (
      <animated.div style={styles}>
        <h1>Total Charge {percentage}%</h1>
        <h1>Most Used App {items[0][0]}</h1>
      </animated.div>
    );
  } else {
    let percentage = parseFloat(text[1]).toFixed(2);
    return (
      <animated.div style={styles}>
        <h1>{text[0]}</h1>
        <h1
          style={{
            color: 'red',
            // fontSize: '24px',
            // fontWeight: 'bold',
            // marginBottom: '10px',
          }}
        >
          {percentage >= 0 ? percentage + '%' : ''}
        </h1>
      </animated.div>
    );
  }
};

const AnimatedText2 = ({ text, color }) => {
  const styles = useSpring({
    margin: 'auto',
    display: 'flex',
    // width: '33%',
    flexFlow: 'row wrap',
    justifyContent: 'space-between',
    // overflowY: 'visible',
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 1000 },
  });
  return (
    <animated.div style={styles}>
      {Object.keys(text).map((key) => (
        <div
          key={key}
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            flex: '1 0 21%',
          }}
        >
          <h2
            style={{
              fontSize: '10px',
              fontWeight: 'bold',
              marginBottom: '10px',
            }}
          >
            {key}
          </h2>
          <p
            style={{
              color: 'red',
              fontSize: '10px',
              fontWeight: 'bold',
              marginBottom: '10px',
            }}
          >
            {text[key].toFixed(2)}%
          </p>
        </div>
      ))}
    </animated.div>
  );
};

const BatteryComponent = () => {
  const CalendarOuterWrapper = styled('div')`
    display: grid;
    grid-template-columns: 35% 30% 35%;
    width: 70%;
    margin: auto;
    align-items: top;
    position: relative;
  `;

  const BatteryOuterWrapper = styled('div')`
    display: grid;
    grid-template-columns: 35% 15% 15% 35%;
    width: 70%;
    margin: auto;
    align-items: center;
    position: relative;
  `;

  const OuterBoxWrapper = styled(Box)`
    width: 100px;
    height: 200px;
    background: var(--black);
    position: relative;
    margin: 0 auto;
    border: 2px solid #9e9e9e;
    border-radius: 18px;
    overflow: hidden;
    transition: background-color 0.5s ease;
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
  const [todayDate, setTodayDate] = useState('2019-04-30');
  const [value, setValue] = useState(new Date());
  const [data, setData] = useState(null);
  const [sortedData, setSortedData] = useState({});
  const [physicalSortedData, setPhysicalSortedData] = useState({});
  const [displayText, setDisplayText] = useState('');
  const intervalDuration = 500; // 0.5 seconds
  const [isAnimated, setIsAnimated] = useState(false);
  const [phoneText, setPhoneText] = useState([]);
  const [appList, setAppList] = useState([]);
  let currDate;
  let batteryInterval: any;
  const [restHeight, setRestHeight] = useState(0);

  useEffect(() => {
    // read csv served data
    fetch('api/battery-data')
      .then((response) => response.json())
      .then((jsonData) => {
        setData(jsonData);
        // sort data by the day
        const groupedData = jsonData['data'].reduce((acc: any, obj: any) => {
          const date = new Date(obj.datetime);
          const day = date.toISOString().slice(0, 10); // Extract YYYY-MM-DD

          if (!acc[day]) {
            acc[day] = [];
          }

          acc[day].push(obj);
          return acc;
        }, {});

        setSortedData(groupedData);
      });

    fetch('api/battery_physicaldata')
      .then((response) => response.json())
      .then((jsonData) => {
        setData(jsonData);
        // sort data by the day
        // console.log(jsonData);
        const groupedData = jsonData['data'].reduce((acc: any, obj: any) => {
          // const date = new Date(obj.timestamp);
          // const day = date.toISOString().slice(0, 10); // Extract YYYY-MM-DD

          if (!acc[obj.timestamp]) {
            acc[obj.timestamp] = [];
          }

          acc[obj.timestamp].push(obj);
          return acc;
        }, {});

        setPhysicalSortedData(groupedData);
      });
  }, []);

  // converter from hsl to hex
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

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    const selectedData = new Date(todayDate);

    const selectedDay = selectedData.toISOString().split('T')[0];
    const dailyData = sortedData[selectedDay as keyof typeof sortedData];
    let currentIndex = 0;

    if (isAnimating) {
      interval = setInterval(() => {
        // Animation logic

        if (currentIndex < dailyData.length) {
          setRestHeight(0);
          let heightChange = 0;
          if (currentIndex > 0) {
            heightChange =
              dailyData[currentIndex - 1]['penalty_points'] -
              dailyData[currentIndex]['penalty_points'];
          }
          setChargeHeight(dailyData[currentIndex]['penalty_points']);
          setPhoneText([dailyData[currentIndex]['name'], heightChange]);

          var hue = Math.floor(
            (parseFloat(dailyData[currentIndex]['penalty_points']) * 120) / 100
          ); // go from green to red
          var saturation =
            Math.abs(parseFloat(dailyData[currentIndex]['penalty_points']) - 50) * 2;
          setBoxColor(hslToHex(hue, 100, 50));
          currentIndex = currentIndex + 1;
        } else {
          setRestHeight(dailyData[currentIndex - 1]['penalty_points']);
          setChargeHeight(dailyData[currentIndex - 1]['penalty_points']);
          setPhoneText(dailyData);
          setIsAnimating((prevState) => !prevState);
          let temp = [];
          for (let i = 0; i < dailyData.length; i++) {
            let elem = dailyData[i];
            temp[elem['name']] = elem['penalty_points'];
          }
          console.log(temp);
          setAppList(temp);
        }
      }, 1000);
    } else {
      // setPhoneText([]);
      // setChargeHeight();
      // setRestHeight(0);
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isAnimating]);

  const [physicalChargeHeight, setPhysicalChargeHeight] = useState(0);
  const [physicalBoxColor, setPhysicalBoxColor] = useState('#000000');
  const [isPhysicalAnimated, setIsPhysicalAnimated] = useState(false);
  const [physicalText, setPhysicalText] = useState([]);
  const [physicalRestHeight, setPhysicalRestHeight] = useState(0);
  const [activityList, setActivityList] = useState([]);

  const [isPhysicalAnimating, setIsPhysicalAnimating] = useState(false);

  useEffect(() => {
    let interval1: NodeJS.Timeout | null = null;
    const selectedData = new Date(todayDate);

    const selectedDay = selectedData.toISOString().split('T')[0];
    const dailyData =
      physicalSortedData[selectedDay as keyof typeof physicalSortedData];
    let currentIndex = 0;
    let reward = 0;

    if (isPhysicalAnimating) {
      interval1 = setInterval(() => {
        // Animation logic

        if (currentIndex < dailyData.length) {
          setPhysicalRestHeight(0);
          let heightChange = 0;
          if (currentIndex > 0) {
            heightChange = dailyData[currentIndex]['reward'];
          }
          reward += dailyData[currentIndex]['reward'];
          setPhysicalChargeHeight(reward);
          setPhysicalText([dailyData[currentIndex]['type'], heightChange]);

          var hue = Math.floor((parseFloat(reward) * 120) / 100); // go from green to red
          var saturation = Math.abs(parseFloat(reward) - 50) * 2;
          setPhysicalBoxColor(hslToHex(hue, 100, 50));
          currentIndex = currentIndex + 1;
        } else {
          setPhysicalRestHeight(reward);
          setPhysicalChargeHeight(reward);
          setPhysicalText(dailyData);
          setIsPhysicalAnimating((prevState) => !prevState);

          let temp = [];
          for (let i = 0; i < dailyData.length; i++) {
            let elem = dailyData[i];
            temp[elem['type']] = elem['reward'];
          }
          console.log(temp);
          setActivityList(temp);
        }
      }, 1000);
    } else {
      // setPhoneText([]);
      // setChargeHeight();
      // setRestHeight(0);
      clearInterval(interval1);
    }

    return () => {
      clearInterval(interval1);
    };
  }, [isPhysicalAnimating]);

  const handleBatteryClick = (event: any) => {
    setIsAnimating((prevState) => !prevState);
    setIsPhysicalAnimating((prevState) => !prevState);
  };

  return (
    <div>
      <Typography variant="h5">{todayDate}</Typography>
      <BatteryOuterWrapper>
        <AnimatedText text={phoneText} />
        <OuterBoxWrapper onClick={handleBatteryClick}>
          <Wave
            id="wave_container"
            style={{
              height: `${chargeHeight}%`,
              position: 'absolute',
              bottom: '0',
              transition:
                'height 0.5s ease-in-out, background-color 0.5s ease-in-out',
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
        <OuterBoxWrapper onClick={handleBatteryClick}>
          <Wave
            id="wave_container1"
            style={{
              height: `${physicalChargeHeight}%`,
              position: 'absolute',
              bottom: '0',
              transition:
                'height 0.5s ease-in-out, background-color 0.5s ease-in-out',
            }}
            fill={physicalBoxColor}
            paused={false}
            options={{
              height: 2,
              amplitude: 5,
              speed: 0.25,
              points: 4,
            }}
          />
        </OuterBoxWrapper>
        <AnimatedText3 text={physicalText} />
      </BatteryOuterWrapper>
      <CalendarOuterWrapper>
        <AnimatedText2 text={appList} color="red" />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            defaultValue={dayjs('2019-04-30')}
            // value={null}
            onChange={(newValue) => {
              var myDate = new Date(`${newValue}`).toLocaleString();
              myDate = myDate.split(',')[0];
              setIsAnimating(false);
              setIsPhysicalAnimating(false);
              setChargeHeight(0);
              setPhoneText([]);
              setTodayDate(myDate);
              setValue(new Date(`${newValue}`));
            }}
          />
        </LocalizationProvider>
        <AnimatedText2 text={activityList} color="green" />
      </CalendarOuterWrapper>
    </div>
  );
};

export default BatteryComponent;
