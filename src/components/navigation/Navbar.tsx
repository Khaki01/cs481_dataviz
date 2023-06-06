import React from 'react';

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
  const currentPath = asPath.split('?')[0].split('#')[0];
  const { enqueueSnackbar } = useSnackbar();
  const launchNotifications = () => {
    setTimeout(() => {
      enqueueSnackbar('Doing well, just charged 15%!', {
        variant: 'success',
        anchorOrigin: { horizontal: 'center', vertical: 'top' },
        transitionDuration: 2000,
      });
      setTimeout(() => {
        enqueueSnackbar('Feeling good today? Time to walk!', {
          variant: 'info',
          anchorOrigin: { horizontal: 'center', vertical: 'top' },
          transitionDuration: 2000,
        });
        setTimeout(() => {
          enqueueSnackbar('You just used 5% for instagram, care to exercise more!', {
            variant: 'warning',
            anchorOrigin: { horizontal: 'center', vertical: 'top' },
            transitionDuration: 2000,
          });
        }, 3000);
      }, 3000);
    }, 3000);
  };

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
      sx={{
        display: 'flex',
        alignItems: 'center',
        boxShadow: (theme) => `0 1px 0 0 ${theme.palette.divider}`,
      }}
      position="sticky"
      elevation={0}
      component="nav"
      color="secondary"
    >
      <Toolbar sx={{ maxWidth: 'lg', width: '100%' }}>
        <Typography
          onClick={launchNotifications}
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
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
