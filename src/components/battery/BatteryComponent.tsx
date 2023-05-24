import React, { useEffect, useState } from 'react';
import { styled } from '@mui/system';
import { Box, TextField, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import Badge from '@mui/material/Badge';

import Wave from 'react-wavify';
import { useSpring, animated } from 'react-spring';
import PickersDay, { PickersDayProps, pickersDayClasses } from '@mui/lab/PickersDay';

type InnerBoxInputProps = {
  color: string;
  height: number;
};

function getRandomNumber(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

function fakeFetch(date: Dayjs, { signal }: { signal: AbortSignal }) {
  return new Promise<{ daysToHighlight: number[] }>((resolve, reject) => {
    const timeout = setTimeout(() => {
      const daysInMonth = date.daysInMonth();
      const daysToHighlight = [1, 2, 3].map(() => getRandomNumber(1, daysInMonth));

      resolve({ daysToHighlight });
    }, 500);

    signal.onabort = () => {
      clearTimeout(timeout);
      reject(new DOMException('aborted', 'AbortError'));
    };
  });
}

const initialValue = dayjs('2019-04-30');

const AnimatedText3 = ({ text }: { text: Record<string, any>}) => {
  const styles = useSpring({
    margin: 'auto',
    overflowY: 'visible',
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 1000 },
  });

  if (text.length > 2) {
    let finalCharge = 100;
    let arr = [] as Record<string, any>;
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
    let percentage = Number(parseFloat(text[1]).toFixed(2));
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

const AnimatedText = ({ text }: { text: (Record<any, any>)[]}) => {
  const styles = useSpring({
    margin: 'auto',
    overflowY: 'visible',
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 1000 },
  });

  if (text.length > 2) {
    let finalCharge = 100;
    let arr = [] as any;
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
    let percentage = parseFloat(String(finalCharge)).toFixed(2);
    return (
      <animated.div style={styles}>
        <h1>Total Charge {percentage}%</h1>
        <h1>Most Used App {items[0][0]}</h1>
      </animated.div>
    );
  } else {
    let percentage = parseFloat(String(text[1])).toFixed(2);
    return (
      <animated.div style={styles}>
        <h1>{text[0] as React.ReactNode}</h1>
        <h1
          style={{
            color: 'red',
            // fontSize: '24px',
            // fontWeight: 'bold',
            // marginBottom: '10px',
          }}
        >
          {Number(percentage) >= 0 ? percentage + '%' : ''}
        </h1>
      </animated.div>
    );
  }
};

const AnimatedText2 = ({ text, color }: { text: Record<string, any>; color: string}) => {
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

interface JsonType {
  datetime: string;
  name: string;
  category: string;
  duration_ms: number;
}
const BatteryComponent = () => {
  const CalendarOuterWrapper = styled('div')`
    display: grid;
    grid-template-columns: 35% 30% 35%;
    width: 70%;
    margin: auto;
    align-items: flex-start;
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
  const [data, setData] = useState<JsonType[] | null>(null);
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

        if (currentIndex < (dailyData as any[])?.length) {
          setRestHeight(0);
          let heightChange = 0;
          if (currentIndex > 0) {
            heightChange =
              dailyData[currentIndex - 1]['penalty_points'] -
              dailyData[currentIndex]['penalty_points'];
          }
          setChargeHeight(dailyData[currentIndex]['penalty_points']);
          setPhoneText([dailyData[currentIndex]['name'], heightChange as never]);

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
          let temp = [] as any[];
          for (let i = 0; i < (dailyData as never[])?.length; i++) {
            let elem = dailyData[i];
            temp[elem['name']] = elem['penalty_points'];
          }
          setAppList(temp as never);
        }
      }, 1000);
    } else {
      // setPhoneText([]);
      // setChargeHeight();
      // setRestHeight(0);

    }

    return () => {
      clearInterval(interval ?? 0);
    };
  }, [isAnimating]);

  const [physicalChargeHeight, setPhysicalChargeHeight] = useState(0);
  const [physicalBoxColor, setPhysicalBoxColor] = useState('#000000');
  const [isPhysicalAnimated, setIsPhysicalAnimated] = useState(false);
  const [physicalText, setPhysicalText] = useState([]);
  const [physicalRestHeight, setPhysicalRestHeight] = useState(0);
  const [activityList, setActivityList] = useState([]);
  const [highlightedDays, setHighlightedDays] = React.useState([1, 2, 15]);

  const [isPhysicalAnimating, setIsPhysicalAnimating] = useState(false);
  const [highlightedDates, setHighlightedDates] = useState([
    new Date('2019-05-23'),
    new Date('2019-05-24'),
  ]);
  const requestAbortController = React.useRef<AbortController | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchHighlightedDays = (date: Dayjs) => {
    const controller = new AbortController();
    fakeFetch(date, {
      signal: controller.signal,
    })
      .then(({ daysToHighlight }) => {
        setHighlightedDays(daysToHighlight);
        setIsLoading(false);
      })
      .catch((error) => {
        // ignore the error if it's caused by `controller.abort`
        if (error.name !== 'AbortError') {
          throw error;
        }
      });

    requestAbortController.current = controller;
  };

  useEffect(() => {
    fetchHighlightedDays(initialValue);
    // abort request on unmount
    return () => requestAbortController.current?.abort();
  }, []);

  const handleMonthChange = (date: Dayjs) => {
    if (requestAbortController.current) {
      // make sure that you are aborting useless requests
      // because it is possible to switch between months pretty quickly
      requestAbortController.current.abort();
    }

    setIsLoading(true);
    setHighlightedDays([]);
    fetchHighlightedDays(date);
  };

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

        if (currentIndex < (dailyData as never[]).length) {
          setPhysicalRestHeight(0);
          let heightChange = 0;
          if (currentIndex > 0) {
            heightChange = dailyData[currentIndex]['reward'];
          }
          reward += dailyData[currentIndex]['reward'];
          setPhysicalChargeHeight(reward);
          setPhysicalText([dailyData[currentIndex]['type'], heightChange as never]);

          var hue = Math.floor((parseFloat(String(reward)) * 120) / 100); // go from green to red
          var saturation = Math.abs(parseFloat(String(reward)) - 50) * 2;
          setPhysicalBoxColor(hslToHex(hue, 100, 50));
          currentIndex = currentIndex + 1;
        } else {
          setPhysicalRestHeight(reward);
          setPhysicalChargeHeight(reward);
          setPhysicalText(dailyData);
          setIsPhysicalAnimating((prevState) => !prevState);

          let temp = [] as never[];
          for (let i = 0; i < (dailyData as never[]).length; i++) {
            let elem = dailyData[i];
            temp[elem['type']] = elem['reward'];
          }
          setActivityList(temp);
        }
      }, 1000);
    } else {
      // setPhoneText([]);
      // setChargeHeight();
      // setRestHeight(0);
    }

    return () => {
      clearInterval(interval1 ?? 0);
    };
  }, [isPhysicalAnimating]);

  const handleBatteryClick = (event: any) => {
    setIsAnimating((prevState) => !prevState);
    setIsPhysicalAnimating((prevState) => !prevState);
  };

  function ServerDay(
    props: PickersDayProps<Dayjs> & { highlightedDays?: number[] }
  ) {
    const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

    const isSelected =
      !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) > 0;

    return (
      <Badge
        key={props.day.toString()}
        overlap="circular"
        badgeContent={isSelected ? '🌚' : undefined}
      >
        <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
      </Badge>
    );
  }

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
            // renderDay={renderWeekPickerDay}
            // slots={{
            //   day: ServerDay,
            // }}
            // slotProps={{
            //   day: {
            //     highlightedDays,
            //   } as any,
            // }}
            // tileClassName={({ date }) => (date.getMonth() === 3 ? 'highlight' : '')}
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
