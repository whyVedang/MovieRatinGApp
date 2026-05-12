import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Theme } from '@radix-ui/themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {AuthProvider}  from "./context/AuthContext.jsx";
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Theme>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
          <App />
          </AuthProvider>
        </QueryClientProvider>
    </Theme>
  </StrictMode>,
)