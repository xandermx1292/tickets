import React from "react"
import { AppRouter } from "./AppRouter"
import { AuthProvider } from "./context/AuthProvider"
import { ThemeProvider, createTheme } from '@mui/material/styles'

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
})

const App = () => {

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
