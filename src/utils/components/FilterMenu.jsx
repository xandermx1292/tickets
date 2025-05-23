import React from 'react'
import { Button, Menu, MenuItem } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

const FilterMenu = ({ label, menuId, menuAnchor, openMenuId, handleMenuClick, handleMenuClose, options, onSelect, getLabel }) => {
  const buttonId = `${menuId}-filter-button`

  return (
    <>
      <Button
        id={buttonId}
        variant="contained"
        endIcon={<KeyboardArrowDownIcon />}
        onClick={(e) => handleMenuClick(e, menuId)}
      >
        {label}
      </Button>
      <Menu
        anchorEl={menuAnchor}
        open={openMenuId === menuId}
        onClose={handleMenuClose}
        slotProps={{
          list: {
            'aria-labelledby': buttonId,
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.id}
            onClick={() => {
              onSelect(option.id)
              handleMenuClose()
            }}
          >
            {getLabel(option)}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default FilterMenu
