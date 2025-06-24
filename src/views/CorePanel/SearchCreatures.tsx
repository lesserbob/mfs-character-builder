import { Paper } from '@mui/material';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { apiClient } from '../../api/client';
import { useEffect, useState } from 'react';
import { Creature } from '../../api/generated';
import { useClasses } from '../../context/ClassContext';
import { getClassDescription } from '../../util/CreatureUtils';

const SearchCreatures = () => {
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const { classes, loading: classesLoading } = useClasses();

  const fetchCreatures = () => {
    return apiClient
      .getCreatures()
      .then((response) => {
        setCreatures(response.data);
      })
      .catch((error) => {
        console.error('Error fetching creatures:', error);
      });
  };

  useEffect(() => {
    fetchCreatures();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Level</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {creatures.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <Link
                  to={`/creature/${row.id}`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    fontWeight: 'bold',
                  }}
                >
                  {row.name}
                </Link>
              </TableCell>
              <TableCell>{row.level}</TableCell>
              <TableCell>{getClassDescription(row, classes)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SearchCreatures;
