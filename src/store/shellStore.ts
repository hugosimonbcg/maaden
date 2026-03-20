import { create } from 'zustand'
import type { AiPhase, AiPreset } from '../data/types'

export interface ShellState {
  aiDrawerOpen: boolean
  aiActivePreset: AiPreset | null
  actionTrackerCollapsed: boolean
  aiPhase: AiPhase
  openAiPreset: (preset: AiPreset | null) => void
  setAiDrawerOpen: (open: boolean) => void
  setActionTrackerCollapsed: (v: boolean) => void
  setAiPhase: (phase: AiPhase) => void
}

export const useShellStore = create<ShellState>((set) => ({
  aiDrawerOpen: false,
  aiActivePreset: null,
  actionTrackerCollapsed: false,
  aiPhase: 'idle',
  setAiPhase: (aiPhase) => set({ aiPhase }),
  openAiPreset: (preset) =>
    set({
      aiActivePreset: preset,
      aiDrawerOpen: preset !== null,
      aiPhase: preset !== null ? 'speaking' : 'idle',
    }),
  setAiDrawerOpen: (open) =>
    set((s) => ({
      aiDrawerOpen: open,
      aiActivePreset: open ? s.aiActivePreset : null,
      aiPhase: open && s.aiActivePreset ? 'speaking' : open ? s.aiPhase : 'idle',
    })),
  setActionTrackerCollapsed: (actionTrackerCollapsed) => set({ actionTrackerCollapsed }),
}))
