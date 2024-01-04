import  { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFormationSessions } from '../../api/api';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const getStatus = (session) => {
  const currentDate = new Date();
  const startDate = new Date(session.dateDebut);
  const endDate = new Date(session.dateFin);

  if (currentDate < startDate) {
    return 'À venir';
  } else if (currentDate >= startDate && currentDate <= endDate) {
    return 'En cours';
  } else {
    return 'Terminé';
  }
};

const FormationSessions = () => {
  const { id } = useParams();
  const [formationSessions, setFormationSessions] = useState([]);

  useEffect(() => {
    const fetchFormationSessions = async () => {
      const sessionData = await getFormationSessions(id);
      setFormationSessions(sessionData);
    };
    fetchFormationSessions();
  }, [id]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nom Session</TableCell>
            <TableCell>Date Début</TableCell>
            <TableCell>Date Fin</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {formationSessions.map((session) => (
            <TableRow key={session.id}>
              <TableCell>{session.nomSess}</TableCell>
              <TableCell>{session.dateDebut}</TableCell>
              <TableCell>{session.dateFin}</TableCell>
              <TableCell>{getStatus(session)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FormationSessions;



