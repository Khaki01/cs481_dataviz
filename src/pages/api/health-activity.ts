import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import { join } from 'path';
import Papa, { ParseResult } from 'papaparse';
import { activityMap } from 'components/data/HealthActivityDistAndPie';

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
}
