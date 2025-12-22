
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      
    </BrowserRouter>
  </StrictMode>
)
