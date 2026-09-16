import '@fontsource-variable/source-sans-3'
import '@/styles/index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/app/App'
import { invariant } from '@/lib/assert'
import { installGlobalErrorLogging } from '@/lib/logger'

// Mounts the app and nothing else. Providers: app/Providers.tsx. Routes: app/routes/.
installGlobalErrorLogging()

const rootElement = document.getElementById('root')
invariant(rootElement, 'index.html is missing the #root element')

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
