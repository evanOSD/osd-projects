// Component Imports
import Register from '@views/Register'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

const RegisterPage = async () => {
  // Tambahkan await
  const mode = await getServerMode()

  return <Register mode={mode} />
}

export default RegisterPage
