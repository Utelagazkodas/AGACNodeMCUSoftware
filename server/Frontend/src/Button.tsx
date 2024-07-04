import { useState } from "react"
import { sendMessage } from "./websocket"

function Button() : JSX.Element{
    const [Launched, setLaunched] = useState(null)

    return (
        <div className="flex justify-center h-40">
    <input value="LAUNCH" type="button" disabled={true} onClick={()=>{alert("pressed")}} className="p-5 transition-all duration-200 rounded-2xl text-8xl text-cyan-400 bg-slate-500 enabled:hover:cursor-pointer enabled:hover:p-8 enabled:active:p-4 enabled:active:h-[9.75rem] enabled:active:mt-[0.25rem] "/>
    </div>
    )
}

export default Button