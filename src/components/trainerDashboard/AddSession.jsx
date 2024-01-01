import  { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { getSessions, getUserFormations, postSession } from '../../api/api';
import { useAuth } from '../../AuthContext/AuthProvider';
import { useForm, Controller } from 'react-hook-form';

const schema = yup.object().shape({
  nomSess: yup.string().required('Nom Session is required'),
  dateDebut: yup.date().required('Date Début is required'),
  dateFin: yup.date().required('Date Fin is required'),
  codeForm: yup.string().required('Code Formation is required'),
});

const AddSessionForm = () => {
  const { user } = useAuth();
  const [userFormations, setUserFormations] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userFormations = await getUserFormations(user);
        setUserFormations(userFormations);
      } catch (error) {
        console.error('fetching user formations error', error);
      }
    };
    fetchUserData();
  }, [user]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleFormSubmit = async (data) => {
    try {
      const sessions = await getSessions();
      const checkIfExist = sessions?.some((session) => session.nomSess === data.nomSess);

      if (checkIfExist) {
        alert('Session already exists');
      } else {
        const formattedOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
        const formattedData = {
          ...data,
          codeForm: Number(data.codeForm),
          dateDebut: new Date(data.dateDebut).toLocaleString(undefined, formattedOptions),
          dateFin: new Date(data.dateFin).toLocaleString(undefined, formattedOptions),
        };
        await postSession(formattedData);
        setSuccessMessage('Session added successfully!');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>
      Ajouter une session
      </Typography>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Controller
          name="nomSess"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Nom Session"
              fullWidth
              error={!!errors.nomSess}
              helperText={errors.nomSess?.message}
              sx={{ marginBottom: 2 }}
            />
          )}
        />

        <InputLabel>Date Début</InputLabel>
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <Controller
            name="dateDebut"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="datetime-local"
                fullWidth
                error={!!errors.dateDebut}
                helperText={errors.dateDebut?.message}
                InputProps={{}}
              />
            )}
          />
        </FormControl>

        <InputLabel>Date Fin</InputLabel>
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <Controller
            name="dateFin"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="datetime-local"
                fullWidth
                error={!!errors.dateFin}
                helperText={errors.dateFin?.message}
                InputProps={{}}
              />
            )}
          />
        </FormControl>

        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Choisir une formation</InputLabel>
          <Controller
            name="codeForm"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                fullWidth
                label="Code Formation"
                error={!!errors.codeForm}
                helperText={errors.codeForm?.message}
              >
                {userFormations?.map((formation) => (
                  <MenuItem key={formation.id} value={formation.id}>
                    {formation.titre}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: '16px' }}
        >
          Créer une session
        </Button>

        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <MuiAlert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            {successMessage}
          </MuiAlert>
        </Snackbar>
      </form>
    </Container>
  );
};

export default AddSessionForm;
