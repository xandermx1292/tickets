import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from "@mui/material"
import { useState } from "react"
import { Form } from "react-router"

const TicketActionDialog = ({ open, handleClose, handleConfirm, action, requireComment }) => {
  const [comment, setComment] = useState("")
  const onConfirm = (event) => {
    event.preventDefault()
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
        <form id="id-confirmation" onSubmit={onConfirm}>
        {requireComment && (
          <TextField
          autoFocus
          margin="dense"
          label="Comentario"
          fullWidth
          variant="outlined"
          multiline
          required
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          />
        )}
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button type="submit" form="id-confirmation" variant="contained">Confirmar</Button>
      </DialogActions>
    </Dialog>
  )
}

export default TicketActionDialog