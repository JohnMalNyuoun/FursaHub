import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import './index.css'
import App from './App.jsx'

const savedYouthSettings = sessionStorage.getItem('fh_settings_youth_tab');
const savedOrgSettings = sessionStorage.getItem('fh_settings_org_tab');

try {
  const preferredTheme =
    (savedYouthSettings && JSON.parse(savedYouthSettings)?.theme)
    || (savedOrgSettings && JSON.parse(savedOrgSettings)?.theme)
    || 'dark';
  document.documentElement.setAttribute('data-theme', preferredTheme);
} catch (err) {
  document.documentElement.setAttribute('data-theme', 'dark');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)