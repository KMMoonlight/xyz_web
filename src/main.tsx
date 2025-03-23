import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom"
import * as React from "react"


const RenderRoot: React.FC = () => {
    return (
        <BrowserRouter>
            <App />
        </BrowserRouter>
    )
}

createRoot(document.getElementById('root')!).render(
    <RenderRoot />
)



