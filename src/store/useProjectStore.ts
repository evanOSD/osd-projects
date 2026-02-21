// src/store/useProjectStore.ts

import { create } from 'zustand'

type ProjectStore = {
  activeProjectId: string | null
  activeProjectName: string | null
  setActiveProject: (id: string, name: string) => void
  clearActiveProject: () => void
}

export const useProjectStore = create<ProjectStore>((set) => ({
  activeProjectId: null,
  activeProjectName: null,
  
  // Fungsi untuk mengubah proyek yang sedang aktif
  setActiveProject: (id, name) => set({ activeProjectId: id, activeProjectName: name }),
  
  // Fungsi untuk mengosongkan pilihan (opsional, untuk reset)
  clearActiveProject: () => set({ activeProjectId: null, activeProjectName: null }),
}))
