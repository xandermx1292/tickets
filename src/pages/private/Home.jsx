import { useState, useEffect } from "react"
import { Container, Box, Typography, Paper, Switch, Grid, Button } from "@mui/material"
import FilterMenu from "../../utils/components/FilterMenu"
import api from "../../api"
import { ENDPOINTS, ROLE, STATES } from "../../utils/const"
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import EditTicketDialog from '../../layout/EditTicket'
import TicketInfoDialog from '../../layout/TicketInfoDialog'
import TicketActionDialog from '../../layout/TicketActionDialog'
import StandardAlerts from "../../utils/components/StandardAlert"
import TicketCard from '../../layout/TicketCard'

// Extensión de dayjs para manejo de zona horaria
dayjs.extend(utc)
dayjs.extend(timezone)

const Home = () => {
  // Rol del usuario que inició sesión extraído del local storage
  const userRoleId = localStorage.getItem("user")
  const roleId = JSON.parse(userRoleId)

  // Estado para controlar la tarjeta seleccionada y su dialogo
  const [selectedCard, setSelectedCard] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Tickets cargados desde la API
  const [tickets, setTickets] = useState([])

  // Filtros: categoría, estado y usuario
  const [categoryId, setCategoryId] = useState("")
  const [categoryFilter, setCategoryFilter] = useState([])

  const [stateId, setStateId] = useState("")
  const [stateFilter, setStateFilter] = useState([])

  const [userId, setUserId] = useState("")
  const [userFilter, setUserFilter] = useState([])

  // Orden por fecha (switch)
  const [checked, setChecked] = useState(false)

  // Filtro de operadores / admins
  const [operatorFilter, setOperatorFilter] = useState([])

  // Dialogo para edición de ticket
  const [open, setOpen] = useState(false)

  // Dialogo de acciones como finalizar, cancelar, etc.
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [actionType, setActionType] = useState("")
  const [currentTicket, setCurrentTicket] = useState(null)
  const [requireComment, setRequireComment] = useState(false)

  // Estado para la alerta visual
  const [showAlert, setShowAlert] = useState({
    open: false,
    severity: 'success',
    content: 'exito',
    vertical: 'top',
    horizontal: 'center'
  })

  // Restablece los filtros a sus valores por defecto
  const resetFilters = () => {
    setCategoryId(0)
    setStateId(0)
    setUserId(0)
    setChecked(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Manejo del switch de orden por fecha
  const handleChange = (event) => {
    setChecked(event.target.checked)
  }

  // Controla el estado del menú desplegable
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [openMenuId, setOpenMenuId] = useState(null)

  // Estado temporal para la edición de tickets
  const [editedTicket, setEditedTicket] = useState({
    category: "",
    state: "",
    operator: "",
    reason: ""
  })

  // Abre el menú correspondiente
  const handleMenuClick = (event, menuId) => {
    setMenuAnchor(event.currentTarget)
    setOpenMenuId(menuId)
  }

  // Cierra cualquier menú abierto
  const handleMenuClose = () => {
    setMenuAnchor(null)
    setOpenMenuId(null)
  }

  // Abre el dialog con la información del ticket
  const handleCardClick = (ticket) => {
    setSelectedCard(ticket)
    setDialogOpen(true)
  }

  // Cierra el dialog de detalle del ticket
  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelectedCard(null)
  }

  // Abre el dialogo para ejecutar una acción sobre un ticket
  const openActionDialog = (ticket, action, requiresComment) => {
    setCurrentTicket(ticket)
    setActionType(action)
    setRequireComment(requiresComment)
    setActionDialogOpen(true)
  }

  // Cierra el dialogo de acción
  const closeActionDialog = () => {
    setActionDialogOpen(false)
    setCurrentTicket(null)
    setActionType("")
    setRequireComment(false)
  }

  // Cierra el componente de alerta
  const handleCloseAlert = () => {
    setShowAlert(prev => ({ ...prev, open: false }))
  }

  // Confirma y ejecuta una acción sobre el ticket (finalizar, cancelar, etc.)
  const handleActionConfirm = async (comment) => {
    try {
      const update = {
        state_fk: null,
        comment: comment || null,
        end_date: null
      }

      // De ante mano pido perdon, a quién le toque mantener este código en el futuro, tiene que transformar este Switch en condicionales if, suerte!!! ♥
      // En mi defenza quería probar el Switch ☻ 
      switch (actionType) {
        case "Finalizar":
          update.state_fk = STATES.FINISHED
          update.end_date = dayjs().tz("America/Santiago").format()
          setShowAlert({
            open: true,
            severity: 'success',
            content: 'El Ticket ha Sido Finalizado',
            vertical:'bottom',
            horizontal:'right'
          })
          break
        case "Cancelar":
          update.state_fk = STATES.CANCELED
          update.end_date = dayjs().tz("America/Santiago").format()
          setShowAlert({
            open: true,
            severity: 'warning',
            content: 'El Ticket ha Sido Cancelado',
            vertical:'bottom',
            horizontal:'right'
          })
          break
        case "Rechazar":
          update.state_fk = STATES.REFUSED
          update.end_date = dayjs().tz("America/Santiago").format()
          setShowAlert({
            open: true,
            severity: 'warning',
            content: 'El Ticket ha Sido Rechazado',
            vertical:'bottom',
            horizontal:'right'
          })
          break
        case "Tomar":
          update.state_fk = STATES.ASSIGNED
          update.operator_fk = roleId.roleId
          setShowAlert({
            open: true,
            severity: 'info',
            content: 'El Ticket ha Sido Tomado',
            vertical:'bottom',
            horizontal:'right'
          })
          break
        default:
          break
      }

      // Se actualiza el ticket vía API y se recarga la lista
      await api.patch(ENDPOINTS.UPDATE_TICKET + currentTicket.id, update)
      await fetchTickets()
    } catch (error) {
      console.error(`Error al realizar la acción: ${actionType}`, error)
    } finally {
      closeActionDialog()
    }
  }

  // Abre el formulario para editar el ticket seleccionado
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

  // Cierra el formulario de edición
  const handleClose = () => {
    setOpen(false)
  }

  // Obtiene los filtros desde la API al cargar el componente
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await api.get(ENDPOINTS.GET_CATEGORIES, { params: { offset: 0, limit: 100 } })
        const _response = await api.get(ENDPOINTS.GET_STATES, { params: { offset: 0, limit: 100 } })
        const __response = await api.get(ENDPOINTS.GET_USERS, { params: { offset: 0, limit: 100 } })
        const ___response = await api.get(ENDPOINTS.GET_USERS_BY_ROLE + roleId.roleId, { params: { offset: 0, limit: 100 } })
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

  // Carga los tickets según los filtros seleccionados
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

  // Se ejecuta cada vez que cambian los filtros
  useEffect(() => {
    fetchTickets()
  }, [categoryId, stateId, userId, checked])

  // Render del componente principal
  return (
    <Container>
      <Box sx={{ flexGrow: 1, mb: 1 }}>
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
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                selected={selectedCard?.id === ticket.id}
                roleId={roleId.roleId}
                onCardClick={handleCardClick}
                onEditClick={handleClickOpen}
                onActionClick={openActionDialog}
              />
            ))}

            {/* Dialog de edición de ticket */}
            {open && (
              <EditTicketDialog
                open={open}
                handleClose={handleClose}
                editedTicket={editedTicket}
                setEditedTicket={setEditedTicket}
                fetchTickets={fetchTickets}
                roleId={roleId}
                categoryFilter={categoryFilter}
                stateFilter={stateFilter}
                operatorFilter={operatorFilter}
              />
            )}

            {/* Dialog de información del ticket */}
            {dialogOpen && selectedCard && (
              <TicketInfoDialog
                open={dialogOpen}
                handleClose={handleCloseDialog}
                ticket={selectedCard}
              />
            )}

            {/* Dialog para acciones (finalizar, cancelar, etc.) */}
            <TicketActionDialog
              open={actionDialogOpen}
              handleClose={closeActionDialog}
              handleConfirm={handleActionConfirm}
              action={actionType}
              requireComment={requireComment}
            />

            {/* Alerta visual */}
            {showAlert && (
              <StandardAlerts
                severity={showAlert.severity}
                content={showAlert.content}
                open={showAlert.open}
                position={{ vertical: showAlert.vertical, horizontal: showAlert.horizontal }}
                handleClose={handleCloseAlert}
              />
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Home
