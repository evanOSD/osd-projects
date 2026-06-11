// src/app/(dashboard)/users/permissions/config/columns.tsx

import { ColumnDef } from '@tanstack/react-table'
import { PermissionMatrixRow } from '@/api/users/permissionsMatrix'
import { createStandardColumn } from '@/components/ui/tablecomponents/ColumnHelper'

const CRUD_OPTIONS = ['Create', 'Read', 'Update', 'Delete']

export const permissionColumns: ColumnDef<PermissionMatrixRow>[] = [
  createStandardColumn<PermissionMatrixRow>({
    id: 'id',
    header: 'ID User',
    dataType: 'uuid',
    isReadOnly: true
  }),
  createStandardColumn<PermissionMatrixRow>({
    id: 'user_name',
    header: 'Nama Pengguna',
    dataType: 'text',
    size: 230,
    isPinned: true,
    isReadOnly: true
  }),
  createStandardColumn<PermissionMatrixRow>({
    id: 'email',
    header: 'Email',
    dataType: 'text',
    size: 230,
    isPinned: true,
    isReadOnly: true,
    isCopyable: true
  }),
  createStandardColumn<PermissionMatrixRow>({
    id: 'role',
    header: 'Role',
    dataType: 'text',
    size: 140,
    isPinned: true,
    dropdownOptions: ['Staff', 'Consultant', 'Facilitator', 'MTT', 'Guest', 'Unknown']
  }),

  // SATU MENU = SATU KOLOM MULTI-SELECT
  createStandardColumn<PermissionMatrixRow>({
    id: 'dashboard',
    header: 'Dashboard',
    dataType: 'text-array',
    dropdownOptions: CRUD_OPTIONS,
    size: 190
  }),
  createStandardColumn<PermissionMatrixRow>({
    id: 'database',
    header: 'Database',
    dataType: 'text-array',
    dropdownOptions: CRUD_OPTIONS,
    size: 190
  }),
  createStandardColumn<PermissionMatrixRow>({
    id: 'users',
    header: 'Users',
    dataType: 'text-array',
    dropdownOptions: CRUD_OPTIONS,
    size: 190
  }),
  createStandardColumn<PermissionMatrixRow>({
    id: 'projects',
    header: 'Projects',
    dataType: 'text-array',
    dropdownOptions: CRUD_OPTIONS,
    size: 190
  }),
  createStandardColumn<PermissionMatrixRow>({
    id: 'plan_progress',
    header: 'Plan & Progress',
    dataType: 'text-array',
    dropdownOptions: CRUD_OPTIONS,
    size: 220
  })
]
