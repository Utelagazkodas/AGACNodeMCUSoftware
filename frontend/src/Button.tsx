import {  useEffect, useMemo, useState } from "react"
import { socket, tables } from "./websocket"

export let setLaunchedGlobal : Function[] = []


function Button() : JSX.Element{

    const [launched, setLaunched] = useState<boolean | undefined>( undefined)
    setLaunchedGlobal.push(setLaunched)



    
        useEffect(()=>{
            let t = tables.get("launched")
        if(t){
            let temp = t[t.length-1]
        
            if(typeof(temp) == "boolean"){
                setLaunched(temp)
            }      
        }
    
        }, [])


    return (
        <div className="flex justify-center h-40">
    <input value="LAUNCH" type="button" disabled={!shouldButtonBePressable(launched)} onClick={()=>{socket.send('{"table" : "launched", "value" : true, "instant" : true}')}} className="p-5 transition-all duration-200 rounded-2xl text-8xl text-cyan-400 bg-slate-500 enabled:hover:cursor-pointer enabled:hover:p-8 enabled:active:p-4 enabled:active:h-[9.75rem] enabled:active:mt-[0.25rem]"/>
    </div>
    )
}

function shouldButtonBePressable(launched : boolean | undefined) : boolean{
    
    if(!launched){
        return true
    }
    return false
}


export default Button