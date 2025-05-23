import React, { useEffect, useState } from "react"
import { Box, Paper, Button, Container, TextField, MenuItem, Typography, List, ListItem, ListItemText, Grid } from "@mui/material"
import api from "../../api"
import { ENDPOINTS, ROLE } from "../../utils/const"
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
    const [showAlert, setShowAlert] = useState(false)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get(ENDPOINTS.GET_CATEGORIES, {
                    params: {
                        offset: 0,
                        limit: 100,
                    }
                })

                const _response = await api.get(ENDPOINTS.GET_USERS_BY_ROLE + 1)
                setCategories(response.data)
                setOperator(_response.data)

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
                axios.get(ENDPOINTS.USERS_ACTIVE, {
                    headers: {
                        Authorization: token
                    }
                }).then((response) => {
                    const { status, data } = response
                    const { users } = data
                    if (status === 200) {
                        setUsers(users)
                    }
                })

            } catch (error) {
                console.error("Error al obtener los usuarios por el estado:", error)
            }
        }
        fetchUsers()
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            api.post(ENDPOINTS.CREATE_TICKET, {
                user_fk: userId ? userId : roleId.id,
                operator_fk: operatorId ? operatorId : null,
                reason: description,
                category_fk: categoryId

            }).then((response) => {
                const { status, data } = response
                if (status === 200) {
                    setShowAlert(true)
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
        <Container maxWidth="lg">
            <Paper elevation={10} sx={{ marginTop: 8, padding: 2, mb: 1 }}>
                <Box component="form" onSubmit={handleSubmit} sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 5 }}>

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
                            rows={6}
                            sx={{ mt: 2 }}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Grid>
                    <Grid size={12}>
                        <Button type="submit" variant="contained" sx={{ display: "block", margin: "20px auto" }}>
                            Ingresar Ticket
                        </Button>

                    </Grid>
                </Box>
            </Paper>
            {
                showAlert && (
                    <StandardAlerts
                        severity="success"
                        content="El ticket a sidó ingresado correctamente"
                        close={() => setShowAlert(false)}
                    />
                )
            }
        </Container>
    )
}

export default Tickets