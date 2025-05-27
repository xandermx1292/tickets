import React, { useContext } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import MuiDrawer from '@mui/material/Drawer'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import CssBaseline from '@mui/material/CssBaseline'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import BookOnlineIcon from '@mui/icons-material/BookOnline'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import SettingsIcon from '@mui/icons-material/Settings'
import AddIcon from '@mui/icons-material/Add'
import ChatIcon from '@mui/icons-material/Chat'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import LogoutIcon from '@mui/icons-material/Logout'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { Outlet, useNavigate } from 'react-router-dom'
import { useColorScheme } from '@mui/material/styles'
import { AuthContext } from "../context/AuthProvider"

/*
La mayor porta de este componente lo extraje de material UI, solamente lo modifiqué en función de lo que requería.
Esta es la URL "https://mui.com/material-ui/react-drawer/" de la parte donde obtuve este Drawer.
El componente en específico es el "Mini variant drawer", URL directa "https://mui.com/material-ui/react-drawer/#MiniDrawer.js"
Solo dejaré comentarios de las secciones que modifiqué.
*/

const drawerWidth = 240

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
})

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}))

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}))

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
)

export default function BaseLayout() {
  // Hook de react-router-dom para navegación programática
  const navigate = useNavigate()

  // Hook para acceder al tema (tema claro/oscuro) desde el contexto del theme de MUI
  const theme = useTheme()

  // Estado local para controlar si el Drawer (menú lateral) está abierto o cerrado
  const [open, setOpen] = React.useState(false)

  // Hook para acceder y modificar el contexto de autenticación
  const { setAuth } = useContext(AuthContext)

  // Función para abrir el Drawer
  const handleDrawerOpen = () => {
    setOpen(true)
  }

  // Función para cerrar el Drawer
  const handleDrawerClose = () => {
    setOpen(false)
  }

  // Hook de MUI para manejar el esquema de colores (claro u oscuro)
  const { mode, setMode } = useColorScheme();

  // Si el modo aún no está definido (puede ocurrir brevemente al cargar), no renderiza nada
  if (!mode) {
    return null;
  }

  // Función que alterna entre modo claro y oscuro
  const toggleColorMode = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  }

  // Función que se ejecuta al cerrar sesión: elimina datos del localStorage y actualiza el contexto de auth
  const onClickLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setAuth({ token: null })
  }

  // Primer grupo de ítems del menú lateral
  const menuItems = [
    { text: 'Mis Tickets', index: <BookOnlineIcon />, path: '/home' },
    { text: 'Nuevo Ticket', index: <AddIcon />, path: '/ticket' },
  ]

  // Segundo grupo de ítems del menú lateral
  const menuItems2 = [
    { text: 'Comunicados', index: <ChatIcon />, path: '/notices' },
    { text: 'Configuración', index: <SettingsIcon />, path: '/settings' },
  ]

  // Tercer grupo de ítems del menú lateral, incluyendo el cambio de tema y cierre de sesión
  const menuItems3 = [
    {
      text: mode === 'light' ? 'Tema Oscuro' : 'Tema Claro',
      index: mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />
    },
    {
      text: 'Cerrar Sesión',
      index: <LogoutIcon />,
      path: '/login'
    }
  ]
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                marginRight: 5,
              },
              open && { display: 'none' },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Sistema de Tickets de Serviu Ñuble
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer sx={{ '& .MuiDrawer-paper': { display: 'flex', flexDirection: 'column' } }} variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.map(({ text, index, path }) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={() => navigate(path)}
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                  },
                  open
                    ? {
                      justifyContent: 'initial',
                    }
                    : {
                      justifyContent: 'center',
                    },
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: 'center',
                    },
                    open
                      ? {
                        mr: 3,
                      }
                      : {
                        mr: 'auto',
                      },
                  ]}
                >
                  {index}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  sx={[
                    open
                      ? {
                        opacity: 1,
                      }
                      : {
                        opacity: 0,
                      },
                  ]}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {menuItems2.map(({ text, index, path }) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={() => navigate(path)}
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                  },
                  open
                    ? {
                      justifyContent: 'initial',
                    }
                    : {
                      justifyContent: 'center',
                    },
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: 'center',
                    },
                    open
                      ? {
                        mr: 3,
                      }
                      : {
                        mr: 'auto',
                      },
                  ]}
                >
                  {index}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  sx={[
                    open
                      ? {
                        opacity: 1,
                      }
                      : {
                        opacity: 0,
                      },
                  ]}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List sx={{ marginTop: 'auto' }}>
          {menuItems3.map(({ text, index, path }) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                onClick={() => {
                  if (text === 'Tema Claro' || text === 'Tema Oscuro') {
                    toggleColorMode()
                  } else if (path === '/login') {
                    onClickLogout(path)
                  } else {
                    navigate(path)
                  }
                }}
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                  },
                  open
                    ? {
                      justifyContent: 'initial',
                    }
                    : {
                      justifyContent: 'center',
                    },
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: 'center',
                    },
                    open
                      ? {
                        mr: 3,
                      }
                      : {
                        mr: 'auto',
                      },
                  ]}
                >
                  {index}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  sx={[
                    open
                      ? {
                        opacity: 1,
                      }
                      : {
                        opacity: 0,
                      },
                  ]}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  )
}
