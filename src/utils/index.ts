export const generateArray = <T>(
  sampleArray: number[],
  n: number,
  sample1: T,
  sample2: T
): T[] => {
  let newArray: T[] = [];
  for (let i = 0; i < sampleArray.length; i++) {
    newArray.push(sampleArray[i] >= n ? sample1 : sample2);
  }
  return newArray;
};

export const extendArray = <T>(n: number, arr: T[]): T[] => {
  let newArray: T[] = [];
  for (let i = 0; i < n; i++) {
    newArray = newArray.concat(arr);
  }
  return newArray;
};

export const percentageToColor = (
  percentage: number,
  maxHue = 120,
  minHue = 0
): string => {
  const hue = percentage * (maxHue - minHue) + minHue;
  return `hsl(${hue}, 100%, 50%)`;
};

export const groupBy = <T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => string
) => {
  return array?.reduce((acc, value, index, array) => {
    (acc[predicate(value, index, array)] ||= []).push(value);
    return acc;
  }, {} as { [key: string]: T[] });
};

export const capitalize = (str: string): string => {
  return str.toLowerCase().charAt(0).toUpperCase() + str.toLowerCase().slice(1);
};

export const timeConversion = (duration: number) => {
  const portions: string[] = [];

  const msInHour = 1000 * 60 * 60;
  const hours = Math.trunc(duration / msInHour);
  if (hours > 0) {
    const prefix = hours > 1 ? ' hours' : ' hour';
    portions.push(hours + prefix);
    duration = duration - hours * msInHour;
  }

  const msInMinute = 1000 * 60;
  const minutes = Math.trunc(duration / msInMinute);
  if (minutes > 0) {
    portions.push(minutes + ' minutes');
    duration = duration - minutes * msInMinute;
  }

  return portions.join(' ');
};
