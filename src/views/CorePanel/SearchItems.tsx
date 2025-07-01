import { useEffect, useState } from 'react';
import { apiClient } from '../../api/client';
import { Item } from '../../api/generated';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { capitalizeFirst } from '../../util/TextUtils';
import ItemView from '../../components/ItemView';
import './SearchItems.css';

const SearchItems: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);

  const fetchItems = () => {
    return apiClient.getItems().then((response) => {
      setItems(response.data);
    });
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const costTable = [0, 1, 2, 4, 6, 9, 12, 16, 20, 25, 30];
  const cost = (item: Item) => {
    return costTable[item.rank ?? 0] ?? 0;
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table className="search-items-table">
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Cost</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
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
