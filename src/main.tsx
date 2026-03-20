import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/500.css'
import '@fontsource/ibm-plex-sans/600.css'
import './index.css'
import App from './app/App'
import { ErrorBoundary } from './components/ErrorBoundary'
import { initThemeFromStorage } from './hooks/useTheme'

initThemeFromStorage()

const el = document.getElementById('root')
if (!el) {
  throw new Error('Missing #root element')
}

createRoot(el).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
