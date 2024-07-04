import { useEffect } from "react"
import Button from "./Button"
import Counter from "./Counter"

function App() :JSX.Element {

  useEffect(()=>{
    document.title = "Tase me"
  })

  return (
    <>


      <div className="flex flex-col justify-center min-h-screen place-items-center bg-slate-400"><Button/> <Counter/></div>
      

    </>
  )
}

export default App
