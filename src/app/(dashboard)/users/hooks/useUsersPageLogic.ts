// src/app/(dashboard)/users/hooks/useUsersPageLogic.ts

import { useTablePageLogic } from '@/hooks/ui/useTablePageLogic'
import { useUsers, useUpdateUser, useAddUser, useDeleteUsers } from '@/hooks/queries/users/useUsers'
import { UserRow, UserInsert } from '@/api/users/users'
import { userColumns } from '../config/columns'
import { USER_TABLE_CONFIG } from '../config/constants'

const SELECTED_ROW_COLUMNS = ['user_name', 'email', 'role', 'is_active', 'last_sign_in_at']

export function useUsersPageLogic() {
  return useTablePageLogic<UserRow, UserInsert>({
    columns: userColumns,
    defaultHiddenColumns: USER_TABLE_CONFIG.defaultHiddenColumns,
    selectedRowDisplayColumns: SELECTED_ROW_COLUMNS,
    defaultSorting: [{ id: 'created_at', desc: true }], // Urutkan dari pendaftar terbaru
    
    // Baris kosong (Tapi jika diklik simpan akan menampilkan error API seperti yang saya jelaskan)
    generateTempRow: () => ({
      id: `temp-${Date.now()}`,
      user_name: '',
      email: '',
      role: 'Users',
      is_active: false
    }),

    useQueryHook: useUsers,
    useUpdateMutation: useUpdateUser,
    useAddMutation: useAddUser,
    useDeleteMutation: useDeleteUsers
  })
}
