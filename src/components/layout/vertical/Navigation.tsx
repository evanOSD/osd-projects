'use client'

import { useTheme } from '@mui/material/styles'

import VerticalNav, { NavHeader } from '@menu/vertical-menu'
import VerticalMenu from './VerticalMenu'
import Logo from '@components/layout/shared/Logo'

import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'
import navigationCustomStyles from '@core/styles/vertical/navigationCustomStyles'

const Navigation = () => {
  const theme = useTheme()
  const { isBreakpointReached, toggleVerticalNav } = useVerticalNav()
  const { settings, updateSettings } = useSettings()

  const isCollapsed = settings.navCollapsed ?? false

  const customStyles = {
    ...navigationCustomStyles(theme),
    ...(isCollapsed && !isBreakpointReached && {
      '& .ts-menu-label, & .ts-menu-suffix, & .ts-submenu-expand-icon': { 
        display: 'none !important' 
      },
      '& .ts-menu-button': {
        paddingLeft: '0 !important',
        paddingRight: '0 !important',
        justifyContent: 'center !important',
      },
      '& .ts-menu-icon': {
        marginRight: '0 !important',
        marginInlineEnd: '0 !important',
      },
      '& .app-logo-text': {
        display: 'none !important'
      },
      '& .ts-menu-toggle-icon': {
        display: 'none !important'
      },
      '& .ts-nav-header': {
        paddingLeft: '0 !important',
        paddingRight: '0 !important',
        justifyContent: 'center !important'
      }
    })
  }

  return (
    <VerticalNav 
      customStyles={customStyles} 
      width={isCollapsed && !isBreakpointReached ? 80 : 260}
    >
      <NavHeader>
        <div className="flex items-center justify-between w-full">
          {/* Komponen <Link> DIHAPUS. Sekarang hanya tag <div> murni dengan onClick event. */}
          <div 
            className='cursor-pointer flex items-center select-none'
            onClick={() => {
              if (!isBreakpointReached) {
                // Di Desktop: Klik area logo akan toggle (buka/tutup) sidebar
                updateSettings({ navCollapsed: !isCollapsed })
              }
            }}
          >
            <Logo />
          </div>

          {!isBreakpointReached && (
            <i 
              className='ri-menu-line text-xl cursor-pointer text-textPrimary ts-menu-toggle-icon' 
              onClick={() => updateSettings({ navCollapsed: true })} 
            />
          )}

          {isBreakpointReached && (
            <i 
              className='ri-close-line text-xl cursor-pointer text-textPrimary' 
              onClick={() => toggleVerticalNav(false)} 
            />
          )}
        </div>
      </NavHeader>
      
      <VerticalMenu />
    </VerticalNav>
  )
}

export default Navigation
