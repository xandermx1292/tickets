import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Stack
} from '@mui/material'

const TicketInfoDialog = ({ open, handleClose, ticket }) => {
  if (!ticket) return null
// El TICKET INFO se ve al momento de presionar el ticket, es otra forma de visualizar la información del ticket seleccionado 
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{`Información del Ticket #${ticket.id}`}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Typography><strong>Motivo:</strong> {ticket.reason}</Typography>                                          {/* Motivo del Ticket*/}
          <Typography><strong>Comentario:</strong> {ticket.comment ?? "Sin comentario"}</Typography>                 {/* Comentario del Ticket*/}
          <Typography><strong>Categoría:</strong> {ticket.categories?.category ?? ticket.category_fk}</Typography>   {/* Categoría del Ticket*/}
          <Typography><strong>Estado:</strong> {ticket.states?.state ?? ticket.state_fk}</Typography>                {/* Estado del Ticket*/}
          <Typography><strong>Usuario:</strong> {ticket.users?.email ?? 'No asignado'}</Typography>                  {/* Usuario del Ticket*/}
          <Typography><strong>Operador:</strong> {ticket.operators?.email ?? 'No asignado'}</Typography>             {/* Operador del Ticket*/}
          <Typography><strong>Fecha de Inicio:</strong> {new Date(ticket.start_date).toLocaleString()}</Typography>  {/* Fecha de inicio del Ticket*/}
          {ticket.end_date && (
            <Typography><strong>Fecha de Término:</strong> {new Date(ticket.end_date).toLocaleString()}</Typography> 
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained">Cerrar</Button>
      </DialogActions>
    </Dialog>
  )
}

export default TicketInfoDialog
