import React from 'react';
import { Box, Typography, Paper, Container } from '@mui/material';
import './LandingPage.css';

export const LandingPage = (): React.JSX.Element => {
  return (
      <Container maxWidth="md">
        <Paper className="title-container" elevation={0}>
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
