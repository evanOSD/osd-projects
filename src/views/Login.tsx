'use client'

import { useState } from 'react'

// Supabase Import
import { createBrowserClient } from '@supabase/ssr'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

const Login = () => {
  const [loading, setLoading] = useState(false)

  // Setup Supabase Client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleGoogleLogin = async () => {
    setLoading(true)
    
    // Panggil Popup / Redirect Google OAuth dari Supabase
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Arahkan kembali ke halaman callback Anda setelah sukses login di Google
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error('Error login Google:', error.message)
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col justify-center items-center min-h-screen relative p-6 bg-bodyBg'>
      <Card className='flex flex-col sm:w-[450px] shadow-lg'>
        <CardContent className='p-6 sm:!p-12 flex flex-col items-center text-center'>
          
          <div className='mb-8'>
            <Typography variant='h4' className='font-bold uppercase tracking-widest text-primary mb-2'>
              OSD Portal
            </Typography>
            <Typography className='text-textSecondary'>
              Please sign in using your Google account.
            </Typography>
          </div>

          <Button 
            fullWidth 
            variant='contained' 
            size='large'
            onClick={handleGoogleLogin} 
            disabled={loading}
            startIcon={<i className='ri-google-fill' />} 
            sx={{ py: 1.5, textTransform: 'none', fontSize: '1rem' }}
          >
            {loading ? 'Mengalihkan ke Google...' : 'Login dengan Google'}
          </Button>

        </CardContent>
      </Card>
    </div>
  )
}

export default Login
