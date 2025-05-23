import React, { useState, useContext, useEffect } from "react"
import { Avatar, Box, Button, Container, FormControlLabel, Paper, TextField, Typography, Grid, Link } from "@mui/material"
import LockOutlineIcon from "@mui/icons-material/LockOutlined"
import { CheckBox } from "@mui/icons-material"
import { useNavigate, Link as RouterLink } from "react-router-dom"
import axios from 'axios'
import { AuthContext } from "../../context/AuthProvider"
import { ENDPOINTS, ROUTES } from "../../utils/const"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { auth, setAuth } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (auth.token) {
      navigate(ROUTES.HOME, { replace: true });
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const response = await axios.post(ENDPOINTS.LOGIN_AUTH, {
        email,
        password
      })

      //Guardo el token y el usuario en las variable de contexto Auth
      setAuth({
        token: response.data.token,
        user: response.data.user
      })

      // Guardo el token en el local storage
      localStorage.setItem("token", response.data.token)

      // Solución temporal guardar el usuario completo en el local storage  
      localStorage.setItem("user", JSON.stringify(response.data.user))

    } catch (error) {
      console.error("Error en el login:", error.response ? error.response.data : error.message)
    }
  }

  return (
    <Container maxWidth="xs">
      <Paper elevation={10} sx={{ marginTop: 8, padding: 2 }}>
        <Avatar sx={{
          mx: 'auto',
          bgcolor: 'secondary.main',
          textAlign: 'center',
          mb: 1
        }}>
          <LockOutlineIcon />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ textAlign: "center" }}>
          Sesión de Usuario
        </Typography>

        <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            id="email-fiel"
            name="email-field"
            placeholder="Ingrese su Correo Electrónico"
            fullWidth required
            autoFocus sx={{ mb: 2 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            id="password-field"
            name="password-field"
            placeholder="Ingrese su Contraseña"
            fullWidth required
            type="password"
            sx={{ mb: 2 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <FormControlLabel control={<CheckBox value="remember" color="primary" />} label="Recordarme" />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 1 }}>
            Iniciar Sesión
          </Button>
        </Box>

        <Grid container justifyContent="space-between" sx={{ mt: 1 }}>
          <Grid>
            <Link component={RouterLink} to='/signup'>
              Registrarse
            </Link>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}

export default Login
