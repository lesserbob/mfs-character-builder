import { Creature, Item } from '../../api/generated';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { capitalizeFirst } from '../../util/TextUtils';
import ItemView from '../../components/ItemView';
import './SearchItems.css';
import { useItems } from '../../context/ItemContext';
import { cost } from '../../util/ItemUtils';

export enum Mode {
  // For searching the entirity of the item list
  // Items are listed as per the parameters
  WHOLE_LIST,

  // For shopping for items for a given character
  // Items are listed as per the parameters
  // The option to increase or decrease item quantity is available
  SHOPPING,

  // For viewing the inventory of a giuven character
  // Items are listed as per the parameters
  // Items are retricted to those that the character actually possesses
  INVENTORY,
}

interface SearchItemsProps {
  // In the case of viewing inventory, or shopping, which creature is thi on behalf oof
  creature?: Creature;

  // The mode
  mode?: Mode;

  // In the case of shopping, an increment/decrement callback
  handleSetItemQuantity?: (itemId: number, count: number) => void;

  // in the case of shopping, the wealth the creature has available
  availableWealth?: number;
}

const SearchItems: React.FC<SearchItemsProps> = ({
  creature,
  mode = Mode.WHOLE_LIST,
  handleSetItemQuantity,
  availableWealth = 0,
}) => {
  const { items } = useItems();

  const handleIncrement = (item: Item) => {
    handleSetItemQuantity?.(item.id, 1);
  };

  const handleDecrement = (item: Item) => {
    handleSetItemQuantity?.(item.id, -1);
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table className="search-items-table">
          <TableHead>
            <TableRow>
              {mode === Mode.SHOPPING && <TableCell>Count</TableCell>}
              <TableCell>Item</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Cost</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                {mode === Mode.SHOPPING && (
                  <TableCell>
                    {(creature as any)?.items.find(
                      (i: any) => i.itemId === item.id
                    )?.quantity ?? 0}
                    <IconButton
                      onClick={() => handleIncrement(item)}
                      disabled={cost(item) > availableWealth}
                      color="primary"
                    >
                      <AddIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDecrement(item)}
                      disabled={
                        ((creature as any)?.items.find(
                          (i: any) => i.itemId === item.id
                        )?.quantity ?? 0) === 0
                      }
                      color="primary"
                    >
                      <RemoveIcon />
                    </IconButton>
                  </TableCell>
                )}
                <TableCell>{item.name}</TableCell>
                <TableCell>{capitalizeFirst(item.type ?? '')}</TableCell>
                <TableCell>{cost(item)}</TableCell>
                <TableCell>
                  <ItemView item={item} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default SearchItems;
