import React from 'react';
import Box from '@mui/material/Box';
import './SectionBox.css';

interface SectionBoxProps {
  children: React.ReactNode;
}

/**
 * Generic, reusable box
 */
const SectionBox: React.FC<SectionBoxProps> = ({ children }) => (
  <Box className={`section-box`}>{children}</Box>
);

export default SectionBox;
