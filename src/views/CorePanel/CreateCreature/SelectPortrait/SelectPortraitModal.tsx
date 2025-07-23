import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useEffect, useState } from 'react';
import './SelectPortraitModal.css';

type PortraitData = Record<string, string[]>;

export interface SelectPortraitModalProps {
  isModalOpen: boolean;
  closeModal(portrait: string | null): void;
}

export const SelectPortraitModal = ({
  isModalOpen,
  closeModal,
}: SelectPortraitModalProps) => {
  const [portraits, setPortraits] = useState<PortraitData>({});
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/portraits/portraits.json`)
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((data: PortraitData) => {
        console.log(data);
        setPortraits(data);
        const firstFolder = Object.keys(data)[0];
        if (firstFolder) setSelectedFolder(firstFolder);
      });
  }, []);

  if (!selectedFolder) return <></>;

  const images = portraits[selectedFolder!].map(
    (filename) => `/portraits/${selectedFolder}/${filename}`
  );

  return (
    <Dialog open={isModalOpen}>
      <DialogTitle>Select portrait</DialogTitle>
      <DialogContent>
        <div>
          <div style={{ marginBottom: '1rem' }}>
            {Object.keys(portraits).map((folder) => (
              <Button
                key={folder}
                onClick={() => setSelectedFolder(folder)}
                style={{
                  marginRight: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor:
                    selectedFolder === folder ? '#1976d2' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                }}
              >
                {folder}
              </Button>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {images.map((src) => (
              <img
                key={src}
                src={src}
                onClick={() => setSelectedImage(src)}
                alt="portrait"
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border:
                    selectedImage === src
                      ? '3px solid #1976d2'
                      : '1px solid #ccc',
                  objectFit: 'cover',
                }}
              />
            ))}
          </div>

          {/* Preview */}
          {selectedImage && (
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <img src={selectedImage} width={100} />
            </div>
          )}
        </div>
        <div className="select-portrait-button-group">
          <Button
            type="button"
            variant="contained"
            fullWidth
            onClick={() => {
              closeModal(selectedImage);
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
      </DialogContent>
    </Dialog>
  );
};
