'use client'

// React Imports
import { useRef, useState, useEffect } from 'react'
import type { MouseEvent } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import { styled } from '@mui/material/styles'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'

// Supabase Import
import { createClient } from '@core/utils/supabaseClient'

// Styled component for badge content
const BadgeContentSpan = styled('span')({
  width: 8,
  height: 8,
  borderRadius: '50%',
  cursor: 'pointer',
  backgroundColor: 'var(--mui-palette-success-main)',
  boxShadow: '0 0 0 2px var(--mui-palette-background-paper)'
})

const UserDropdown = () => {
  // States
  const [open, setOpen] = useState(false)
  
  // State untuk menyimpan data user dari database
  const [userData, setUserData] = useState({
    name: 'Loading...',
    role: '...',
    photoUrl: '/images/avatars/1.png' // Default foto kalau di database masih kosong
  })

  // Refs
  const anchorRef = useRef<HTMLDivElement>(null)

  // Hooks
  const router = useRouter()

  // --- MENGAMBIL DATA USER DARI SUPABASE ---
  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // --- LOGIKA PENCARIAN FOTO YANG LEBIH AGRESIF ---
        const metadata = user.user_metadata || {}
        const identityData = user.identities?.[0]?.identity_data || {}
        
        // Cari di semua kemungkinan tempat Supabase menyimpan foto Google
        const googlePhotoUrl = metadata.avatar_url || metadata.picture || identityData.avatar_url || identityData.picture

        // "CCTV" untuk melihat langsung data apa yang dikirim Supabase ke browser Anda
        console.log('Intip Data User Supabase:', user)
        console.log('Intip URL Foto Google:', googlePhotoUrl)

        const { data, error } = await supabase
          .from('users')
          .select('user_name, role, user_url_photo_profile')
          .eq('id', user.id)
          .single()

        if (data && !error) {
          setUserData({
            name: data.user_name || 'No Name',
            role: data.role || 'User',
            photoUrl: googlePhotoUrl || data.user_url_photo_profile || '/images/avatars/1.png'
          })
        }
      }
    }

    fetchUserData()
  }, [])

  const handleDropdownOpen = () => {
    !open ? setOpen(true) : setOpen(false)
  }

  const handleDropdownClose = (event?: MouseEvent<HTMLLIElement> | (MouseEvent | TouchEvent), url?: string) => {
    if (url) {
      router.push(url)
    }

    if (anchorRef.current && anchorRef.current.contains(event?.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  // --- FUNGSI UNTUK LOGOUT SUPABASE ---
  const handleUserLogout = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const supabase = createClient()
    
    // Bunuh sesi di Supabase (menghapus cookies)
    await supabase.auth.signOut()

    // Tutup dropdown
    setOpen(false)

    // Pindah ke halaman login
    router.push('/login')
    
    // Paksa Next.js refresh agar memori browser benar-benar bersih
    router.refresh()
  }

  return (
    <>
      <Badge
        ref={anchorRef}
        overlap='circular'
        badgeContent={<BadgeContentSpan onClick={handleDropdownOpen} />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        className='mis-2'
      >
        <Avatar
          ref={anchorRef}
          alt={userData.name}
          src={userData.photoUrl}
          onClick={handleDropdownOpen}
          className='cursor-pointer bs-[38px] is-[38px]'
        />
      </Badge>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        anchorEl={anchorRef.current}
        className='min-is-[240px] !mbs-4 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top'
            }}
          >
            <Paper className='shadow-lg'>
              <ClickAwayListener onClickAway={e => handleDropdownClose(e as MouseEvent | TouchEvent)}>
                <MenuList>
                  <div className='flex items-center plb-2 pli-4 gap-2' tabIndex={-1}>
                    <Avatar alt={userData.name} src={userData.photoUrl} />
                    <div className='flex items-start flex-col'>
                      <Typography className='font-medium' color='text.primary'>
                        {userData.name}
                      </Typography>
                      <Typography variant='caption'>{userData.role}</Typography>
                    </div>
                  </div>
                  <Divider className='mlb-1' />
                  <MenuItem className='gap-3' onClick={e => handleDropdownClose(e)}>
                    <i className='ri-user-3-line' />
                    <Typography color='text.primary'>My Profile</Typography>
                  </MenuItem>
                  <MenuItem className='gap-3' onClick={e => handleDropdownClose(e)}>
                    <i className='ri-settings-4-line' />
                    <Typography color='text.primary'>Settings</Typography>
                  </MenuItem>
                  <MenuItem className='gap-3' onClick={e => handleDropdownClose(e)}>
                    <i className='ri-money-dollar-circle-line' />
                    <Typography color='text.primary'>Pricing</Typography>
                  </MenuItem>
                  <MenuItem className='gap-3' onClick={e => handleDropdownClose(e)}>
                    <i className='ri-question-line' />
                    <Typography color='text.primary'>FAQ</Typography>
                  </MenuItem>
                  <div className='flex items-center plb-2 pli-4'>
                    <Button
                      fullWidth
                      variant='contained'
                      color='error'
                      size='small'
                      endIcon={<i className='ri-logout-box-r-line' />}
                      onClick={handleUserLogout}
                      sx={{ '& .MuiButton-endIcon': { marginInlineStart: 1.5 } }}
                    >
                      Logout
                    </Button>
                  </div>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default UserDropdown
