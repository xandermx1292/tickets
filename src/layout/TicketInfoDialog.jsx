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

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{`Información del Ticket #${ticket.id}`}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Typography><strong>Motivo:</strong> {ticket.reason}</Typography>
          <Typography><strong>Categoría:</strong> {ticket.categories?.category ?? ticket.category_fk}</Typography>
          <Typography><strong>Estado:</strong> {ticket.states?.state ?? ticket.state_fk}</Typography>
          <Typography><strong>Usuario:</strong> {ticket.users?.email ?? 'No asignado'}</Typography>
          <Typography><strong>Operador:</strong> {ticket.operators?.email ?? 'No asignado'}</Typography>
          <Typography><strong>Fecha de Inicio:</strong> {new Date(ticket.start_date).toLocaleString()}</Typography>
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
