import React, { PropsWithChildren } from 'react';
import Navbar from '../navigation/Navbar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Navbar />
      <Box
        component="main"
        sx={{
          padding: (theme) => theme.spacing(3),
          width: '100%',
          minHeight: 'calc(100vh - 64px)',
          position: 'relative',
          background: (theme) => theme.palette.secondary.main,
          scrollBehavior: 'smooth',
        }}
      >
        <Container maxWidth="lg">{children}</Container>
      </Box>
    </>
  );
};

export default Layout;
