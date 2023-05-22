import React from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { ButtonGroup } from '@mui/material';

const Navbar = () => {
  const navItems: { id: string; title: string; link: string }[] = [
    {
      id: '1',
      title: 'Health activity',
      link: '/health-activity',
    },
    {
      id: '2',
      title: 'Phone usage',
      link: '/phone-usage',
    },
    {
      id: '3',
      title: 'Battery exploration',
      link: '/battery-exploration',
    },
  ];

  return (
    <AppBar
      sx={{ boxShadow: (theme) => `0 1px 0 0 ${theme.palette.divider}` }}
      position="sticky"
      elevation={0}
      component="nav"
      color="secondary"
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          sx={{ mr: 2, display: { sm: 'none' } }}
        ></IconButton>
        <Typography
          variant="h2"
          color="text.primary"
          sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, fontWeight: 700 }}
        >
          2/cent
        </Typography>
        <ButtonGroup variant="text">
          {navItems.map((item) => (
            <Button key={item.id} href={item.link} color="primary">
              {item.title}
            </Button>
          ))}
        </ButtonGroup>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
