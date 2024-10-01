import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

export let globLaunched : boolean | undefined = undefined
export function setGlobLaunched(value : boolean  | undefined){
  globLaunched = value
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
) 

