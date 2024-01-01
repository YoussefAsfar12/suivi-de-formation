import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Container, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { addUser, getUserByEmail, getUserByName } from '../api/api';

const schema = yup.object().shape({
  nom: yup.string().min(6, 'Name must be at least 6 characters').required('Name is required'),
  role: yup.string().required('Role is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(4, 'Password must be at least 4 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required'),
});

const Registration = () => {
  const navigate = useNavigate();
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nom: '',
      role: 'Participant',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    try {

      const emailExists = await getUserByEmail(data.email);
      if (emailExists.length > 0) {
        alert('Email is already taken. Please choose a different one.');
        return;
      }
      
      const nameExists = await getUserByName(data.nom);
      if (nameExists.length > 0) {
        alert('Name is already taken. Please choose a different one.');
        return;
      }
  
      const userData =
        data.role === "Formateur" ?
        { ...data, formationsEnseignees: [] } :
        { ...data, formationsInscrites: [] };
  
      delete userData.confirmPassword;
      await addUser(userData);
      navigate('/login');
    } catch (error) {
      console.error('Registration failed', error);
    }
  };
  

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="nom"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Name"
              fullWidth
              margin="normal"
              variant="outlined"
              error={!!errors.nom}
              helperText={errors.nom?.message}
            />
          )}
        />

        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel>Role</InputLabel>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label="Role"
                error={!!errors.role}
                helperText={errors.role?.message}
              >
                <MenuItem value="Participant">Participant</MenuItem>
                <MenuItem value="Formateur">Formateur</MenuItem>
              </Select>
            )}
          />
        </FormControl>

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              fullWidth
              margin="normal"
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="password"
              label="Password"
              fullWidth
              margin="normal"
              variant="outlined"
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          )}
        />

        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="password"
              label="Confirm Password"
              fullWidth
              margin="normal"
              variant="outlined"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
          )}
        />

        <br />
        <Button type="submit" variant="contained" color="primary">
          Register
        </Button>
      </form>
    </Container>
  );
};

export default Registration;
