'use client'

import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'

const NavToggle = () => {
  const { toggleVerticalNav, isBreakpointReached } = useVerticalNav()
  const { settings, updateSettings } = useSettings()

  const handleClick = () => {
    if (isBreakpointReached) {
      toggleVerticalNav()
    } else {
      updateSettings({ navCollapsed: !settings.navCollapsed })
    }
  }

  return <i className='ri-menu-line text-xl cursor-pointer text-textPrimary' onClick={handleClick} />
}

export default NavToggle
