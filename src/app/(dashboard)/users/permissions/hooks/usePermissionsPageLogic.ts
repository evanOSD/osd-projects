// src/app/(dashboard)/users/permissions/hooks/usePermissionsPageLogic.ts

import { useTablePageLogic } from '@/hooks/ui/useTablePageLogic'
import {
  usePermissionsMatrix,
  useUpdatePermissionMatrix,
  useAddPermissionMatrix,
  useDeleteUsersMatrix // <-- Ganti importnya ke sini
} from '@/hooks/queries/users/usePermissionsMatrix'
import { PermissionMatrixRow } from '@/api/users/permissionsMatrix'
import { permissionColumns } from '../config/columns'
import { PERMISSIONS_TABLE_CONFIG } from '../config/constants'

export function usePermissionsPageLogic() {
  return useTablePageLogic<PermissionMatrixRow, any>({
    columns: permissionColumns,
    defaultHiddenColumns: PERMISSIONS_TABLE_CONFIG.defaultHiddenColumns,
    defaultSorting: [{ id: 'user_name', desc: false }],
    generateTempRow: () => ({}) as any,
    useQueryHook: usePermissionsMatrix,
    useUpdateMutation: useUpdatePermissionMatrix,
    useAddMutation: useAddPermissionMatrix,
    useDeleteMutation: useDeleteUsersMatrix
  })
}
