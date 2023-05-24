import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import { join } from 'path';
import Papa, { ParseResult } from 'papaparse';

export type PhysicalDays = {
  name: string;
  duration_ms: number;
  datetime: string;
  category: string;
  penalty_points: number;
};

const config: Papa.ParseConfig = {
  header: true,
  dynamicTyping: true,
};
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ParseResult<PhysicalDays>>
) {
  const physicalProcessedCsv = join(
    process.cwd(),
    'public',
    'task3-phoneUsageBattery-sorted.csv'
  );
  const physicalProcessedData = fs.readFileSync(physicalProcessedCsv, 'utf8');
  const parsedPhysicalProcessed = Papa.parse<PhysicalDays>(physicalProcessedData, {
    ...config,
  });
  res.status(200).json({
    ...parsedPhysicalProcessed,
    data: parsedPhysicalProcessed.data.filter((item) => item.datetime),
  });
}
