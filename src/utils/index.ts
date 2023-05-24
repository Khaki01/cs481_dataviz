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
