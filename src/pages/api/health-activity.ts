import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import { join } from 'path';
import Papa, { ParseResult } from 'papaparse';
<<<<<<< HEAD
import moment, { Moment } from 'moment';
import { extendMoment, DateRange } from 'moment-range';
interface ReturnData {
  index: number;
  type: string;
  timestamp: string;
  duration: number;
  Calories_Diff: number;
  startDate: string;
  endDate: string;
}

type Data = {
  index: number;
  type: string;
  timestamp: string;
  duration: number;
  Calories_Diff: number;
};

interface A {
  duration: number;
  Calories_Diff: number;
}
type AccType = Record<
  string,
  Record<string, { duration: number; Calories_Diff: number }>
>;
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ParseResult<Data>>
) {
  const filePath = join(process.cwd(), 'public', 'physical.csv');
  const fileData = fs.readFileSync(filePath, 'utf8');
  const physicalCsv = Papa.parse<Data>(fileData, {
    header: true,
    dynamicTyping: true,
    complete: (results) => {},
  });
  res.status(200).json(physicalCsv);
=======

export type PhysicalDays = {
  timestamp: string;
  ON_FOOT: number;
  STILL: number;
  TILTING: number;
  OTHERS: number;
  TOTAL: number;
  GOAL: number;
  EXTRA: number;
};

const config: Papa.ParseConfig = {
  header: true,
  dynamicTyping: true,
};
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ParseResult<PhysicalDays>>
) {
  const physicalProcessedCsv = join(process.cwd(), 'public', 'physical_days.csv');
  const physicalProcessedData = fs.readFileSync(physicalProcessedCsv, 'utf8');
  const parsedPhysicalProcessed = Papa.parse<PhysicalDays>(physicalProcessedData, {
    ...config,
  });
  res.status(200).json({
    ...parsedPhysicalProcessed,
    data: parsedPhysicalProcessed.data.filter((item) => item.timestamp),
  });
>>>>>>> main
}
