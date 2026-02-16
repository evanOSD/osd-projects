// Component Imports
import UnderMaintenance from '@views/pages/misc/UnderMaintenance'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

const UnderMaintenancePage = async () => {
  // Tambahkan await
  const mode = await getServerMode()

  return <UnderMaintenance mode={mode} />
}

export default UnderMaintenancePage
