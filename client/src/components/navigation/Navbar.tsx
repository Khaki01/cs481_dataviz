import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useRouter } from 'next/router';

const Navbar = () => {
  const { asPath } = useRouter();
  const currentPath = asPath.split('?')[0];

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
          variant="h5"
          component={Link}
          href="/"
          color="text.primary"
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
