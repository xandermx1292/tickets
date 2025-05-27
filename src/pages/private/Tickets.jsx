import React, { useEffect, useState } from "react"
import { Box, Paper, Button, Container, TextField, MenuItem, Typography, List, ListItem, ListItemText, Grid } from "@mui/material"
import api from "../../api"
import { ENDPOINTS, ROLE, STATES } from "../../utils/const"
import StandardAlerts from "../../utils/components/StandardAlert"
import axios from 'axios'


const Tickets = () => {
    // Estado del select de las categorías
    const [categories, setCategories] = useState([])
    const [categoryId, setCategoryId] = useState("")
    // Estado de los usuarios
    const [users, setUsers] = useState([])
    const [userId, setUserId] = useState("")
    // Estado de los operadores
    const [operator, setOperator] = useState([])
    const [operatorId, setOperatorId] = useState("")
    // Estado de la descripción de el ticket
    const [description, setDescription] = useState("")
    // Estado para el usuario que inició sesión
    const userRoleId = localStorage.getItem("user")
    const roleId = JSON.parse(userRoleId)
    // Estado de la alerta
    const [showAlert, setShowAlert] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'center'
    })
    // Maneja el cierre de la alerta de forma manual
    const handleCloseAlert = () => {
        setShowAlert(prev => ({ ...prev, open: false }))
    }
    // Llamada a las APIs (FastApi) que recogen las categorías y operadores (admins) para el formulario de ingreso del Ticket
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get(ENDPOINTS.GET_CATEGORIES, { params: { offset: 0, limit: 100 } }) // obtiene las categorías con un rango de 0 a 100
                const _response = await api.get(ENDPOINTS.GET_USERS_BY_ROLE + ROLE.ADMIN) // obiene a todos los usuarios con el rol administrador
                setCategories(response.data) // guardar la información de las categorías
                setOperator(_response.data) // guardar la informacion de los operador

            } catch (error) {
                console.error("Error al obtener las categorías:", error)
            }
        }
        fetchCategories()
    }, [])

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token")
                axios.get(ENDPOINTS.USERS_ACTIVE, { headers: { Authorization: token } // Esta es la consulta a la API que obtiene a todos los usuarios (Express.js)
                // Promesa que se cumple al hacer la llamada a la API
                }).then((response) => {
                    const { status, data } = response // guardamos el status y la información de la respuesta
                    const { users } = data // desestructuración de la respuesta
                    if (status === 200) {
                        setUsers(users) // guardar a los usuarios de la respuesta
                    } else if (status === 401) {
                        // Esto debería rederigir al login si el token expira, pero como las APIs están mescladas, no realiza el comportamiento esperado
                        localStorage.removeItem("token")
                        localStorage.removeItem("user")
                        setAuth({ token: null })
                    } else {
                        alert("Error del servidor")
                    }
                })

            } catch (error) {
                console.error("Error al obtener los usuarios por el estado:", error)
            }
        }
        fetchUsers()
    }, [])

    // Esta función ingresa el ticket con los datos ingresados en el formulario, consume la API (FastApi) para crear los tickets
    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            // Api para ingresar los Tikcets
            api.post(ENDPOINTS.CREATE_TICKET, {
                user_fk: userId ? userId : roleId.id,
                operator_fk: operatorId ? operatorId : null,
                reason: description,
                state_fk: roleId.roleId === ROLE.ADMIN ? STATES.ASSIGNED : null, // Aquí se deja condicionalmente 2 ya que se ingresa por defecto desde el backEnd como Requested, puedes mantener esta lógica en tu backen de express o validar qué usuario está ingresando el ticket
                category_fk: categoryId

            }).then((response) => {
                const { status, data } = response
                // dependiendo del estatus de la respuesta generamos la alerta, faltan casos
                if (status === 200) {
                    setShowAlert({
                        open: true,
                        vertical: 'bottom',
                        horizontal: 'right'
                    })
                    console.log(response.data)
                }
            })

        } catch (error) {
            console.error("Error al enviar la solicitud:", error.response ? error.response.data : error.message)
        }
    }

    // Encuentra la categoría seleccionada para mostrar sus resúmenes
    const selectedCategory = categories.find(cat => cat.id === parseInt(categoryId))

    return (
        // Falta mejorar mucho esta vista, espero no te tome mucho ♥ (Esto se hace con alt + 3 en el teclado numerico ♥) 
        <Container maxWidth="lg">
            <Paper elevation={10} sx={{ marginTop: 8, padding: 2, mb: 1 }}>
                <Box component="form" onSubmit={handleSubmit} sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}> 
                        <Grid size={{ xs: 12, md: 5 }}> {/* Este es el select de la categoría del Ticket */}
                            <TextField
                                id="categorySelect"
                                name="category"
                                select
                                label="Categoria"
                                value={categoryId}
                                required
                                helperText="Seleccione la categoria de su petición"
                                sx={{ width: '100%' }}
                                onChange={(e) => setCategoryId(e.target.value)}
                            >
                                {categories.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.category}
                                    </MenuItem>
                                ))}
                            </TextField>
                            {/* Si el rol del usuario es administrador */} {/* Este es el select de los usuarios al que se le crea el Ticket*/}
                            {roleId.roleId === ROLE.ADMIN &&
                                <TextField
                                    id="userSelect"
                                    name="user"
                                    select
                                    label="Usuario"
                                    value={userId}
                                    required
                                    helperText="Usuario solicitante del ticket "
                                    sx={{ width: '100%' }}
                                    onChange={(e) => setUserId(e.target.value)}
                                >
                                    {users.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.name} {option.lastName}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            }
                            {/* Si el rol del usuario es administrador */} {/* Este es el select de los usuarios al que se le crea el Ticket*/}
                            {roleId.roleId === ROLE.ADMIN &&
                                <TextField
                                    id="operator-Select"
                                    name="operator"
                                    select
                                    label="Operador"
                                    value={operatorId}
                                    helperText="Operador que se le asigna el ticket"
                                    sx={{ width: '100%' }}
                                    onChange={(e) => setOperatorId(e.target.value)}
                                >
                                    {operator.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.email}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            }
                        </Grid>
                        <Grid size={{ xs: 12, md: 7 }} sx={{ textAlign: 'center' }}>
                            <Typography component="h1" variant="h5">
                                Resumen de la categoria
                            </Typography>
                            <List dense sx={{ display: 'inline-block' }}>
                                {selectedCategory?.summaries?.map((summary) => (
                                    <ListItem key={summary.id}>
                                        <ListItemText primary={summary.summary} />
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                    </Grid>
                    {/* Este es el campo que recibe el motivo por el cual se solicita el Ticket */}
                    <Grid size={12}>
                        <TextField
                            required
                            id="ticketReason"
                            name="reason"
                            label="Descripción"
                            value={description}
                            helperText="Ingrese una breve descripción de su problema"
                            fullWidth
                            multiline
                            slotProps={{ htmlInput: { maxLength: 150 } }}
                            rows={3}
                            sx={{ mt: 2 }}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Grid>
                    {/* Boton que guarda el Ticket */}
                    <Grid size={12}>
                        <Button type="submit" variant="contained" sx={{ display: "block", margin: "20px auto" }}>
                            Ingresar Ticket
                        </Button>

                    </Grid>
                </Box>
            </Paper>
            {
                // LLamado condicionar para el Alert (Componente externo)
                showAlert && (
                    <StandardAlerts
                        severity="success"
                        content="El ticket ha sido ingresado correctamente"
                        open={showAlert.open}
                        position={{ vertical: showAlert.vertical, horizontal: showAlert.horizontal }}
                        handleClose={handleCloseAlert}
                    />
                )
            }
        </Container>
    )
}

export default Tickets