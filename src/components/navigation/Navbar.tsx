import React from 'react';
<<<<<<< HEAD
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { ButtonGroup } from '@mui/material';

const Navbar = () => {
=======
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

const Navbar = () => {
  const { asPath } = useRouter();
  const currentPath = asPath.split('?')[0];
  const { enqueueSnackbar } = useSnackbar();
  const launchNotifications = () => {
    setTimeout(() => {
      // enqueueSnackbar()
    });
  };

>>>>>>> main
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
<<<<<<< HEAD
      sx={{ boxShadow: (theme) => `0 1px 0 0 ${theme.palette.divider}` }}
=======
      sx={{
        display: 'flex',
        alignItems: 'center',
        boxShadow: (theme) => `0 1px 0 0 ${theme.palette.divider}`,
      }}
>>>>>>> main
      position="sticky"
      elevation={0}
      component="nav"
      color="secondary"
    >
<<<<<<< HEAD
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
=======
      <Toolbar sx={{ maxWidth: 'lg', width: '100%' }}>
        <Typography
          variant="h5"
          component={Link}
          href="/"
          color="primary"
          sx={{
            textDecoration: 'none',
            ':hover': {
              color: 'text.primary',
            },
            flexGrow: 1,
            display: { xs: 'none', sm: 'block' },
            fontWeight: 700,
          }}
        >
          2/cent
        </Typography>
        <Tabs sx={{ alignSelf: 'flex-end' }} value={currentPath}>
          {navItems.map((item) => (
            <Tab
              component={Link}
              href={item.link}
              value={item.link}
              color="primary"
              label={item.title}
              key={item.title}
            />
          ))}
        </Tabs>
>>>>>>> main
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
