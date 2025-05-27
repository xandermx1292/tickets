import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Grid,
  Divider,
  Button,
  Stack,
  useMediaQuery,
  useTheme
} from "@mui/material"
import { STATES, ROLE } from "../utils/const"

// Este es el ticket que se visualiza en pantalla 
// quedó pendiente la responsividad y mejoras en el diseño

// El Ticket maneja mucha lógica que esta fuera de este archivo y se le pasa como argumento a la llamada del Ticket, esto no sería lo ideal, ya que si se quiere usar el ticket en tra parte
// tendría que replicar dicha lógica, una opción es mover toda esta lógica al ticket, eso queda a criterio de a que se quiera llegar con la visualización de los tickets
const TicketCard = ({
  ticket,
  selectedCard,
  roleId,
  onCardClick,
  onEditClick,
  onActionClick
}) => {
  
  // Estos Hooks propios de material UI escucha las coincidencias con una consulta de medios CSS.
  // Estos los iba a utilizar para el diseño esponsivo del ticket
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  
  return (
    <Card variant="outlined" key={ticket.id} sx={{ mb: 1, width: "100%" }} elevation={4}>
      <CardActionArea
        onClick={() => onCardClick(ticket)}
        data-active={selectedCard?.id === ticket.id ? '' : undefined}
        component="div"
        sx={{
          height: '100%',
          '&[data-active]': {
            backgroundColor: 'action.selected',
            '&:hover': {
              backgroundColor: 'action.selectedHover'
            }
          }
        }}
      >
        <CardContent>
          <Grid container spacing={2}>
            <Grid container size={9} columns={12}>
              <Grid size={{ sx: 12, sm: 5 }}>
                <Typography variant="h6"> {/* Texto del ID */}
                  {`Ticket #${ticket.id}`}
                </Typography>
              </Grid>
              <Grid size={{ sx: 0, md: 'grow' }} />
              <Grid size={{ sx: 12, sm: 5 }}>
                <Typography variant="caption"> {/* Texto del usuario, se renderiza condicionalmente si es un usuario o admin el que inició sesión */}
                  {roleId === ROLE.ADMIN
                    ? `Usuario: ${ticket?.users?.email ?? "usuario no asociado"}`
                    : `Operador: ${ticket?.operators?.email ?? "usuario no asociado"}`}
                </Typography>
              </Grid>
              <Grid size={{ sx: 12, sm: 5 }}>
                <Typography variant="caption"> {/* Texto del Estado del ticket */}
                  {`Estado: ${ticket.states?.state ?? ticket.state_fk}`}
                </Typography>
              </Grid>
              <Grid size={{ sx: 0, md: 'grow' }} />
              <Grid size={{ sx: 12, sm: 5 }}>
                <Typography variant="caption"> {/* Texto de la categoría del Ticket */}
                  {`Categoría: ${ticket.categories?.category ?? ticket.state_fk}`}
                </Typography>
              </Grid>
              <Grid size={{ sx: 12, sm: 5 }}>
                <Typography noWrap variant="body2"> {/* Texto del motivo por el cual se solicita el Ticket */}
                  {`Motivo: ${ticket.reason}`}
                </Typography>
              </Grid>
              <Grid size={{ sx: 0, md: 'grow' }} />
              <Grid size={{ sx: 12, sm: 5 }}>
                <Typography noWrap variant="body2"> {/* Texto del comentario del Ticket ingresado por quin finaliza, rechaza o cancela un ticket */}
                  {`Comentario: ${ticket?.comment ?? "Sin comentario"}`}
                </Typography>
              </Grid>
              <Grid size={{ sx: 12, sm: 5 }}>
                <Typography variant="caption"> {/* Texto de la fecha de inicio del Ticket */}
                  {`Fecha inicio: ${new Date(ticket.start_date).toLocaleString()}`}
                </Typography>
              </Grid>
              <Grid size={{ sx: 0, md: 'grow' }} />
              <Grid size={{ sx: 12, sm: 5 }}>
                {ticket.end_date && (
                  <Typography variant="caption"> {/* Texto de la fecha de termino de un ticket, solo se renderiza si ya ha sido finalizado el ticket (se puede cambiar facilmente) */}
                    {`Fecha de Termino: ${new Date(ticket.end_date).toLocaleString()}`}
                  </Typography>
                )}
              </Grid>
            </Grid>
             {/* Renderizado condicional del componente, en función del tamaño de la vista (no terminado) */}
            {!isSmallScreen && (                   
              <Grid size={{ sx: 0, md: 'grow' }}>
                <Divider aria-hidden="true" orientation="vertical" />
              </Grid>
            )}
            <Grid size={2}>  {/* Este Grid (componente) contiene los botones con las lógica de los Tickets */}
              {/* todos los botones se renderizan condicionalmente del usuario y en algunos casos del estado del ticket */}
              <Stack direction="column" gap={1} sx={{ height: '100%', justifyContent: 'space-around', aligs: 'stretch' }}>
                {/* si el rol es admin y el estado es solicitado */} {/* Tomar un Ticket */}
                {(roleId === ROLE.ADMIN && ticket?.state_fk === STATES.REQUESTED) && (
                  <Button variant="outlined" onClick={(e) => { e.stopPropagation(); onActionClick(ticket, "Tomar", false) }}>
                    Tomar
                  </Button>
                )}
                {/* si el rol es admin y el estado es asignado */} {/* Finalizar un ticket */}
                {(roleId === ROLE.ADMIN && ticket?.state_fk === STATES.ASSIGNED) && (
                  <Button variant="outlined" onClick={(e) => { e.stopPropagation(); onActionClick(ticket, "Finalizar", true) }}>
                    Finalizar
                  </Button>
                )}
                {/* si el estado es distinto de asignado */} {/* Editar un Ticket */}
                {/* también habilita o no el Boton en función de si es un usuario y el estado no es solicitado*/}
                {(ticket?.state_fk !== STATES.ASSIGNED) && (
                  <Button
                    disabled={roleId === ROLE.USER && (ticket?.state_fk !== STATES.REQUESTED)}
                    variant="outlined"
                    onClick={(e) => { e.stopPropagation(); onEditClick(ticket) }}
                  >
                    Editar
                  </Button>
                )}
                {/* si el estado es solicitado */} {/* rechazar o cancelar un ticket en función del rol del usuario */} 
                {(ticket?.state_fk === STATES.REQUESTED) && (
                  <Button
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation()
                      const label = roleId === ROLE.ADMIN ? "Rechazar" : "Cancelar"
                      onActionClick(ticket, label, true)
                    }}
                  >
                    {roleId === ROLE.ADMIN ? "Rechazar" : "Cancelar"}
                  </Button>
                )}
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default TicketCard
