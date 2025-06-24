import { TextField } from '@mui/material';

/**
 * Field to allow read only representation of text
 * @param param0
 * @returns
 */
export const ReadOnlyField = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  return (
    <TextField
      label={label}
      value={value}
      aria-readonly
      variant="outlined"
      fullWidth
    />
  );
};
