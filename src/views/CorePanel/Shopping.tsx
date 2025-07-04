import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { apiClient, Creature } from '../../api/client';
import SearchItems from './SearchItems';
import { Mode } from './SearchItems';
import { Button, Typography } from '@mui/material';
import { useItems } from '../../context/ItemContext';
import './Shopping.css';
import { cost } from '../../util/ItemUtils';

/**
 * Allows for character to add and remove items from their inventory.
 */
const Shopping = () => {
  const { items } = useItems();
  const { id } = useParams<{ id: string }>();
  const creatureId = id ? parseInt(id, 10) : 0;
  const [creature, setCreature] = useState<Creature | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCreature = async () => {
      const response = await apiClient.getCreatureById(creatureId);
      setCreature(response.data);
    };
    fetchCreature();
  }, [creatureId]);

  const handleSetItemQuantity = (itemId: number, quantity: number) => {
    console.log('Set item quantity');
    // Check that the item is currently in the creatures inventory
    let itemList = [...creature!.items];
    const inList = itemList.find((i) => i.itemId === itemId);

    // Inc/dec count if in list. Add if not
    if (inList) {
      const newQuantity = inList.quantity + quantity;
      const newListItem = { itemId: itemId, quantity: newQuantity };

      itemList = itemList.filter((i) => i.itemId !== itemId);
      if (newQuantity > 0) itemList.push(newListItem);
    } else {
      if (quantity > 0) itemList.push({ itemId: itemId, quantity: quantity });
    }
    console.log(itemList);
    // Need to rebuild creature to force re-render
    const newCreature = { ...creature, items: itemList } as Creature;
    console.log(newCreature);
    setCreature(newCreature);
  };

  const totalSpent = useMemo(() => {
    if (!creature) return 0;

    return creature.items.reduce(
      (acc: number, creatureItem: any) =>
        acc +
        cost(items.find((i) => i.id === creatureItem.itemId)!) *
          creatureItem.quantity,
      0
    );
  }, [creature, items]);

  const saveCreature = async () => {
    try {
      const response = await apiClient.updateCreature(creatureId, creature!);
      if (response.status === 200) {
        navigate(`/creature/${creatureId}`);
      }
    } catch (err) {
      console.error('Error updating creature:', err);
    }
  };

  return (
    <div>
      <div className="update-creature-button-group">
        <Button
          type="button"
          variant="contained"
          className="update-creature-button"
          onClick={saveCreature}
        >
          Save
        </Button>
        <Button
          type="button"
          variant="outlined"
          onClick={() => navigate(`/creature/${creatureId}`)}
          className="update-creature-button"
        >
          Cancel
        </Button>
      </div>
      <Typography variant="h5" component="h2">
        Shopping
      </Typography>
      <div className="wealth-stats">
        <Typography variant="body1">
          Total Wealth: {creature?.wealth}
        </Typography>
        <Typography variant="body1">Total Spent: {totalSpent}</Typography>
        <Typography variant="body1">
          Total Available: {(creature?.wealth ?? 0) - totalSpent}
        </Typography>
      </div>
      <SearchItems
        creature={creature!}
        mode={Mode.SHOPPING}
        handleSetItemQuantity={handleSetItemQuantity}
        availableWealth={(creature?.wealth ?? 0) - totalSpent}
      />
    </div>
  );
};

export default Shopping;
