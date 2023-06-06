import React, { PropsWithChildren } from 'react';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import IconButton from '@mui/material/IconButton';

interface HelpIconButtonProps extends PropsWithChildren {
  onStart: () => void;
}

const HelpIconButton: React.FC<HelpIconButtonProps> = ({ onStart }) => {
  return (
    <IconButton onClick={onStart} color="inherit">
      <HelpOutlineOutlinedIcon />
    </IconButton>
  );
};

export default HelpIconButton;
