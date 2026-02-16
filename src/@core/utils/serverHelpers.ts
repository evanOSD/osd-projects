import 'server-only'

// Next Imports
import { cookies } from 'next/headers'

// Type Imports
import type { Settings } from '@core/contexts/settingsContext'
import type { SystemMode } from '@core/types'

// Config Imports
import themeConfig from '@configs/themeConfig'

// 1. Tambahkan async dan await
export const getSettingsFromCookie = async (): Promise<Settings> => {
  const cookieStore = await cookies() // <--- NEXT.JS 15 WAJIB AWAIT

  const cookieName = themeConfig.settingsCookieName
  const cookieValue = cookieStore.get(cookieName)?.value

  return JSON.parse(cookieValue || '{}')
}

// 2. Karena pemanggilnya async, fungsi ini juga wajib async
export const getMode = async (): Promise<SystemMode> => {
  const settingsCookie = await getSettingsFromCookie()

  // Ambil mode dari cookie atau gunakan fallback dari themeConfig
  const _mode = (settingsCookie.mode || themeConfig.mode) as SystemMode

  return _mode
}

export const getSystemMode = async (): Promise<SystemMode> => {
  return await getMode()
}

export const getServerMode = async (): Promise<SystemMode> => {
  return await getMode()
}
