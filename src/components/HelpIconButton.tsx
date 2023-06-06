import React, { PropsWithChildren, useEffect } from "react";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

interface HelpIconButtonProps extends PropsWithChildren {
  onStart: Function;
}

const HelpIconButton: React.FC<HelpIconButtonProps> = ({
  children,
  onStart,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // setAnchorEl(event.currentTarget);

    if (onStart) {
      console.log("clicked");
      onStart();
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <IconButton onClick={handleClick} color="inherit">
        <HelpOutlineOutlinedIcon />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
      >
        {children}
      </Popover>
    </>
  );
};

export default HelpIconButton;
