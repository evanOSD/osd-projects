'use client'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

const FooterContent = () => {
  // Hooks
  const { isBreakpointReached } = useVerticalNav()

  return (
    <div
      className={classnames(verticalLayoutClasses.footerContent, 'flex items-center justify-between flex-wrap gap-4')}
    >
      <p>Nama Halaman nantinya</p>
      {!isBreakpointReached && (
        <div className='flex items-center gap-4 text-yellow-700 text-bold !important'>
          <p>OSD Projects</p>
        </div>
      )}
    </div>
  )
}

export default FooterContent
