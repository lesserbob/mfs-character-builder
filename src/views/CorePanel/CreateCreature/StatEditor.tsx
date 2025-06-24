import React from 'react';
import { TextField, Typography, IconButton, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export interface StatEditorProps {
  stat: string;
  value: number;
  min: number;
  max: number;
  setValue: (value: number) => void;
  error?: boolean;
  helperText?: string;
  disableIncrement?: boolean;
}

export const StatEditor = ({
  stat,
  value,
  min,
  max,
  setValue,
  error,
  helperText,
  disableIncrement = false,
}: StatEditorProps): React.JSX.Element => {
  const handleIncrement = () => {
    if (value < max) {
      setValue(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      setValue(value - 1);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <TextField
        label={stat}
        type="number"
        fullWidth
        value={value}
        error={error}
        helperText={helperText}
      />
      <IconButton
        onClick={handleIncrement}
        disabled={value >= max || disableIncrement}
        color="primary"
      >
        <AddIcon />
      </IconButton>
      <IconButton
        onClick={handleDecrement}
        disabled={value <= min}
        color="primary"
      >
        <RemoveIcon />
      </IconButton>
    </Box>
  );
};
