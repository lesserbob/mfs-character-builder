import { Creature } from '../../../api/generated';
import SectionHeader from '../../../components/SectionHeader';
import SectionBox from '../../../components/SectionBox';
import SearchItems, { Mode } from '../SearchItems';

export interface CreatureGearProps {
  creature: Creature;
}

export const CreatureGear = ({ creature }: CreatureGearProps) => {
  return (
    <SectionBox>
      <SectionHeader>Gear</SectionHeader>
      <SearchItems creature={creature} mode={Mode.INVENTORY} />
    </SectionBox>
  );
};
