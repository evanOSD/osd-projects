// src/views/lookup/index.tsx
'use client'

// React Imports
import { useState } from 'react'
import type { SyntheticEvent, ReactElement } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'

const LookupWrapper = ({ tabContentList }: { tabContentList: { [key: string]: ReactElement } }) => {
  // States: Set default tab yang aktif saat pertama kali halaman dibuka
  const [activeTab, setActiveTab] = useState('books')

  const handleChange = (event: SyntheticEvent, value: string) => {
    setActiveTab(value)
  }

  return (
    <TabContext value={activeTab}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          {/* variant='scrollable' memastikan tab bisa digeser di layar HP tanpa merusak layout */}
          <TabList onChange={handleChange} variant='scrollable'>
            <Tab label='Books' icon={<i className='ri-book-2-line' />} iconPosition='start' value='books' />
            <Tab label='Passages' icon={<i className='ri-file-text-line' />} iconPosition='start' value='passages' />
            <Tab label='Stories' icon={<i className='ri-history-line' />} iconPosition='start' value='stories' />
            <Tab label='Languages' icon={<i className='ri-translate-2' />} iconPosition='start' value='languages' />
            <Tab label='Steps' icon={<i className='ri-footprint-line' />} iconPosition='start' value='steps' />
          </TabList>
        </Grid>
        <Grid item xs={12}>
          {/* className='p-0' membuang padding bawaan agar tabel bisa menempel presisi */}
          <TabPanel value={activeTab} className='p-0'>
            {tabContentList[activeTab]}
          </TabPanel>
        </Grid>
      </Grid>
    </TabContext>
  )
}

export default LookupWrapper
