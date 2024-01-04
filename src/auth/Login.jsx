import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext/AuthProvider';
import { useForm, Controller } from 'react-hook-form';
import { Button, TextField, Typography, Container, CssBaseline, Avatar, Alert, AlertTitle } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {  getUsers } from '../api/api';

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

const Login = () => {
  const { login } = useAuth();
  const [users, setUsers] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users', error);
      }
    };
    fetchUsers();
  }, []);

  const handleLogin = (data) => {
    const foundUser = users.find((user) => user.nom === data.username && user.password === data.password);

    if (foundUser) {
      login(foundUser);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000); 
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Se connecter
        </Typography>
        <form onSubmit={handleSubmit(handleLogin)}>
          <Controller
            name="username"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                fullWidth
                id="username"
                label="Username"
                autoComplete="username"
                autoFocus
                error={!!errors.username}
                helperText={errors.username?.message}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                fullWidth
                label="Password"
                type="password"
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />
          <Button fullWidth variant="contained" color="primary" type="submit">
          Se connecter
          </Button>
        </form>
        {showAlert && (
          <Alert severity="success" sx={{ mt: 2 }}>
            <AlertTitle>Login successful!</AlertTitle>
            Bienvenue, {users.find((user) => user.nom === users)?.nom}!
          </Alert>
        )}
      </div>
    </Container>
  );
};

export default Login;
