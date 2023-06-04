import React, { Dispatch, MouseEventHandler, SetStateAction } from "react";
import ProgressBar, { ProgressBarProps } from "react-bootstrap/ProgressBar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/system/Unstable_Grid";
import { Badge } from "react-bootstrap";
import { useRouter } from "next/router";
import { ActivityType } from "./HealthActivityDistAndPie";

export interface MultiValuedProgressBarProps {
  setGraphLoading: Dispatch<SetStateAction<boolean>>;
  values: {
    value: number;
    name: ActivityType;
  }[];
}

const colors: ProgressBarProps["color"][] = [
  "success",
  "danger",
  "warning",
  "info",
];

const MultiValuedProgressBar = ({
  values,
  setGraphLoading,
}: MultiValuedProgressBarProps) => {
  const { query, push } = useRouter();
  const handleClick: (
    label: ActivityType
  ) => MouseEventHandler<HTMLInputElement> = (label) => async (event) => {
    setGraphLoading(true);
    await push({ query: { ...query, act: label } }, undefined, {
      scroll: false,
      shallow: true,
    });
    setTimeout(() => {
      setGraphLoading(false);
    }, 250);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      rowGap={2}
      maxWidth="50%"
      id="hpstep5"
    >
      <ProgressBar>
        {values.map((item, idx) => (
          <ProgressBar
            style={{ cursor: "pointer" }}
            striped
            onClick={handleClick(item.name)}
            variant={colors[idx]}
            animated
            key={item.value}
            now={Math.round(item.value) ?? 1}
          />
        ))}
      </ProgressBar>
      <Grid container spacing={1}>
        {values.map((item, idx) => (
          <Grid key={item.name}>
            <Badge
              defaultValue={item.name}
              onClick={handleClick(item.name)}
              style={{ cursor: "pointer" }}
              bg={colors[idx]}
            >
              <Typography>
                {item.name} {item.value.toFixed(2)}%
              </Typography>
            </Badge>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MultiValuedProgressBar;
