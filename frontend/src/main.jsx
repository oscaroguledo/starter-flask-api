import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import UserContextProvider from './contexts/UserContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserContextProvider>
      <BrowserRouter>
        <Toaster richColors position="top-right" />
        <App />
      </BrowserRouter>
    </UserContextProvider>
  </React.StrictMode>,
)
