import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import './SimpleAssetModal.css';
import { useState } from 'react';

export interface SimpleAssetModalProps {
  isModalOpen: boolean;
  closeModal(value: { name: string; description: string } | null): void;
  assetDescription: string;
}

/**
 * Modal to allow generic capture/edit of name/description pair data
 */
export const SimpleAssetModal = ({
  isModalOpen,
  closeModal,
  assetDescription,
}: SimpleAssetModalProps) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  return (
    <Dialog
      open={isModalOpen}
      slotProps={{
        paper: {
          className: 'simple-asset-dialog-paper',
        },
      }}
    >
      <DialogTitle>{assetDescription}</DialogTitle>
      <DialogContent>
        <div className="simple-asset-stack">
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
          <div className="simple-asset-button-group">
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
