import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import { join } from 'path';
import Papa, { ParseResult } from 'papaparse';

export type ActivityBatteryType = 'RUNNING' | 'CYCLING' | 'WORKOUT' | 'OTHERS';

export type PhysicalActivityBattery = {
  type: ActivityBatteryType;
  timestamp: string;
  duration: number;
  Calories_Diff: number;
  reward: number;
};

const config: Papa.ParseConfig = {
  header: true,
  dynamicTyping: true,
};
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ParseResult<PhysicalActivityBattery>>
) {
  const physicalProcessedCsv = join(process.cwd(), 'public', 'physical_days2.csv');
  const physicalProcessedData = fs.readFileSync(physicalProcessedCsv, 'utf8');
  const parsedPhysicalProcessed = Papa.parse<PhysicalActivityBattery>(
    physicalProcessedData,
    {
      ...config,
    }
  );
  res.status(200).json({
    ...parsedPhysicalProcessed,
    data: parsedPhysicalProcessed.data.filter((item) => item.timestamp),
  });
}
