import React, { useState, useEffect, memo } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    MenuItem,
    Button
} from '@mui/material'
import api from '../api'
import { ENDPOINTS, ROLE } from '../utils/const'

function EditTicketDialog({
    open,
    handleClose,
    editedTicket,
    setEditedTicket,
    fetchTickets,
    roleId,
    categoryFilter,
    stateFilter,
    operatorFilter
}) {
    // Estado local para el formulario
    const [localTicket, setLocalTicket] = useState({
        category: '',
        state: '',
        operator: '',
        reason: ''
    })

    // Se sincroniza cuando se abre el diálogo
    useEffect(() => {
        if (open && editedTicket) {
            setLocalTicket({
                category: editedTicket.category || '',
                state: editedTicket.state || '',
                operator: editedTicket.operator || '',
                reason: editedTicket.reason || ''
            })
        }
    }, [open, editedTicket])

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            // Solo actualiza el estado padre cuando se envía
            const updatedTicket = {
                ...editedTicket,
                category: localTicket.category,
                state: localTicket.state,
                operator: localTicket.operator,
                reason: localTicket.reason
            }
            setEditedTicket(updatedTicket)

            const payload = {
                reason: localTicket.reason,
                category_fk: localTicket.category || editedTicket.category,
            }

            // Solo los admins pueden cambiar estado y operador
            if (roleId.roleId === ROLE.ADMIN) {
                payload.state_fk = localTicket.state || editedTicket.state
                payload.operator_fk = localTicket.operator || editedTicket.operator
            }

            await api.patch(`${ENDPOINTS.UPDATE_TICKET}${editedTicket?.id}`, payload)
            await fetchTickets()
        } catch (error) {
            console.error("Error finalizando el ticket:", error)
        }
        handleClose()
    }
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            slotProps={{
                paper: {
                    component: 'form',
                    onSubmit: handleSubmit,
                },
            }}
        >
            <DialogTitle>Seleccione los cambios que quiera realizar</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    No altere campos que no quiera modificar
                </DialogContentText>

                <TextField
                    id="category-select"
                    name="category"
                    select
                    fullWidth
                    label="Categoría"
                    value={localTicket.category}
                    onChange={(e) =>
                        setLocalTicket({ ...localTicket, category: e.target.value })
                    }
                    helperText="Seleccione la nueva categoría"
                    margin="dense"
                >
                    {categoryFilter.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                            {option.category}
                        </MenuItem>
                    ))}
                </TextField>

                {roleId.roleId === ROLE.ADMIN && (
                    <TextField
                        id="state-select"
                        name="state"
                        select
                        fullWidth
                        label="Estado"
                        value={localTicket.state}
                        onChange={(e) =>
                            setLocalTicket({ ...localTicket, state: e.target.value })
                        }
                        helperText="Seleccione el nuevo estado"
                        margin="dense"
                    >
                        {stateFilter.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.state}
                            </MenuItem>
                        ))}
                    </TextField>
                )}
                {roleId.roleId === ROLE.ADMIN && (
                    <TextField
                        id="admin-select"
                        name="operador"
                        select
                        fullWidth
                        label="Operador"
                        value={localTicket.operator}
                        onChange={(e) =>
                            setLocalTicket({ ...localTicket, operator: e.target.value })
                        }
                        helperText="Seleccione el operador del ticket"
                        margin="dense"
                    >
                        {operatorFilter.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.email}
                            </MenuItem>
                        ))}
                    </TextField>
                )}
                <TextField
                    autoFocus
                    margin="dense"
                    id="reason-edit"
                    name="reason"
                    label="Motivo del ticket"
                    type="text"
                    fullWidth
                    required
                    value={localTicket.reason}
                    onChange={(e) =>
                        setLocalTicket({ ...localTicket, reason: e.target.value })
                    }
                    variant="standard"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button type="submit">Guardar</Button>
            </DialogActions>
        </Dialog>
    )
}

export default memo(EditTicketDialog)
