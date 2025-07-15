import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import './LoginForm.css';

export enum Mode {
  LOGIN_REGISTER,
  RESET_PASSWORD,
}

export interface LoginFormProps {
  mode?: Mode;
}

// TODO : Its more than just login. Better name
// TODO : Move this. Its not specific to alnding page any more
export const LoginForm: React.FC<LoginFormProps> = ({
  mode = Mode.LOGIN_REGISTER,
}: LoginFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  // TODO : A generic banner would be better...
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register, logout, resetPassword, user, isAuthenticated } =
    useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success =
        mode === Mode.LOGIN_REGISTER
          ? isLogin
            ? await login(username, password)
            : await register(username, password)
          : await resetPassword(username, password);

      if (!success) {
        setError(
          mode === Mode.LOGIN_REGISTER
            ? isLogin
              ? 'Login failed'
              : 'Registration failed'
            : 'Reset password failed'
        );
      } else {
        setMessage(
          mode === Mode.LOGIN_REGISTER
            ? isLogin
              ? 'Login successful'
              : 'Registration successful'
            : 'Reset password successful'
        );
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Show logout option if user is authenticated
  if (mode === Mode.LOGIN_REGISTER && isAuthenticated) {
    return (
      <Box className="login-form-container">
        <Paper elevation={3} className="login-form-paper">
          <Typography
            variant="body1"
            component="h1"
            gutterBottom
            align="center"
          >
            {message && (
              <Alert severity="success" className="login-form-message">
                {message}
              </Alert>
            )}
            You are logged in as {user?.username}!
          </Typography>
          <Button fullWidth variant="outlined" onClick={logout} sx={{ mt: 2 }}>
            Logout
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box className="login-form-container">
      <Paper elevation={3} className="login-form-paper">
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {mode === Mode.LOGIN_REGISTER
            ? isLogin
              ? 'Login'
              : 'Register'
            : 'Reset password'}
        </Typography>

        {error && (
          <Alert severity="error" className="login-form-message">
            {error}
          </Alert>
        )}

        {message && (
          <Alert severity="success" className="login-form-message">
            {message}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          className="login-form-form"
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className="login-form-submit-button"
            disabled={loading}
          >
            {loading
              ? 'Loading...'
              : mode === Mode.LOGIN_REGISTER
                ? isLogin
                  ? 'Login'
                  : 'Register'
                : 'Reset password'}
          </Button>
          {mode === Mode.LOGIN_REGISTER && (
            <Button
              fullWidth
              variant="text"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};
