// src/components/shared/CustomDropdownTree.tsx

'use client'

import React, { useState, useMemo } from 'react'

import TextField from '@mui/material/TextField'
import Popover from '@mui/material/Popover'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'

// Mendefinisikan struktur data hierarki yang diterima komponen ini
export type TreeNode = {
  id: string
  label: string
  children?: TreeNode[]
}

type Props = {
  label: string
  placeholder?: string
  data: TreeNode[]
  selectedIds: string[]
  onChange: (selectedIds: string[]) => void
}

const CustomDropdownTree = ({ label, placeholder, data, selectedIds, onChange }: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)
  const [expanded, setExpanded] = useState<string[]>([])

  // --- LOGIKA POPOVER (BUKA/TUTUP DROPDOWN) ---
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  // --- LOGIKA EXPAND/COLLAPSE ---
  const handleToggleExpand = (id: string, event: React.MouseEvent) => {
    event.stopPropagation() // Mencegah checkbox ikut terklik
    setExpanded(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  // --- LOGIKA CHECKBOX (PARENT & CHILD) ---
  // Fungsi bantuan untuk mengambil semua ID anak dari sebuah node
  const getAllChildIds = (nodes: TreeNode[]): string[] => {
    let ids: string[] = []

    nodes.forEach(node => {
      ids.push(node.id)
      if (node.children) ids = [...ids, ...getAllChildIds(node.children)]
    })

    return ids
  }

  const handleToggleCheck = (node: TreeNode) => {
    const isSelected = selectedIds.includes(node.id)
    const descendantIds = node.children ? getAllChildIds(node.children) : []
    const allRelatedIds = [node.id, ...descendantIds]

    let newSelected: string[]

    if (isSelected) {
      // Uncheck: Hapus parent dan semua anaknya
      newSelected = selectedIds.filter(id => !allRelatedIds.includes(id))
    } else {
      // Check: Tambahkan parent dan semua anaknya (hindari duplikat)
      newSelected = Array.from(new Set([...selectedIds, ...allRelatedIds]))
    }

    onChange(newSelected)
  }

  // Menentukan status checkbox (Checked, Unchecked, atau Indeterminate/Garis Strip)
  const getCheckStatus = (node: TreeNode) => {
    const isSelfSelected = selectedIds.includes(node.id)

    if (!node.children || node.children.length === 0) {
      return { checked: isSelfSelected, indeterminate: false }
    }

    const descendantIds = getAllChildIds(node.children)
    const selectedDescendants = descendantIds.filter(id => selectedIds.includes(id))

    const isAllSelected = selectedDescendants.length === descendantIds.length && descendantIds.length > 0
    const isSomeSelected = selectedDescendants.length > 0 && !isAllSelected

    // Parent dianggap checked otomatis jika semua anaknya checked
    const isChecked = isSelfSelected || isAllSelected

    return { checked: isChecked, indeterminate: isSomeSelected && !isAllSelected }
  }

  // Teks untuk ditampilkan di dalam TextField
  const displayText = useMemo(() => {
    if (selectedIds.length === 0) return ''
    
    return `${selectedIds.length} item(s) selected`
  }, [selectedIds])

  // --- RENDER REKURSIF UNTUK POHON ---
  const renderTree = (nodes: TreeNode[], level: number = 0) => {
    return nodes.map(node => {
      const isExpanded = expanded.includes(node.id)
      const hasChildren = node.children && node.children.length > 0
      const { checked, indeterminate } = getCheckStatus(node)

      return (
        <React.Fragment key={node.id}>
          <ListItem disablePadding sx={{ pl: level * 3 }}>
            <ListItemButton onClick={() => handleToggleCheck(node)} dense>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Checkbox
                  edge="start"
                  checked={checked}
                  indeterminate={indeterminate}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText primary={node.label} />
              {hasChildren && (
                <IconButton 
                  size="small" 
                  onClick={(e) => handleToggleExpand(node.id, e)}
                  sx={{ ml: 1 }}
                >
                  <i className={isExpanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} />
                </IconButton>
              )}
            </ListItemButton>
          </ListItem>
          {hasChildren && (
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderTree(node.children!, level + 1)}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      )
    })
  }

  return (
    <>
      <TextField
        fullWidth
        label={label}
        placeholder={placeholder}
        value={displayText}
        onClick={handleClick}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              <i className="ri-arrow-down-s-line cursor-pointer" />
            </InputAdornment>
          ),
          sx: { cursor: 'pointer' }
        }}
      />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{
          sx: { width: anchorEl?.clientWidth || 300, maxHeight: 400 }
        }}
      >
        <List dense sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {data.length === 0 ? (
            <ListItem><ListItemText primary="Tidak ada data." /></ListItem>
          ) : (
            renderTree(data)
          )}
        </List>
      </Popover>
    </>
  )
}

export default CustomDropdownTree
