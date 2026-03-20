import { useCallback, useEffect, useSyncExternalStore } from 'react'

const STORAGE_KEY = 'maaden-theme'
export type ThemeMode = 'light' | 'dark'

function getSnapshot(): ThemeMode {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

function subscribe(cb: () => void) {
  const obs = new MutationObserver(cb)
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  return () => obs.disconnect()
}

function getServerSnapshot(): ThemeMode {
  return 'light'
}

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement
  if (mode === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
  try {
    localStorage.setItem(STORAGE_KEY, mode)
  } catch {
    /* ignore */
  }
}

export function initThemeFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null
    if (stored === 'dark' || stored === 'light') {
      applyTheme(stored)
      return
    }
  } catch {
    /* ignore */
  }
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark')
  } else {
    applyTheme('light')
  }
}

export function useTheme() {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  useEffect(() => {
    initThemeFromStorage()
  }, [])

  const setMode = useCallback((m: ThemeMode) => {
    applyTheme(m)
  }, [])

  const toggle = useCallback(() => {
    applyTheme(mode === 'dark' ? 'light' : 'dark')
  }, [mode])

  return { mode, setMode, toggle }
}
