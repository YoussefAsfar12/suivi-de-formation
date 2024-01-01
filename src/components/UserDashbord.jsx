import { useEffect, useState } from 'react';
import {  getUserEnrolledFormations } from '../api/api';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import { useAuth } from '../AuthContext/AuthProvider';
import { Link } from 'react-router-dom';



const UserDashboard = () => {
  const [userEnrolledFormations, setUserEnrolledFormations] = useState([]);
  const {user} = useAuth();
  useEffect(() => {
    const fetchUserEnrolledFormations = async () => {
    const userEnrolledFormationsData = await getUserEnrolledFormations(user);
    setUserEnrolledFormations(userEnrolledFormationsData);
    };
    fetchUserEnrolledFormations();
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
        {userEnrolledFormations?.map((formation) => (
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
};

export default UserDashboard;
