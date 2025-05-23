import { useState, useEffect } from "react"
import { Container, Box, Card, CardActionArea, CardContent, Typography, Paper, Switch, Grid, Button, Divider, Stack, Badge } from "@mui/material"
import FilterMenu from "../../utils/components/FilterMenu"
import api from "../../api"
import { ENDPOINTS, ROLE, STATES } from "../../utils/const"
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import EditTicketDialog from '../../layout/EditTicket'
import TicketInfoDialog from '../../layout/TicketInfoDialog'
import TicketActionDialog from '../../layout/TicketActionDialog'

dayjs.extend(utc)
dayjs.extend(timezone)

const Home = () => {

  const userRoleId = localStorage.getItem("user")
  const roleId = JSON.parse(userRoleId)

  // Estado de los Cards
  const [selectedCard, setSelectedCard] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Estado para el contenido de los tickets
  const [tickets, setTickets] = useState([])

  // Estado de las categorías
  const [categoryId, setCategoryId] = useState("")
  const [categoryFilter, setCategoryFilter] = useState([])

  // Estado de los estados
  const [stateId, setStateId] = useState("")
  const [stateFilter, setStateFilter] = useState([])

  // Estado de los usuarios
  const [userId, setUserId] = useState("")
  const [userFilter, setUserFilter] = useState([])

  // Estado del swith que cambia el orden de las fechas
  const [checked, setChecked] = useState(false)

  // Estado de los operador / admins
  const [operatorFilter, setOperatorFilter] = useState([])

  // Estado del dialog emergente para el formulario del edit
  const [open, setOpen] = useState(false)

  //  Maneja el estado apra abrir o cerrar el dialog de confirmación
  const [actionDialogOpen, setActionDialogOpen] = useState(false)

  // Maneja el tipo de acccion que se quiera tomar 
  const [actionType, setActionType] = useState("")

  // Maneja el estado del ticket actual
  const [currentTicket, setCurrentTicket] = useState(null)

  const [requireComment, setRequireComment] = useState(false)

  // Lógica para restablecer los filtros
  const resetFilters = () => {
    setCategoryId(0)
    setStateId(0)
    setUserId(0)
    setChecked(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // logica para el cambio de las fechas
  const handleChange = (event) => {
    setChecked(event.target.checked)
  }

  // Lógica de los menús  
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [openMenuId, setOpenMenuId] = useState(null)

  // Estado del edit de los tickets
  const [editedTicket, setEditedTicket] = useState({
    category: "",
    state: "",
    operator: "",
    reason: ""
  })

  const handleMenuClick = (event, menuId) => {
    setMenuAnchor(event.currentTarget)
    setOpenMenuId(menuId)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
    setOpenMenuId(null)
  }

  // maneja el estado de la apertura de lar cards
  const handleCardClick = (ticket) => {
    setSelectedCard(ticket)
    setDialogOpen(true)
  }
  // Maneja el cierre del dialogo que tiene la informacion de la card
  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelectedCard(null)
  }

  // manejadores para abrir y cerrar el dialog de los comentarios
  const openActionDialog = (ticket, action, requiresComment) => {
    setCurrentTicket(ticket)
    setActionType(action)
    setRequireComment(requiresComment)
    setActionDialogOpen(true)
  }

  const closeActionDialog = () => {
    setActionDialogOpen(false)
    setCurrentTicket(null)
    setActionType("")
    setRequireComment(false)
  }

  const handleActionConfirm = async (comment) => {
    try {
      const update = {
        state_fk: null,
        comment: comment || null,
        end_date: null
      }
      switch (actionType) {
        case "Finalizar":
          update.state_fk = STATES.FINISHED
          update.end_date = dayjs().tz("America/Santiago").format()
          break
        case "Cancelar":
          update.state_fk = STATES.CANCELED
          update.end_date = dayjs().tz("America/Santiago").format()
          break
        case "Rechazar":
          update.state_fk = STATES.REFUSED
          update.end_date = dayjs().tz("America/Santiago").format()
          break
        case "Tomar":
          update.state_fk = STATES.ASSIGNED
          update.operator_fk = roleId.roleId
          break
        default:
          break
      }
      await api.patch(ENDPOINTS.UPDATE_TICKET + currentTicket.id, update)
      await fetchTickets()
    } catch (error) {
      console.error(`Error al realizar la acción: ${actionType}`, error)
    } finally {
      closeActionDialog()
    }
  }

  const handleClickOpen = (ticket) => {
    setEditedTicket({
      id: ticket.id || null,
      reason: ticket.reason || null,
      category: ticket.category_fk || null,
      state: ticket.state_fk || null,
      operator: ticket.operator_fk || null
    })
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        // Consumo de la API para obtener las categorias
        const response = await api.get(ENDPOINTS.GET_CATEGORIES, {
          params: {
            offset: 0,
            limit: 100,
          }
        }
        )
        // Consumo de la API para obtener los estados
        const _response = await api.get(ENDPOINTS.GET_STATES,
          {
            params: {
              offset: 0,
              limit: 100,
            }
          }
        )
        // Consumo de la API para obtener a los usuarios 
        const __response = await api.get(ENDPOINTS.GET_USERS,
          {
            params: {
              offset: 0,
              limit: 100,
            }
          }
        )
        // Consumo de la API para obtener a los operadores / administradores
        const ___response = await api.get(ENDPOINTS.GET_USERS_BY_ROLE + roleId.roleId,
          {
            params: {
              offset: 0,
              limit: 100,
            }
          }
        )
        setCategoryFilter(response.data)
        setStateFilter(_response.data)
        setUserFilter(__response.data)
        setOperatorFilter(___response.data)
      } catch (error) {
        console.error("Error al obtener los filtros:", error)
      }
    }
    fetchFilters()
  }, [])
  const fetchTickets = async () => {
    try {

      const response = await api.get(ENDPOINTS.GET_TICKETS, {
        params: {
          offset: 0,
          limit: 100,
          category_fk: categoryId ? categoryId : 0,
          state_fk: stateId ? stateId : STATES.REQUESTED,
          user_fk: userId ? userId : (roleId.roleId === ROLE.USER ? roleId.id : 0),
          order_by_date: checked
        }
      })
      setTickets(response.data)

    } catch (error) {
      console.error("Error al obtener las solicitudes:", error)
    }
  }
  useEffect(() => {
    fetchTickets()
  }, [categoryId, stateId, userId, checked])
  return (
    <Container sx={{}}>
      <Box>
        <Grid container>
          <Grid size={{ xs: 3, md: 1.5 }}>
            <Typography variant="h6" color="inherit" component="div" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              FILTROS
            </Typography>
          </Grid>
          <Grid size={{ xs: 3, md: 1.5 }} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <FilterMenu label="Categoría" menuId="category" menuAnchor={menuAnchor} openMenuId={openMenuId} handleMenuClick={handleMenuClick} handleMenuClose={handleMenuClose} options={categoryFilter} onSelect={setCategoryId} getLabel={(option) => option.category} />
          </Grid>
          <Grid size={{ xs: 3, md: 1.5 }} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <FilterMenu label="Estado" menuId="state" menuAnchor={menuAnchor} openMenuId={openMenuId} handleMenuClick={handleMenuClick} handleMenuClose={handleMenuClose} options={stateFilter} onSelect={setStateId} getLabel={(option) => option.state} />
          </Grid>
          {roleId.roleId === ROLE.ADMIN && (
            <Grid size={{ xs: 3, md: 1.5 }} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <FilterMenu label="Usuarios" menuId="user" menuAnchor={menuAnchor} openMenuId={openMenuId} handleMenuClick={handleMenuClick} handleMenuClose={handleMenuClose} options={userFilter} onSelect={setUserId} getLabel={(option) => option.email} />
            </Grid>
          )}
          <Grid size={{ xs: 3, md: 1.5 }} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Switch checked={checked} onChange={handleChange} slotProps={{ 'aria-label': 'controlled' }} />
          </Grid>
          <Grid size={{ xs: 3, md: 1.5 }} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button variant="contained" onClick={resetFilters}>
              Restablece
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Grid container>
        <Grid size={{ sx: 12, md: 9 }}>
          <Paper sx={{ p: 2 }}>
            {tickets.map((ticket) => (
              <Card variant="outlined" key={ticket.id} sx={{ mb: 1, width: "100%" }} elevation={4} >
                <CardActionArea
                  onClick={() => handleCardClick(ticket)}
                  data-active={selectedCard?.id === ticket.id ? '' : undefined} component="div" sx={{ height: '100%', '&[data-active]': { backgroundColor: 'action.selected', '&:hover': { backgroundColor: 'action.selectedHover' } } }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid container size={9} columns={12}>
                        <Grid size={5}>
                          <Typography variant="h6" component="div">
                            {`Ticket #${ticket.id}`}
                          </Typography>
                        </Grid>
                        <Grid size={"grow"} />
                        <Grid size={5}>
                          <Typography variant="caption" component="div">
                            {roleId.roleId === ROLE.ADMIN ? `Usuario: ${ticket?.users?.email ?? "usuario no asociado"}` : `Operador: ${ticket?.operators?.email ?? "usuario no asociado"}`}
                          </Typography>
                        </Grid>
                        <Grid size={5}>
                          <Typography variant="caption" display="block">
                            {`Estado: ${ticket.states?.state ?? ticket.state_fk}`}
                          </Typography>
                        </Grid>
                        <Grid size={"grow"} />
                        <Grid size={5}>
                          <Typography variant="caption" display="block">
                            {`Categoría: ${ticket.categories?.category ?? ticket.state_fk}`}
                          </Typography>
                        </Grid>
                        <Grid size={5}>
                          <Typography noWrap={true} variant="body2">
                            {`Motivo: ${ticket.reason}`}
                          </Typography>
                        </Grid>
                        <Grid size={"grow"} />
                        <Grid size={5}>
                          <Typography noWrap={true} variant="body2">
                            {`Comentario: ${ticket?.comment ?? ""}`}
                          </Typography>
                        </Grid>
                        <Grid size={5}>
                          <Typography variant="caption" display="block">
                            {`Fecha inicio: ${new Date(ticket.start_date).toLocaleString()}`}
                          </Typography>
                        </Grid>
                        <Grid size={"grow"} />
                        <Grid size={5}>
                          {ticket.end_date && (
                            <Typography variant="caption" display="block">
                              {`Fecha de Termino: ${new Date(ticket.end_date).toLocaleString()}`}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                      <Grid size={1}>
                        <Divider orientation="vertical" />
                      </Grid>
                      <Grid size={2}>
                        <Stack direction="column" gap={1} sx={{ height: '100%', justifyContent: 'space-around', alignItems: 'stretch' }}>

                          {(roleId.roleId === ROLE.ADMIN && ticket?.state_fk === STATES.REQUESTED) &&
                            <Button variant="outlined" onClick={(e) => (e.stopPropagation(), openActionDialog(ticket, "Tomar", false))}>
                              Tomar
                            </Button>
                          }
                          {(roleId.roleId === ROLE.ADMIN && ticket?.state_fk === STATES.ASSIGNED) &&
                            // Se vizualiza el Botón Finalizar si el rol es administrador y el estado es asignado
                            <Button variant="outlined" onClick={(e) => (e.stopPropagation(), openActionDialog(ticket, "Finalizar", true))}>
                              Finalizar
                            </Button>
                          }
                          {(ticket?.state_fk !== STATES.ASSIGNED) &&
                            // Se vizualiza el Botón editar si el rol es administrador y el estado es solicitado
                            <Button disabled={roleId.roleId === ROLE.USER && (ticket?.state_fk !== STATES.REQUESTED)} variant="outlined" onClick={(e) => (e.stopPropagation(), handleClickOpen(ticket))}>
                              Editar
                            </Button>
                          }
                          {(ticket?.state_fk === STATES.REQUESTED) &&
                            <Button variant="outlined" onClick={(e) => { e.stopPropagation(); const label = roleId.roleId === ROLE.ADMIN ? "Rechazar" : "Cancelar"; openActionDialog(ticket, label, true) }}>
                              {roleId.roleId === ROLE.ADMIN ? "Rechazar" : "Cancelar"}
                            </Button>
                          }
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
            {open && (
              <EditTicketDialog open={open} handleClose={handleClose} editedTicket={editedTicket} setEditedTicket={setEditedTicket} fetchTickets={fetchTickets} roleId={roleId} categoryFilter={categoryFilter} stateFilter={stateFilter} operatorFilter={operatorFilter} />
            )}
            {dialogOpen && selectedCard && (
              <TicketInfoDialog
                open={dialogOpen}
                handleClose={handleCloseDialog}
                ticket={selectedCard}
              />
            )}
            <TicketActionDialog
              open={actionDialogOpen}
              handleClose={closeActionDialog}
              handleConfirm={handleActionConfirm}
              action={actionType}
              requireComment={requireComment}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Home