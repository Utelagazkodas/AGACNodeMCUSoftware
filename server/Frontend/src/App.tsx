import { useEffect } from "react"
import Button from "./Button"

function App() :JSX.Element {

  useEffect(()=>{
    document.title = "Agac Launch interface :>"
  })

  return (
    <>


      <div className="flex flex-col justify-center min-h-screen place-items-center bg-slate-400"><Button/> </div>
      

    </>
  )
}

export default App
