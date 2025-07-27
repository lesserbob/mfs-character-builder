import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import './BespokeFeatureModal.css';
import { useState } from 'react';

export interface BespokeFeatureModalProps {
  isModalOpen: boolean;
  closeModal(value: { name: string; description: string } | null): void;
}

export const BespokeFeatureModal = ({
  isModalOpen,
  closeModal,
}: BespokeFeatureModalProps) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  return (
    <Dialog
      open={isModalOpen}
      slotProps={{
        paper: {
          className: 'bespoke-feature-dialog-paper',
        },
      }}
    >
      <DialogTitle>Feature</DialogTitle>
      <DialogContent>
        <div className="bespoke-feature-stack">
          <TextField
            label="Name"
            fullWidth
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Description"
            multiline
            fullWidth
            minRows={3}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="bespoke-feature-button-group">
            <Button
              type="button"
              variant="contained"
              fullWidth
              disabled={name.length === 0 || description.length === 0}
              onClick={() => {
                closeModal({ name, description });
              }}
            >
              Save
            </Button>
            <Button
              type="button"
              variant="outlined"
              fullWidth
              onClick={() => {
                closeModal(null);
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
