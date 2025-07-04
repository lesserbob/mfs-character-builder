// Panel intended to allow consistent viewing of items
// This takes into account the type of the item and displays the appropriate information
// Also allows for the inclusion of a creature in order than display can incorporate creature stats and abilities
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import { TableHead } from '@mui/material';
import { Item, Creature } from '../api/generated';
import { capitalizeFirst } from '../util/TextUtils';
import './ItemView.css';

interface ItemViewProps {
  item: Item;
  creature?: Creature;
}

export const ItemView: React.FC<ItemViewProps> = ({ item, creature }) => {
  const showDamage =
    item.damageUnarmored !== null && item.damageArmored !== null;

  const damageText = showDamage
    ? item.damageUnarmored === item.damageArmored
      ? `${item.damageUnarmored}`
      : `${item.damageUnarmored}/${item.damageArmored}`
    : '';

  const options = [];
  if (item.concealable) {
    options.push('Concealable');
  }
  if (item.finesse) {
    options.push('Finesse');
  }
  if (item.thrown) {
    options.push('Thrown');
  }
  if (item.sniper) {
    options.push('Sniper');
  }
  if (item.scatter) {
    options.push('Scatter');
  }
  if (item.brace) {
    options.push('Brace');
  }
  if (item.reliability === 'RELIABLE' || item.reliability === 'UNRELIABLE') {
    options.push(capitalizeFirst(item.reliability));
  }
  if (item.twoHanded) {
    options.push('Two-Handed');
  }
  if (item.reach) {
    options.push(`Reach`);
  }

  const optionText = options.join(', ');

  return (
    <div>
      <TableContainer component={Paper}>
        <Table className="item-view-table">
          <TableHead>
            <TableRow>
              {showDamage && (
                <TableCell className="damage-column">Damage</TableCell>
              )}
              {item.type === 'RANGED' && (
                <>
                  <TableCell className="range-column">Range</TableCell>
                  <TableCell className="awoa-column">AWOA</TableCell>
                  <TableCell className="rof-column">Rate of Fire</TableCell>
                </>
              )}
              {item.type === 'ARMOR' && (
                <>
                  <TableCell className="armor-type-column">Type</TableCell>
                  <TableCell className="soak-column">Soak</TableCell>
                </>
              )}
              <TableCell className="options-column"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {showDamage && (
                <TableCell className="damage-column">{damageText}</TableCell>
              )}
              {item.type === 'RANGED' && (
                <>
                  <TableCell className="range-column">
                    {capitalizeFirst(item.range ?? '')}
                  </TableCell>
                  <TableCell className="awoa-column">
                    {item.attacksWorthOfAmmo}
                  </TableCell>
                  <TableCell className="rof-column">
                    {capitalizeFirst(item.rateOfFire ?? '')}
                  </TableCell>
                </>
              )}
              {item.type === 'ARMOR' && (
                <>
                  <TableCell className="range-column">
                    {capitalizeFirst(item.armorType ?? '')}
                  </TableCell>
                  <TableCell className="range-column">{item.soak}</TableCell>
                </>
              )}
              <TableCell className="options-column">{optionText}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ItemView;
