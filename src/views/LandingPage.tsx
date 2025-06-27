import React from 'react';
import { Box, Typography, Paper, Container } from '@mui/material';
import './LandingPage.css';

export const LandingPage = (): React.JSX.Element => {
  return (
    <Container maxWidth="md">
      <Paper className="title-container" elevation={0}>
        <Box className="logo-container">
          <img
            src="/sla_535x.webp"
            alt="SLA Industries Logo"
            className="main-logo"
          />
        </Box>
        <Typography className="main-title" variant="h1">
          SLA Industries
        </Typography>
        <Typography className="subtitle" variant="h2">
          Roll 12
        </Typography>
      </Paper>
    </Container>
  );
};
