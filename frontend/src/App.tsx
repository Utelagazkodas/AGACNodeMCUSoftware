import { useEffect, useState } from "react"
import Button, { setLaunchedGlobal } from "./Button"
import { Live } from "./Live"
import { Connect } from "./Connect"

export let setConnectedGlobal :Function = ()=>{
  throw "setConnectedGlobal has not been set yet"
}

export let setAuthenticatedGlobal :Function = ()=>{
  throw "setAuthenticatedGlobal has not been set yet"
}

function App() :JSX.Element {

  useEffect(()=>{
    document.title = "Agac Launch interface :>"
  })

  const [connected, setConnected] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [launched, setLaunched] = useState<boolean | undefined>(undefined)

  setConnectedGlobal = setConnected
  setAuthenticatedGlobal = setAuthenticated


  setLaunchedGlobal.push(setLaunched)


  if(!connected){
    return (
      <>

        <div className="flex flex-col justify-center min-h-screen place-items-center bg-slate-400"><Connect/> </div>
  
      </>
    )
  }

  else if(authenticated && !launched){
    return (
      <>
        <div className="flex flex-col justify-center min-h-screen place-items-center bg-slate-400"> launch<Button/> </div>
  
      </>
    )
  }
  else{
    return (
      <>
        <div className="flex flex-col justify-center min-h-screen place-items-center bg-slate-400"><Live/> </div>
      </>
    )
  }

}

export default App
