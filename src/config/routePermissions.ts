// src/config/routePermissions.ts

// Daftar Role Resmi
export const ROLES = {
  STAFF: 'Staff',
  CONSULTANT: 'Consultant',
  FACILITATOR: 'Facilitator',
  MTT: 'MTT',
  GUEST: 'Guest',
  UNKNOWN: 'Unknown'
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

// KAMUS RUTE: Siapa yang boleh mengakses apa?
export const ROUTE_PERMISSIONS: Record<string, Role[]> = {
  '/home': [ROLES.STAFF, ROLES.CONSULTANT, ROLES.FACILITATOR, ROLES.MTT, ROLES.GUEST],
  '/table': [ROLES.STAFF, ROLES.CONSULTANT, ROLES.FACILITATOR, ROLES.MTT, ROLES.GUEST],
  '/dummy': [ROLES.STAFF, ROLES.CONSULTANT, ROLES.FACILITATOR, ROLES.MTT, ROLES.GUEST],

  // Halaman Users (Hanya Staff)
  '/users': [ROLES.STAFF],
  '/users/list': [ROLES.STAFF],
  '/users/permissions': [ROLES.STAFF]

  // Anda bisa menambahkan rute /projects, /settings, dll nanti di sini
}

/**
 * Fungsi Pengecek: Apakah user dengan Role X boleh masuk ke Rute Y?
 */
export function hasAccess(role: Role, pathname: string): boolean {
  if (role === ROLES.UNKNOWN) return false

  // Cari apakah rute yang diminta ada di dalam kamus
  for (const [route, allowedRoles] of Object.entries(ROUTE_PERMISSIONS)) {
    // Pengecekan Exact Match (/users) atau Sub-route (/users/list)
    if (pathname === route || pathname.startsWith(route + '/')) {
      return allowedRoles.includes(role)
    }
  }

  // DEFAULT BEHAVIOR (Pengaman Terakhir):
  // Jika ada halaman baru yang belum didaftarkan di kamus ini,
  // hanya Staff yang boleh membukanya untuk menghindari kebocoran fitur.
  return role === ROLES.STAFF
}
