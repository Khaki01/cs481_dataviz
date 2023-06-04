import React, { useEffect, useMemo, useState } from "react";
import Stack from "@mui/material/Stack";
import theme from "../../styles/theme";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import MultiValuedProgressBar, {
  MultiValuedProgressBarProps,
} from "./MultiValuedProgressBar";
import json from "../../../public/nested_json_readable.json";
import Typography from "@mui/material/Typography";
import moment from "moment";
import { PlotData } from "plotly.js";
import { useGoalContext } from "../context/GoalProvider";
import Box from "@mui/material/Box";
import { ScaleLoader } from "react-spinners";
import HelpIconButton from "../HelpIconButton";
import BoopAnimation from "../animated/BoopAnimation";
import Joyride from "react-joyride";

interface DailyActivity {
  day: string;
  data: {
    timestamp: string;
    ON_FOOT: number | null;
    STILL: number | null;
    TILTING: number | null;
    OTHERS: number | null;
    TOTAL: number | null;
  }[];
}
export type ActivityProp = "ON_FOOT" | "STILL" | "TILTING" | "OTHERS" | "TOTAL";
export type ActivityType = "running" | "cycling" | "all" | "others" | "workout";
export const activityMap: { [key in ActivityType]: ActivityProp } = {
  running: "ON_FOOT",
  cycling: "TILTING",
  all: "TOTAL",
  others: "OTHERS",
  workout: "STILL",
};
const HealthActivityDistAndPie = () => {
  const { query } = useRouter();
  const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

  const dailyActivityData = json as DailyActivity[];
  const dayData = useMemo<DailyActivity>(() => {
    const day = Number(query?.idx);
    if (day >= 0 && day <= 6) {
      return dailyActivityData[day];
    }
    return { day: "", data: [] };
  }, [dailyActivityData, query?.idx]);

  const [graphLoading, setGraphLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setGraphLoading(false);
    }, 250);
  }, []);
  const activityData = useMemo(() => {
    const activity = query?.act as ActivityType;
    return activity
      ? dayData.data.map((item) => item[activityMap[activity]] ?? 0)
      : [];
  }, [dayData.data, query?.act]);

  const distData: Partial<PlotData> = {
    x: Array.from(Array(24).keys()),
    y: activityData,
    type: "scatter",
    name: String(query?.act),
    mode: "lines",
    line: { color: theme.palette.primary.main, shape: "spline", width: 3 },
    fill: "tozeroy",
    fillcolor: `${theme.palette.primary.main}80`,
  };

  const {
    activity: [value],
  } = useGoalContext();
  const progressBarValues = useMemo<
    Partial<MultiValuedProgressBarProps>
  >(() => {
    return {
      values: [
        {
          value:
            (dayData.data.reduce((acc, cur) => acc + (cur?.ON_FOOT ?? 0), 0) *
              100) /
            Number(value),
          name: "running",
        },
        {
          value:
            (dayData.data.reduce((acc, cur) => acc + (cur?.OTHERS ?? 0), 0) *
              100) /
            Number(value),
          name: "others",
        },
        {
          value:
            (dayData.data.reduce((acc, cur) => acc + (cur?.STILL ?? 0), 0) *
              100) /
            Number(value),
          name: "workout",
        },
        {
          value:
            (dayData.data.reduce((acc, cur) => acc + (cur?.TILTING ?? 0), 0) *
              100) /
            Number(value),
          name: "cycling",
        },
      ],
    };
  }, [dayData.data, value]);

  const [domLoaded, setDomLoaded] = useState(false);
  const [runJoyride1, setRunJoyride1] = useState(false);

  useEffect(() => {
    setRunJoyride1(false);
    setDomLoaded(true);
  }, []);

  const steps = [
    {
      target: "#hpstep5",
      content: "Welcome to the first page of your results display. ",
      disableBeacon: true,
    },
    {
      target: "#hpstep6",
      content: "Welcome to the first page of your results display. ",
      disableBeacon: true,
    },
    {
      target: "#hpstep7",
      content: "Freely set the filters here.",
      disableBeacon: true,
    },
    {
      target: "#hpstep8",
      content: "This another awesome feature!",
      disableBeacon: true,
    },
    {
      target: "#hpstep9",
      content: "This another awesome feature!",
      disableBeacon: false,
    },
  ];

  const handleStartJoyride = () => {
    console.log("clicked1");
    setRunJoyride1(true);
  };

  const handleJoyrideCallback = (data: any) => {
    const { action, status } = data;

    if (status === "finished" || status === "skipped") {
      setRunJoyride1(false);
    }
  };

  return (
    <div>
      <Stack width="100%" spacing={2}>
        {dayData && (
          <>
            <Box
              alignItems="center"
              width="100%"
              display="flex"
              justifyContent="space-between"
            >
              <Typography variant="h6">
                {moment(dayData?.day).format("MMM DD")}
              </Typography>
              <BoopAnimation>
                <HelpIconButton onStart={handleStartJoyride}>
                  <Box maxWidth={150} p={2}>
                    <Typography>
                      You can visualize activities by clicking on progress plot
                      or badge
                    </Typography>
                  </Box>
                </HelpIconButton>
              </BoopAnimation>
            </Box>

            {graphLoading && (
              <Box
                height={506}
                display="flex"
                justifyContent="center"
                alignItems="center"
                width="100%"
              >
                <ScaleLoader
                  color={theme.palette.primary.main}
                  loading={graphLoading}
                />
              </Box>
            )}
            {!graphLoading && (
              <Plot
                divId="hpstep6"
                onInitialized={() => setGraphLoading(false)}
                data={[
                  {
                    x: Array.from(Array(24).keys()),
                    y: dayData.data.map((item) => item.TOTAL),
                    type: "scatter",
                    name: "total",
                    mode: "lines",
                    line: {
                      color: theme.palette.text.primary,
                      shape: "spline",
                      width: 3,
                    },
                    fill: "tozeroy",
                    fillcolor: `${theme.palette.text.primary}80`,
                  },
                  distData,
                ]}
                config={{ displayModeBar: false }}
                layout={{
                  autosize: true,
                  margin: { t: 0 },
                  xaxis: {
                    showgrid: false,
                    title: "Hours",
                    titlefont: {
                      color: theme.palette.text.primary,
                      // family: 'Inter',
                    },
                    range: [1, 24],
                  },
                  yaxis: {
                    showgrid: false,
                    title: "Calories",
                    titlefont: {
                      color: theme.palette.text.primary,
                      // family: 'Inter',
                    },
                  },
                }}
              />
            )}
            {progressBarValues.values && !graphLoading && (
              <MultiValuedProgressBar
                setGraphLoading={setGraphLoading}
                values={progressBarValues.values}
              />
            )}
          </>
        )}
      </Stack>
      <>
        {domLoaded && (
          <div>
            <Joyride
              steps={steps}
              continuous
              run={runJoyride1}
              callback={handleJoyrideCallback}
              disableScrolling={true}
            />
          </div>
        )}
      </>
    </div>
  );
};

export default HealthActivityDistAndPie;
