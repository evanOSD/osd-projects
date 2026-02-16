// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'
import NotFound from '@views/NotFound'

// Util Imports
import { getServerMode } from '@core/utils/serverHelpers'

// 1. Ubah fungsi menjadi async agar bisa menggunakan await
const NotFoundPage = async () => {
  // Vars
  const direction = 'ltr'

  // 2. Gunakan await untuk mengambil nilai mode yang sebenarnya
  const mode = await getServerMode()

  return (
    <Providers direction={direction}>
      <BlankLayout>
        {/* Sekarang mode bukan lagi Promise, tapi string murni */}
        <NotFound mode={mode} />
      </BlankLayout>
    </Providers>
  )
}

export default NotFoundPage
