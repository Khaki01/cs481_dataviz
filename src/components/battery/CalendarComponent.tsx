import React, { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CalendarToday } from '@mui/icons-material';
import { DatePicker, StaticDatePicker, DateCalendar } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';
import { styled } from '@mui/system';
import dayjs from 'dayjs';

const CalendarComponent = () => {
  const [value, setValue] = useState(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        value={value}
        onChange={(newValue) => {
          console.log(newValue);
          setValue(newValue);
        }}
      />
    </LocalizationProvider>
  );
};

export default CalendarComponent;
