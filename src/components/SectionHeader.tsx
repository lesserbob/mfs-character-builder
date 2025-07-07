import React from 'react';
import Typography from '@mui/material/Typography';
import './SectionHeader.css';

interface SectionHeaderProps {
  children: React.ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ children }) => (
  <Typography variant="h6" className="section-header">
    {children}
  </Typography>
);

export default SectionHeader;
