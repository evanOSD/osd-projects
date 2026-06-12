// src/app/(dashboard)/projects/page.tsx

'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useProjectsList } from '@/hooks/queries/database/useProjects'
import { useProject } from '@/context/ProjectContext'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/app/(dashboard)/dummy/Buttons'
import { Input } from '@/app/(dashboard)/dummy/Forms'
import { Select, SelectOption } from '@/app/(dashboard)/dummy/Select'
import { Badge } from '@/app/(dashboard)/dummy/Badges'
import MainContentTooltip from '@/components/ui/MainContentTooltip'
import {
  Search,
  Users,
  Compass,
  Award,
  Calendar,
  AlertCircle,
  Clock,
  Briefcase,
  Layers,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  BookOpen
} from 'lucide-react'

export default function ProjectsCatalogPage() {
  const { data: projects = [], isLoading, isError, error } = useProjectsList()
  const { setSelectedProject } = useProject()
  const router = useRouter()

  useEffect(() => {
    document.title = 'Projects Catalog | OSD Projects'
  }, [])

  // State pencarian, filter, dan sorting
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | number>('all')
  const [sortBy, setSortBy] = useState<string | number>('name-asc')

  // Opsi filter status
  const statusOptions: SelectOption[] = [
    { label: 'Semua Status', value: 'all' },
    { label: 'Belum Dimulai (Not Started)', value: 'not_started' },
    { label: 'Sedang Berjalan (On Going)', value: 'on_going' },
    { label: 'Selesai (Completed)', value: 'completed' }
  ]

  // Opsi sorting
  const sortOptions: SelectOption[] = [
    { label: 'Nama Proyek (A - Z)', value: 'name-asc' },
    { label: 'Nama Proyek (Z - A)', value: 'name-desc' },
    { label: 'Tanggal Mulai (Terdahulu)', value: 'start-asc' },
    { label: 'Tanggal Mulai (Terbaru)', value: 'start-desc' },
    { label: 'Tenggat Waktu (Terdekat)', value: 'end-asc' },
    { label: 'Tenggat Waktu (Terlama)', value: 'end-desc' }
  ]

  // Filter & Sort data proyek
  const filteredAndSortedProjects = useMemo(() => {
    let result = [...projects]

    // 1. Pencarian Teks
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        p =>
          p.project_name.toLowerCase().includes(q) ||
          (p.project_description && p.project_description.toLowerCase().includes(q))
      )
    }

    // 2. Filter Status
    if (statusFilter !== 'all') {
      result = result.filter(p => p.project_status === statusFilter)
    }

    // 3. Sorting
    result.sort((a, b) => {
      if (sortBy === 'name-asc') {
        return a.project_name.localeCompare(b.project_name)
      }
      if (sortBy === 'name-desc') {
        return b.project_name.localeCompare(a.project_name)
      }

      if (sortBy === 'start-asc') {
        if (!a.project_start_date) return 1
        if (!b.project_start_date) return -1
        return new Date(a.project_start_date).getTime() - new Date(b.project_start_date).getTime()
      }
      if (sortBy === 'start-desc') {
        if (!a.project_start_date) return 1
        if (!b.project_start_date) return -1
        return new Date(b.project_start_date).getTime() - new Date(a.project_start_date).getTime()
      }

      if (sortBy === 'end-asc') {
        if (!a.project_end_date) return 1
        if (!b.project_end_date) return -1
        return new Date(a.project_end_date).getTime() - new Date(b.project_end_date).getTime()
      }
      if (sortBy === 'end-desc') {
        if (!a.project_end_date) return 1
        if (!b.project_end_date) return -1
        return new Date(b.project_end_date).getTime() - new Date(a.project_end_date).getTime()
      }

      return 0
    })

    return result
  }, [projects, searchQuery, statusFilter, sortBy])

  // Helper: Format tanggal lokal Indonesia
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateStr))
  }

  // Helper: Hitung kemajuan waktu & sisa hari
  const getProjectTimeProgress = (startStr: string | null, endStr: string | null) => {
    if (!endStr) {
      return { daysRemaining: null, percentage: 0, color: 'stroke-[hsl(var(--muted-foreground))] text-muted-foreground', label: 'Tenggat tidak diatur' }
    }

    const end = new Date(endStr)
    const now = new Date()
    end.setHours(0, 0, 0, 0)
    now.setHours(0, 0, 0, 0)

    const remaining = end.getTime() - now.getTime()
    const daysRemaining = Math.ceil(remaining / (1000 * 60 * 60 * 24))

    if (daysRemaining < 0) {
      return {
        daysRemaining,
        percentage: 0,
        color: 'stroke-[hsl(var(--danger))] text-[hsl(var(--danger))]',
        label: `Terlambat ${Math.abs(daysRemaining)} hari`
      }
    }

    if (daysRemaining === 0) {
      return {
        daysRemaining,
        percentage: 100,
        color: 'stroke-[hsl(var(--warning))] text-[hsl(var(--warning))]',
        label: 'Hari ini'
      }
    }

    // Hitung persentase durasi tersisa jika ada tanggal mulai
    let percentage = 100
    if (startStr) {
      const start = new Date(startStr)
      start.setHours(0, 0, 0, 0)
      const total = end.getTime() - start.getTime()
      if (total > 0) {
        percentage = Math.max(0, Math.min(100, Math.round((remaining / total) * 100)))
      }
    } else {
      // Standar fallback: sisa 180 hari dianggap 100%
      percentage = Math.max(0, Math.min(100, Math.round((daysRemaining / 180) * 100)))
    }

    let color = 'stroke-[hsl(var(--success))] text-[hsl(var(--success))]'
    if (daysRemaining <= 30) {
      color = 'stroke-[hsl(var(--danger))] text-[hsl(var(--danger))]'
    } else if (daysRemaining <= 90) {
      color = 'stroke-[hsl(var(--warning))] text-[hsl(var(--warning))]'
    }

    // Hitung selisih presisi tahun, bulan, hari
    let years = end.getFullYear() - now.getFullYear()
    let months = end.getMonth() - now.getMonth()
    let days = end.getDate() - now.getDate()

    if (days < 0) {
      months -= 1
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0)
      days += prevMonth.getDate()
    }

    if (months < 0) {
      years -= 1
      months += 12
    }

    const parts = []
    if (years > 0) parts.push(`${years} tahun`)
    if (months > 0) parts.push(`${months} bulan`)
    if (days > 0 || parts.length === 0) parts.push(`${days} hari`)
    const label = parts.join(', ')

    return {
      daysRemaining,
      percentage,
      color,
      label
    }
  }

  // Aksi navigasi ke dashboard proyek
  const handleViewDashboard = (projectName: string, shortId: string) => {
    setSelectedProject(projectName)
    router.push(`/projects/${shortId}/info`)
  }

  return (
    <div className='p-6 space-y-6'>

        {/* Search and Filter Panel */}
        <Card className='p-4 bg-[hsl(var(--surface))] border border-[hsl(var(--border))]'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-end'>
            {/* Input Pencarian */}
            <div className='relative w-full'>
              <label className='block mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                Cari Proyek
              </label>
              <div className='relative'>
                <Input
                  type='text'
                  placeholder='Cari nama atau deskripsi...'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className='pl-9'
                />
                <Search className='absolute left-3 top-3.5 w-4 h-4 text-muted-foreground' />
              </div>
            </div>

            {/* Filter Status */}
            <div>
              <label className='block mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                Status Proyek
              </label>
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={val => setStatusFilter(val || 'all')}
                placeholder='Semua Status'
              />
            </div>

            {/* Sorting */}
            <div>
              <label className='block mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                Urutkan Berdasarkan
              </label>
              <Select
                options={sortOptions}
                value={sortBy}
                onChange={val => setSortBy(val || 'name-asc')}
                placeholder='Urutkan Proyek'
              />
            </div>
          </div>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className='grid grid-cols-1 gap-6'>
            {[1, 2, 3].map(i => (
              <Card key={i} className='p-6 h-64 border border-[hsl(var(--border))] animate-pulse bg-[hsl(var(--surface))]/50'>
                <div className='h-6 bg-[hsl(var(--muted))] w-1/4 rounded mb-4'></div>
                <div className='h-4 bg-[hsl(var(--muted))] w-3/4 rounded mb-2'></div>
                <div className='h-4 bg-[hsl(var(--muted))] w-1/2 rounded mb-6'></div>
                <div className='flex justify-between items-center'>
                  <div className='h-8 bg-[hsl(var(--muted))] w-32 rounded'></div>
                  <div className='h-12 bg-[hsl(var(--muted))] w-12 rounded-full'></div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <Card className='p-6 border border-[hsl(var(--danger))/0.2] bg-[hsl(var(--danger-soft))] text-[hsl(var(--danger))] flex items-center gap-3'>
            <AlertCircle className='w-5 h-5 shrink-0' />
            <div>
              <p className='font-semibold'>Gagal mengambil data proyek</p>
              <p className='text-sm opacity-90'>{(error as any)?.message || 'Terjadi kesalahan tidak dikenal.'}</p>
            </div>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && !isError && filteredAndSortedProjects.length === 0 && (
          <Card className='p-12 text-center border border-[hsl(var(--border))] bg-[hsl(var(--surface))]'>
            <Compass className='w-12 h-12 text-muted-foreground mx-auto mb-4 stroke-1 animate-bounce' />
            <h3 className='text-lg font-semibold text-[hsl(var(--foreground))]'>Tidak ada proyek ditemukan</h3>
            <p className='text-sm text-muted-foreground mt-1 max-w-md mx-auto'>
              Coba sesuaikan kata kunci pencarian atau filter status untuk menemukan proyek yang dicari.
            </p>
          </Card>
        )}

        {/* Catalog List */}
        {!isLoading && !isError && filteredAndSortedProjects.length > 0 && (
          <div className='grid grid-cols-1 gap-6'>
            {filteredAndSortedProjects.map(project => {
              // Hitung jumlah target terjemahan & outcomes
              const translationGoalsCount = project.project_languages?.reduce(
                (acc, pl) => acc + (pl.project_translation_goals?.length || 0),
                0
              ) || 0
              const outcomesCount = project.project_outcomes?.length || 0

              // Gabungkan daftar bahasa ethnologue secara unik
              const languageNames = Array.from(
                new Set(
                  project.project_languages
                    ?.map(pl => pl.languages?.name_in_ethnologue)
                    .filter(Boolean)
                )
              ).join(', ') || 'Belum diatur'

              // Hitung info kemajuan waktu & sisa hari
              const timeInfo = getProjectTimeProgress(project.project_start_date, project.project_end_date)

              // Setup SVG Progress Ring
              const radius = 38
              const stroke = 6
              const normalizedRadius = radius - stroke * 2
              const circumference = normalizedRadius * 2 * Math.PI
              const strokeDashoffset = circumference - (timeInfo.percentage / 100) * circumference

              // Badge variant untuk status proyek
              const getStatusVariant = (status: string | null) => {
                if (status === 'completed') return 'success'
                if (status === 'on_going') return 'primary'
                return 'muted'
              };

              const getStatusLabel = (status: string | null) => {
                if (status === 'completed') return 'Selesai'
                if (status === 'on_going') return 'Sedang Berjalan'
                return 'Belum Dimulai'
              };

              return (
                <Card
                  key={project.id}
                  className='p-6 border border-[hsl(var(--border))] bg-[hsl(var(--surface))] hover:shadow-md hover:border-[hsl(var(--primary))/0.3] transition-all duration-300'
                >
                  <div className='flex flex-col lg:flex-row justify-between gap-6'>
                    {/* BODY KIRI: Informasi Utama */}
                    <div className='flex-1 space-y-4'>
                      {/* Header Proyek */}
                      <div className='flex flex-wrap items-center justify-between gap-3'>
                        <div className='flex flex-wrap items-center gap-3'>
                          <Button 
                            variant='ghost-primary' 
                            className='text-xl font-bold text-[hsl(var(--foreground))] tracking-tight px-0 hover:bg-transparent h-auto'
                            onClick={() => handleViewDashboard(project.project_name, project.short_id)}
                          >
                            {project.project_name}
                          </Button>
                          <Badge variant={getStatusVariant(project.project_status)}>
                            {getStatusLabel(project.project_status)}
                          </Badge>
                        </div>
                        <div className='flex gap-4 text-xs text-muted-foreground ml-auto'>
                          <div>
                            <span className='font-semibold'>Mulai:</span> {formatDate(project.project_start_date)}
                          </div>
                          <div>
                            <span className='font-semibold'>Selesai:</span> {formatDate(project.project_end_date)}
                          </div>
                        </div>
                      </div>

                      {/* Deskripsi Proyek */}
                      <p className='text-sm text-muted-foreground line-clamp-2 leading-relaxed'>
                        {project.project_description || 'Tidak ada deskripsi detail untuk proyek ini.'}
                      </p>

                      {/* Grid Informasi Pendukung (Real + Placeholders) */}
                      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 pt-2 border-t border-[hsl(var(--border))/0.5] text-xs'>
                        {/* 1. Manager Proyek (Real) */}
                        <div className='flex items-start gap-2'>
                          <Users className='w-4 h-4 text-muted-foreground shrink-0 mt-0.5' />
                          <div>
                            <span className='block font-semibold text-muted-foreground'>Project Manager</span>
                            <span className='text-[hsl(var(--foreground))]'>{project.project_members?.filter(pm => pm.role === 'project_manager').map(pm => pm.users?.user_name).filter(Boolean).join(', ') || '-'}</span>
                          </div>
                        </div>

                        {/* 2. Daftar Bahasa (Real) */}
                        <div className='flex items-start gap-2'>
                          <Compass className='w-4 h-4 text-muted-foreground shrink-0 mt-0.5' />
                          <div>
                            <span className='block font-semibold text-muted-foreground'>Bahasa</span>
                            <span className='text-[hsl(var(--foreground))] truncate max-w-[150px] inline-block' title={languageNames}>
                              {languageNames}
                            </span>
                          </div>
                        </div>

                        {/* 3. Project Type (Real) */}
                        <div className='flex items-start gap-2'>
                          <Briefcase className='w-4 h-4 text-muted-foreground shrink-0 mt-0.5' />
                          <div>
                            <span className='block font-semibold text-muted-foreground'>Project Type</span>
                            <span className='text-[hsl(var(--foreground))]'>{project.project_type || '-'}</span>
                          </div>
                        </div>

                        {/* 4. Sensitivity Level (Real) */}
                        <div className='flex items-start gap-2'>
                          <ShieldCheck className='w-4 h-4 text-muted-foreground shrink-0 mt-0.5' />
                          <div>
                            <span className='block font-semibold text-muted-foreground'>Sensitivity</span>
                            <div className='flex items-center gap-1'>
                              <span className='text-[hsl(var(--foreground))]'>{project.sensitivity || '-'}</span>
                              <MainContentTooltip content='Tingkat sensitivitas penerjemahan pada masyarakat sasaran'>
                                <AlertCircle className='w-3 h-3 text-muted-foreground cursor-help' />
                              </MainContentTooltip>
                            </div>
                          </div>
                        </div>

                        {/* 5. Managed By (Real) */}
                        <div className='flex items-start gap-2'>
                          <Layers className='w-4 h-4 text-muted-foreground shrink-0 mt-0.5' />
                          <div>
                            <span className='block font-semibold text-muted-foreground'>Managed By</span>
                            <span className='text-[hsl(var(--foreground))]'>{project.organizations?.org_acronym || '-'}</span>
                          </div>
                        </div>

                        {/* 6. Team Size (Real) */}
                        <div className='flex items-start gap-2'>
                          <Users className='w-4 h-4 text-muted-foreground shrink-0 mt-0.5' />
                          <div>
                            <span className='block font-semibold text-muted-foreground'>Team Size</span>
                            <span className='text-[hsl(var(--foreground))]'>
                              {project.project_plans?.reduce((sum, plan) => {
                                return sum + (plan.number_of_translators || 0)
                              }, 0) || '0'} Orang
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* BODY KANAN: Visualizer & Progress Metrics */}
                    <div className='flex flex-row lg:flex-col justify-between items-center lg:items-end gap-6 shrink-0 lg:w-56 border-t lg:border-t-0 lg:border-l border-[hsl(var(--border))/0.5] pt-4 lg:pt-0 lg:pl-6'>
                      {/* Sisa Hari Visualizer (Radial Progress) */}
                      <div className='flex items-center gap-3 lg:w-full lg:justify-end'>
                        <div className='text-left lg:text-right'>
                          <span className='block text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                            Sisa Waktu
                          </span>
                          <span className='block text-sm font-bold text-[hsl(var(--foreground))]'>
                            {timeInfo.daysRemaining !== null
                              ? timeInfo.daysRemaining < 0
                                ? 'Overdue'
                                : `${timeInfo.daysRemaining} Hari`
                              : '-'}
                          </span>
                          <span className='block text-[10px] text-muted-foreground mt-0.5 leading-none'>
                            {timeInfo.daysRemaining !== null
                              ? timeInfo.label
                              : 'Tenggat tidak diatur'}
                          </span>
                        </div>

                        {/* Ring Visual */}
                        <div className='relative w-[76px] h-[76px] shrink-0 flex items-center justify-center bg-[hsl(var(--muted))]/10 rounded-full'>
                          {timeInfo.daysRemaining !== null ? (
                            <>
                              <svg height={radius * 2} width={radius * 2} className='transform -rotate-90'>
                                <circle
                                  stroke='hsl(var(--muted))'
                                  fill='transparent'
                                  strokeWidth={stroke}
                                  strokeOpacity={0.25}
                                  r={normalizedRadius}
                                  cx={radius}
                                  cy={radius}
                                />
                                <circle
                                  className={`transition-all duration-500 ease-in-out ${timeInfo.color}`}
                                  stroke='currentColor'
                                  fill='transparent'
                                  strokeWidth={stroke}
                                  strokeDasharray={circumference + ' ' + circumference}
                                  style={{ strokeDashoffset }}
                                  r={normalizedRadius}
                                  cx={radius}
                                  cy={radius}
                                />
                              </svg>
                              <div className='absolute text-[11px] font-black text-[hsl(var(--foreground))]'>
                                {timeInfo.daysRemaining < 0 ? '❌' : `${timeInfo.percentage}%`}
                              </div>
                            </>
                          ) : (
                            <Clock className='w-6 h-6 text-muted-foreground/50' />
                          )}
                        </div>
                      </div>

                      {/* Progress Ringkasan Target */}
                      <div className='text-left lg:text-right space-y-1.5'>
                        <div className='flex items-center lg:justify-end gap-1.5 text-xs text-muted-foreground'>
                          <CheckCircle2 className='w-3.5 h-3.5 text-primary' />
                          <span>{translationGoalsCount} Kitab Target</span>
                        </div>
                        <div className='flex items-center lg:justify-end gap-1.5 text-xs text-muted-foreground'>
                          <Clock className='w-3.5 h-3.5 text-success' />
                          <span>{outcomesCount} Outcomes (Dampak)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </Card>
              )
            })}
          </div>
        )}
    </div>
  )
}
