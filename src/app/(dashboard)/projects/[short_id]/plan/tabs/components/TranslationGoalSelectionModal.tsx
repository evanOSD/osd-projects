'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/app/(dashboard)/dummy/Buttons'
import { X, ChevronRight, ChevronDown, CheckSquare, Square, MinusSquare } from 'lucide-react'
import { usePassages } from '@/hooks/queries/database/usePassages'
import { useStories } from '@/hooks/queries/database/useStories'

interface TranslationGoalSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (selections: SelectedItems) => void
  books: any[]
}

export type SelectedItems = {
  books: any[]
  passages: any[]
  stories: any[]
}

// Helper for grouping
function groupBy(array: any[], key: string) {
  return array.reduce((acc, item) => {
    const group = item[key] || 'Uncategorized'
    ;(acc[group] = acc[group] || []).push(item)
    return acc
  }, {} as Record<string, any[]>)
}

export default function TranslationGoalSelectionModal({ isOpen, onClose, onSave, books }: TranslationGoalSelectionModalProps) {
  const { data: passagesData } = usePassages({}, [], 5000)
  const { data: storiesData } = useStories({}, [], 5000)

  const passagesList = passagesData?.pages?.flat() || []
  const storiesList = storiesData?.pages?.flat() || []

  const [activeTab, setActiveTab] = useState<'books' | 'passages' | 'stories'>('books')

  // Expanded states for trees
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({})
  const [expandedKitabs, setExpandedKitabs] = useState<Record<string, boolean>>({})

  // Selected item IDs
  const [selectedBooks, setSelectedBooks] = useState<Record<string, boolean>>({})
  const [selectedPassages, setSelectedPassages] = useState<Record<string, boolean>>({})
  const [selectedStories, setSelectedStories] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (isOpen) {
      setExpandedCats({})
      setExpandedKitabs({})
      setSelectedBooks({})
      setSelectedPassages({})
      setSelectedStories({})
      setActiveTab('books')
    }
  }, [isOpen])

  // --- BUILD TREES ---
  const booksTree = useMemo(() => {
    const byCat = groupBy(books, 'category')
    const tree: Record<string, Record<string, any[]>> = {}
    for (const cat in byCat) {
      tree[cat] = groupBy(byCat[cat], 'kitab')
    }
    return tree
  }, [books])

  const passagesTree = useMemo(() => {
    const byCat = groupBy(passagesList, 'category')
    const tree: Record<string, Record<string, any[]>> = {}
    for (const cat in byCat) {
      tree[cat] = groupBy(byCat[cat], 'kitab')
    }
    return tree
  }, [passagesList])

  const storiesTree = useMemo((): Record<string, any[]> => {
    return groupBy(storiesList, 'story_category')
  }, [storiesList])

  // --- TOGGLE EXPAND ---
  const toggleCat = (cat: string) => setExpandedCats(p => ({ ...p, [cat]: !p[cat] }))
  const toggleKitab = (kitab: string) => setExpandedKitabs(p => ({ ...p, [kitab]: !p[kitab] }))

  // --- SELECTION HELPERS ---
  const handleToggleItem = (
    id: string,
    state: Record<string, boolean>,
    setState: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  ) => {
    setState(p => ({ ...p, [id]: !p[id] }))
  }

  const handleToggleGroup = (
    items: any[],
    state: Record<string, boolean>,
    setState: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  ) => {
    const allChecked = items.every(i => state[i.id])
    const newState = { ...state }
    items.forEach(i => {
      newState[i.id] = !allChecked
    })
    setState(newState)
  }

  const getGroupState = (items: any[], state: Record<string, boolean>) => {
    if (items.length === 0) return 'unchecked'
    const checkedCount = items.filter(i => state[i.id]).length
    if (checkedCount === items.length) return 'checked'
    if (checkedCount > 0) return 'partial'
    return 'unchecked'
  }

  const renderCheckbox = (status: 'checked' | 'unchecked' | 'partial') => {
    if (status === 'checked') return <CheckSquare size={16} className='text-[hsl(var(--primary))]' />
    if (status === 'partial') return <MinusSquare size={16} className='text-[hsl(var(--primary))]/50' />
    return <Square size={16} className='text-muted-foreground/50' />
  }

  const handleSave = () => {
    const selected: SelectedItems = {
      books: books.filter(b => selectedBooks[b.id]),
      passages: passagesList.filter(p => selectedPassages[p.id]),
      stories: storiesList.filter(s => selectedStories[s.id])
    }
    onSave(selected)
  }

  if (!isOpen) return null

  const totalSelected = Object.values(selectedBooks).filter(Boolean).length +
                        Object.values(selectedPassages).filter(Boolean).length +
                        Object.values(selectedStories).filter(Boolean).length

  return (
    <div className='fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200'>
      <div className='absolute top-0 left-0 bg-white z-50 text-black p-4 text-xs font-mono max-w-full overflow-auto'>
        DEBUG BOOK 0: {JSON.stringify(books?.[0])}
      </div>
      <Card className='w-[70vw] max-w-7xl h-[85vh] flex flex-col shadow-2xl border border-[hsl(var(--border))]'>
        
        {/* Header */}
        <div className='flex items-center justify-between p-5 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]/10'>
          <div>
            <h2 className='text-lg font-bold text-foreground'>Pilih Target Terjemahan</h2>
            <p className='text-xs text-muted-foreground mt-0.5'>Pilih kombinasi Kitab, Perikop, atau Cerita.</p>
          </div>
          <button onClick={onClose} className='p-2 text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--muted))]/50 rounded-full transition-colors'>
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className='flex border-b border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-5 pt-3 gap-4'>
          {[
            { id: 'books', label: 'Books (Buku/Pasal)' },
            { id: 'passages', label: 'Passages (Perikop)' },
            { id: 'stories', label: 'Stories (Cerita)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab.id 
                  ? 'border-[hsl(var(--primary))] text-[hsl(var(--primary))]' 
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Body (Tree Selection) */}
        <div className='flex-1 overflow-y-auto p-5 custom-scrollbar bg-[hsl(var(--surface))]'>
          
          {/* BOOKS TAB */}
          {activeTab === 'books' && (
            <div className='space-y-4'>
              {Object.keys(booksTree).length === 0 && <div className='text-center py-8 text-muted-foreground'>Tidak ada data books.</div>}
              {Object.entries(booksTree).map(([cat, kitabs]) => {
                const allItemsInCat = Object.values(kitabs).flat()
                const catState = getGroupState(allItemsInCat, selectedBooks)
                const isExpanded = !!expandedCats[cat]

                return (
                  <div key={cat} className='border border-[hsl(var(--border))]/50 rounded overflow-hidden'>
                    <div className={`flex items-center gap-3 p-2 bg-[hsl(var(--muted))]/10 hover:bg-[hsl(var(--muted))]/20 transition-colors ${isExpanded ? 'border-b border-[hsl(var(--border))]/50' : ''}`}>
                      <button onClick={() => toggleCat(cat)} className='p-1 text-muted-foreground'>
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>
                      <button onClick={() => handleToggleGroup(allItemsInCat, selectedBooks, setSelectedBooks)}>
                        {renderCheckbox(catState)}
                      </button>
                      <div className='font-bold text-sm select-none cursor-pointer' onClick={() => toggleCat(cat)}>{cat}</div>
                    </div>
                    
                    {isExpanded && (
                      <div className='pl-6 py-1 bg-[hsl(var(--subtle))]/10'>
                        {Object.entries(kitabs).map(([kitab, items]) => {
                          const kitabState = getGroupState(items, selectedBooks)
                          const isKitabExpanded = !!expandedKitabs[`${cat}-${kitab}`]
                          
                          return (
                            <div key={kitab} className='mt-1'>
                              <div className='flex items-center gap-3 p-1.5 hover:bg-[hsl(var(--muted))]/10'>
                                <button onClick={() => toggleKitab(`${cat}-${kitab}`)} className='p-1 text-muted-foreground'>
                                  {isKitabExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                </button>
                                <button onClick={() => handleToggleGroup(items, selectedBooks, setSelectedBooks)}>
                                  {renderCheckbox(kitabState)}
                                </button>
                                <div className='font-semibold text-sm select-none cursor-pointer' onClick={() => toggleKitab(`${cat}-${kitab}`)}>
                                  {kitab} <span className='text-xs font-normal text-muted-foreground'>({items.length} pasal)</span>
                                </div>
                              </div>
                              
                              {isKitabExpanded && (
                                <div className='pl-10 py-1 grid grid-cols-7 gap-2'>
                                  {items.map(item => {
                                    const isChecked = selectedBooks[item.id]
                                    return (
                                      <div key={item.id} className='flex items-center gap-2 hover:bg-[hsl(var(--muted))]/10 p-1 rounded'>
                                        <button onClick={() => handleToggleItem(item.id, selectedBooks, setSelectedBooks)}>
                                          {renderCheckbox(isChecked ? 'checked' : 'unchecked')}
                                        </button>
                                        <div className='text-xs select-none cursor-pointer' onClick={() => handleToggleItem(item.id, selectedBooks, setSelectedBooks)}>
                                          Pasal {item.pasal || '-'}
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* PASSAGES TAB */}
          {activeTab === 'passages' && (
            <div className='space-y-4'>
              {Object.keys(passagesTree).length === 0 && <div className='text-center py-8 text-muted-foreground'>Tidak ada data passages.</div>}
              {Object.entries(passagesTree).map(([cat, kitabs]) => {
                const allItemsInCat = Object.values(kitabs).flat()
                const catState = getGroupState(allItemsInCat, selectedPassages)
                const isExpanded = !!expandedCats[`pass-${cat}`]

                return (
                  <div key={cat} className='border border-[hsl(var(--border))]/50 rounded overflow-hidden'>
                    <div className={`flex items-center gap-3 p-2 bg-[hsl(var(--muted))]/10 hover:bg-[hsl(var(--muted))]/20 transition-colors ${isExpanded ? 'border-b border-[hsl(var(--border))]/50' : ''}`}>
                      <button onClick={() => toggleCat(`pass-${cat}`)} className='p-1 text-muted-foreground'>
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>
                      <button onClick={() => handleToggleGroup(allItemsInCat, selectedPassages, setSelectedPassages)}>
                        {renderCheckbox(catState)}
                      </button>
                      <div className='font-bold text-sm select-none cursor-pointer' onClick={() => toggleCat(`pass-${cat}`)}>{cat}</div>
                    </div>
                    
                    {isExpanded && (
                      <div className='pl-6 py-1 bg-[hsl(var(--subtle))]/10'>
                        {Object.entries(kitabs).map(([kitab, items]) => {
                          const kitabState = getGroupState(items, selectedPassages)
                          const isKitabExpanded = !!expandedKitabs[`pass-${cat}-${kitab}`]
                          
                          return (
                            <div key={kitab} className='mt-1'>
                              <div className='flex items-center gap-3 p-1.5 hover:bg-[hsl(var(--muted))]/10'>
                                <button onClick={() => toggleKitab(`pass-${cat}-${kitab}`)} className='p-1 text-muted-foreground'>
                                  {isKitabExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                </button>
                                <button onClick={() => handleToggleGroup(items, selectedPassages, setSelectedPassages)}>
                                  {renderCheckbox(kitabState)}
                                </button>
                                <div className='font-semibold text-sm select-none cursor-pointer' onClick={() => toggleKitab(`pass-${cat}-${kitab}`)}>
                                  {kitab} <span className='text-xs font-normal text-muted-foreground'>({items.length} perikop)</span>
                                </div>
                              </div>
                              
                              {isKitabExpanded && (
                                <div className='pl-10 py-1 flex flex-col gap-1'>
                                  {items.map(item => {
                                    const isChecked = selectedPassages[item.id]
                                    return (
                                      <div key={item.id} className='flex items-center gap-3 hover:bg-[hsl(var(--muted))]/10 p-1.5 rounded'>
                                        <button onClick={() => handleToggleItem(item.id, selectedPassages, setSelectedPassages)}>
                                          {renderCheckbox(isChecked ? 'checked' : 'unchecked')}
                                        </button>
                                        <div className='text-sm select-none cursor-pointer flex-1 flex items-center justify-between' onClick={() => handleToggleItem(item.id, selectedPassages, setSelectedPassages)}>
                                          <span>{item.judul_perikop || item.passage_title || item.passage_reference}</span>
                                          <span className='text-xs text-muted-foreground'>{item.passage_reference}</span>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* STORIES TAB */}
          {activeTab === 'stories' && (
            <div className='space-y-4'>
              {Object.keys(storiesTree).length === 0 && <div className='text-center py-8 text-muted-foreground'>Tidak ada data stories.</div>}
              {Object.entries(storiesTree).map(([cat, itemsArray]) => {
                const items = itemsArray as any[]
                const catState = getGroupState(items, selectedStories)
                const isExpanded = !!expandedCats[`stor-${cat}`]

                // Sort by global_order if possible
                const sortedItems = [...items].sort((a, b) => (a.global_order || 0) - (b.global_order || 0))

                return (
                  <div key={cat} className='border border-[hsl(var(--border))]/50 rounded overflow-hidden'>
                    <div className={`flex items-center gap-3 p-2 bg-[hsl(var(--muted))]/10 hover:bg-[hsl(var(--muted))]/20 transition-colors ${isExpanded ? 'border-b border-[hsl(var(--border))]/50' : ''}`}>
                      <button onClick={() => toggleCat(`stor-${cat}`)} className='p-1 text-muted-foreground'>
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>
                      <button onClick={() => handleToggleGroup(items, selectedStories, setSelectedStories)}>
                        {renderCheckbox(catState)}
                      </button>
                      <div className='font-bold text-sm select-none cursor-pointer' onClick={() => toggleCat(`stor-${cat}`)}>
                        {cat} <span className='text-xs font-normal text-muted-foreground'>({items.length} cerita)</span>
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className='pl-10 py-2 flex flex-col gap-1 bg-[hsl(var(--subtle))]/10'>
                        {sortedItems.map(item => {
                          const isChecked = selectedStories[item.id]
                          return (
                            <div key={item.id} className='flex items-center gap-3 hover:bg-[hsl(var(--muted))]/10 p-1.5 rounded'>
                              <button onClick={() => handleToggleItem(item.id, selectedStories, setSelectedStories)}>
                                {renderCheckbox(isChecked ? 'checked' : 'unchecked')}
                              </button>
                              <div className='text-sm select-none cursor-pointer flex-1 flex items-center justify-between' onClick={() => handleToggleItem(item.id, selectedStories, setSelectedStories)}>
                                <span>{item.judul_cerita || item.story_title}</span>
                                <span className='text-xs text-muted-foreground'>{item.dasar_perikop}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className='p-5 border-t border-[hsl(var(--border))] bg-[hsl(var(--muted))]/10 flex justify-between items-center'>
          <div className='text-xs font-bold text-muted-foreground'>
            <span className='text-foreground'>{totalSelected}</span> item terpilih
          </div>
          <div className='flex gap-3'>
            <Button variant='outline' onClick={onClose}>Batal</Button>
            <Button variant='primary' onClick={handleSave} disabled={totalSelected === 0}>
              Tambahkan Target
            </Button>
          </div>
        </div>

      </Card>
    </div>
  )
}
