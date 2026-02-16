// src/app/(blank-layout-pages)/login/page.tsx

// Component Imports
import Login from '@views/Login'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

const LoginPage = async () => {
  await getServerMode()
  
  return <Login />
}

export default LoginPage
