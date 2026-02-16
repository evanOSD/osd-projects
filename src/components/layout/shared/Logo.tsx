'use client'

// React Imports
import type { CSSProperties } from 'react'

// Third-party Imports
import styled from '@emotion/styled'

// Config Imports
import themeConfig from '@configs/themeConfig'

type LogoTextProps = {
  color?: CSSProperties['color']
}

const LogoText = styled.span<LogoTextProps>`
  color: ${({ color }) => color ?? 'var(--mui-palette-text-primary)'};
  font-size: 1.25rem;
  line-height: 1.2;
  font-weight: 600;
  letter-spacing: 0.15px;
  margin-inline-start: 10px;
  /* text-transform: uppercase; <-- SUDAH DIHAPUS AGAR NORMAL CASE */
`

const Logo = ({ color }: { color?: CSSProperties['color'] }) => {
  return (
    <div className='flex items-center min-bs-[24px]'>
      {/* 1. Ganti Logo M bawaan menjadi logo SVG Anda sendiri */}
      <img 
        src='/images/logos/osd-logo.svg' 
        alt='OSD Logo' 
        width={40} 
        height={40} 
      />
      {/* 2. Teks mengambil dari themeConfig ('OSD Projects') dan saya tambahkan class agar bisa disembunyikan saat collapsed */}
      <LogoText color={color} className='app-logo-text'>
        {themeConfig.templateName}
      </LogoText>
    </div>
  )
}

export default Logo
