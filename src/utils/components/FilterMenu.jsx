// Importación de React y componentes de MUI (Material UI)
import React from 'react'
import { Button, Menu, MenuItem } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

// Componente funcional reutilizable para generar un menú desplegable con filtro
// Se utiliza, por ejemplo, en "Home.jsx" para crear varios menús con diferente contenido
const FilterMenu = ({
  label,           // Texto que se mostrará en el botón
  menuId,          // ID único para este menú
  menuAnchor,      // Elemento HTML al que se ancla el 
  openMenuId,      // ID del menú actualmente abierto 
  handleMenuClick, // Función que se ejecuta al hacer clic en el botón (abre el menú)
  handleMenuClose, // Función para cerrar el menú
  options,         // Lista de opciones que se muestran en el menú
  onSelect,        // Función que se ejecuta al seleccionar una opción
  getLabel         // Función que recibe una opción y retorna el texto a mostrar
}) => {
  
  // ID único del botón, usado para accesibilidad 
  const buttonId = `${menuId}-filter-button`

  // Renderizado del botón y el menú asociado
  return (
    <>
      {/* Botón que despliega el menú */}
      <Button
        id={buttonId}
        variant="contained"
        endIcon={<KeyboardArrowDownIcon />} // Icono de flecha hacia abajo
        onClick={(e) => handleMenuClick(e, menuId)} // Al hacer clic, llama a la función que maneja la apertura del menú
      >
        {label} {/* Texto del botón */}
      </Button>

      {/* Menú desplegable */}
      <Menu
        anchorEl={menuAnchor}         // Elemento al que se ancla el menú 
        open={openMenuId === menuId}  // El menú se abre solo si su ID coincide con el que está activo
        onClose={handleMenuClose}     // Cierra el menú cuando se hace clic fuera o se selecciona una opción
        slotProps={{
          list: {
            'aria-labelledby': buttonId, // Mejora la accesibilidad enlazando el menú con su botón
          },
        }}
      >
        {/* Se mapean las opciones del menú, creando un <MenuItem> para cada una */}
        {options.map((option) => (
          <MenuItem
            key={option.id} // Clave única para React
            onClick={() => {
              onSelect(option.id) // Llama a la función al seleccionar la opción
              handleMenuClose()   // Cierra el menú después de seleccionar
            }}
          >
            {getLabel(option)} // Texto visible de la opción, generado por la función getLabel
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

// Exporta el componente para que pueda usarse en otros archivos
export default FilterMenu
