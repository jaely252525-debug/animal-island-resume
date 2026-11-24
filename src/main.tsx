import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// animal-island-ui 官方样式（含 Nunito / Noto Sans SC 字体），必须引入，否则组件无样式
import 'animal-island-ui/style'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
