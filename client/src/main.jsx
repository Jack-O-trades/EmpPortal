import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import axios from 'axios'

// Set global base URL for all axios requests
// This allows the frontend to connect to the Render backend in production
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
