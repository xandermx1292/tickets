import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from "@mui/material"
import { useState } from "react"

const TicketActionDialog = ({ open, handleClose, handleConfirm, action, requireComment }) => {
  const [comment, setComment] = useState("")

  const onConfirm = () => {
    handleConfirm(comment)
    setComment("") // Resetear después de enviar
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Confirmación</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {`¿Estás seguro que deseas ${action.toLowerCase()} este ticket?`}
        </DialogContentText>
        {requireComment && (
          <TextField
            autoFocus
            margin="dense"
            label="Comentario"
            fullWidth
            variant="outlined"
            multiline
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={onConfirm} variant="contained">Confirmar</Button>
      </DialogActions>
    </Dialog>
  )
}

export default TicketActionDialog