import { useEffect, useState } from 'react';
import { getUserFormations } from '../../api/api';
import { useAuth } from '../../AuthContext/AuthProvider';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

function FormationsList() {
  const [formateurFormations, setFormateurFormations] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    const fetchFormations = async () => {
      const formationsData = await getUserFormations(user);
      setFormateurFormations(formationsData);
    };
    fetchFormations();
  }, [user]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
          <TableCell>Titre</TableCell>
          <TableCell>Domaine</TableCell>
          <TableCell>Niveau</TableCell>
          <TableCell>Action</TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {formateurFormations?.map((formation) => (
            <TableRow key={formation.id}>
              <TableCell>{formation.titre}</TableCell>
              <TableCell>{formation.domaine}</TableCell>
              <TableCell>{formation.niveau}</TableCell>
              <TableCell>
                <Button
                  component={Link}
                  to={`/training/${formation.id}`}
                  variant="contained"
                  color="primary"
                >
                  Détails
                </Button>
                <Button
                  component={Link}
                  to={`/sessions/${formation.id}`}
                  variant="contained"
                  color="primary"
                  style={{ marginLeft: '8px' }}
                >
                  Sessions
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default FormationsList;