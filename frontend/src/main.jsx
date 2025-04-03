import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom"
import { Socketprovider } from './context/socketprovider.jsx'

createRoot(document.getElementById('root')).render(

  <BrowserRouter>
  <StrictMode>
    <Socketprovider >
    <App />
    </Socketprovider>
  </StrictMode>,
  </BrowserRouter>
)
