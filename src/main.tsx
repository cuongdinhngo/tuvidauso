import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Self-hosted Vietnamese fonts (no Google Fonts <link> in production)
import '@fontsource/be-vietnam-pro/400.css'
import '@fontsource/be-vietnam-pro/500.css'
import '@fontsource/be-vietnam-pro/600.css'
import '@fontsource/be-vietnam-pro/700.css'
import '@fontsource/noto-serif/500.css'
import '@fontsource/noto-serif/600.css'
import '@fontsource/noto-serif/700.css'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
