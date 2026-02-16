// Component Imports
import NotFound from '@views/NotFound'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

const Error = async () => {
  // Tambahkan await karena getServerMode sekarang async
  const mode = await getServerMode()

  return <NotFound mode={mode} />
}

export default Error
