// DescriptionAlerts.jsx
import React from 'react'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Stack from '@mui/material/Stack'

const StandardAlerts = ({ severity, content, close }) => {
    return (
        <Stack sx={{ width: '100%' }} spacing={2}>
            <Alert severity={severity} variant='outlined' onClose={close}>
                {content}
            </Alert>
        </Stack>
    )
}
export default StandardAlerts