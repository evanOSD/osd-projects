'use client'

import classnames from 'classnames'

import type { ChildrenType } from '@core/types'
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'
import StyledMain from '@layouts/styles/shared/StyledMain'

const LayoutContent = ({ children }: ChildrenType) => {
  return (
    <StyledMain
      isContentCompact={false} // <-- UBAH KE FALSE
      className={classnames(verticalLayoutClasses.content, 'flex-auto is-full')} // <-- HAPUS class contentCompact
    >
      {children}
    </StyledMain>
  )
}

export default LayoutContent
