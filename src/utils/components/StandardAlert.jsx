import React from 'react'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import Snackbar from '@mui/material/Snackbar'

const StandardAlerts = ({ severity, content, open, position, handleClose }) => {
    // Esta es una Alert mesclada con un SnackBar, este ejemplo esta en la misma documentación de material UI
    // Es un componente reutilizable usado en "Ticket.jsx" y "Home.jsx"
    return (
        <Stack sx={{ width: '100%' }} spacing={2}>
            <Snackbar
                anchorOrigin={position}
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
            >
                <Alert
                    severity={severity}
                    variant='outlined'
                    onClose={handleClose}
                >
                    {content}
                </Alert>
            </Snackbar>
        </Stack>
    )
}

export default StandardAlerts
