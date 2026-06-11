// src/app/(dashboard)/users/config/columns.tsx

import { ColumnDef } from '@tanstack/react-table'
import { UserRow, usersApi } from '@/api/users/users'
import { createStandardColumn } from '@/components/ui/tablecomponents/ColumnHelper'

const fetchUsersFilter = (col: keyof UserRow) => () => usersApi.getUniqueColumnValues(col)

export const userColumns: ColumnDef<UserRow>[] = [
  createStandardColumn<UserRow>({
    id: 'id',
    header: 'ID',
    dataType: 'uuid',
    isReadOnly: true,
    isCopyable: true,
    fetchFilterOptions: fetchUsersFilter('id')
  }),
  createStandardColumn<UserRow>({
    id: 'user_name',
    header: 'Nama Pengguna',
    dataType: 'text',
    size: 250,
    isPinned: true,
    isReadOnly: true,
    fetchFilterOptions: fetchUsersFilter('user_name')
  }),
  createStandardColumn<UserRow>({
    id: 'email',
    header: 'Email',
    dataType: 'text',
    size: 250,
    isPinned: true,
    isCopyable: true,
    isReadOnly: false,
    fetchFilterOptions: fetchUsersFilter('email')
  }),
  createStandardColumn<UserRow>({
    id: 'role',
    header: 'Role',
    dataType: 'text',
    size: 150,
    dropdownOptions: ['Staff', 'Consultant', 'Facilitator', 'MTT', 'Guest', 'Unknown'],
    fetchFilterOptions: fetchUsersFilter('role')
  }),
  createStandardColumn<UserRow>({
    id: 'is_active',
    header: 'Aktif?',
    dataType: 'boolean',
    size: 150,
    fetchFilterOptions: fetchUsersFilter('is_active')
  }),
  createStandardColumn<UserRow>({
    id: 'phone',
    header: 'Nomor HP',
    dataType: 'text',
    isCopyable: true,
    size: 180,
    fetchFilterOptions: fetchUsersFilter('phone')
  }),
  createStandardColumn<UserRow>({
    id: 'provider_type',
    header: 'Tipe Login',
    dataType: 'text',
    size: 190,
    isReadOnly: true,
    fetchFilterOptions: fetchUsersFilter('provider_type')
  }),
  createStandardColumn<UserRow>({
    id: 'last_sign_in_at',
    header: 'Terakhir Login',
    dataType: 'datetime',
    size: 220,
    isReadOnly: true,
    fetchFilterOptions: fetchUsersFilter('last_sign_in_at')
  }),
  createStandardColumn<UserRow>({
    id: 'created_at',
    header: 'Tgl Bergabung',
    dataType: 'datetime',
    size: 220,
    isReadOnly: true,
    fetchFilterOptions: fetchUsersFilter('created_at')
  }),
  createStandardColumn<UserRow>({
    id: 'last_updated_at',
    header: 'Last Updated At',
    dataType: 'datetime',
    size: 220,
    isReadOnly: true,
    fetchFilterOptions: fetchUsersFilter('last_updated_at')
  }),
  createStandardColumn<UserRow>({
    id: 'last_updated_by',
    header: 'Last Updated By',
    dataType: 'text',
    size: 230,
    isReadOnly: true,
    fetchFilterOptions: fetchUsersFilter('last_updated_by')
  }),
  createStandardColumn<UserRow>({
    id: 'providers',
    header: 'Raw Providers',
    dataType: 'jsonb',
    size: 250,
    isReadOnly: true
  }),
  createStandardColumn<UserRow>({
    id: 'user_url_photo_profile',
    header: 'URL Foto Profil',
    dataType: 'text',
    isCopyable: true,
    isReadOnly: true,
    size: 300
  })
]
