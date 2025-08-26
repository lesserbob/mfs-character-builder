import { Typography } from '@mui/material';
import React from 'react';

interface TextProps {
  children: React.ReactNode;
}

/**
 * Standard representation for text
 * @returns
 */
export const Text = React.forwardRef<HTMLSpanElement, TextProps>(
  ({ children, ...props }, ref) => {
    return (
      <Typography
        ref={ref}
        variant="body2"
        color="text.primary"
        sx={{ mt: 1 }}
        display="inline"
        {...props}
      >
        {children}
      </Typography>
    );
  }
);

Text.displayName = 'Text';
