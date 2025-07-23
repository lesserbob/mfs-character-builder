import { useState } from 'react';
import SectionBox from '../../../components/SectionBox';
import SectionHeader from '../../../components/SectionHeader';
import { SelectPortraitModal } from './SelectPortrait/SelectPortraitModal';

export interface SelectPortaitProps {
  onPortraitSelect(portrait: string | null): void;
  initialPortrait?: string | null;
}

export const SelectPortait = ({
  onPortraitSelect,
  initialPortrait = null,
}: SelectPortaitProps) => {
  const [selectedPortrait, setSelectedPortrait] = useState<String | null>(
    initialPortrait
  );
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <SectionBox>
      <SelectPortraitModal
        isModalOpen={showModal}
        closeModal={(portrait) => {
          setSelectedPortrait(portrait);
          onPortraitSelect(portrait);
          setShowModal(false);
        }}
      />
      <SectionHeader>Portrait</SectionHeader>
      <div
        onClick={() => setShowModal(true)}
        style={{
          width: 150,
          height: 150,
          border: '2px dashed #999',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backgroundColor: '#f9f9f9',
          backgroundImage: selectedPortrait
            ? `url(${selectedPortrait})`
            : undefined,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          position: 'relative',
          color: '#666',
        }}
      >
        {!selectedPortrait && <span>Click to select portrait</span>}
      </div>
    </SectionBox>
  );
};
