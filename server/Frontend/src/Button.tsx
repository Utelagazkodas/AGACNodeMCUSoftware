import { sendMessage } from "./websocket"

function Button() : JSX.Element{
    return (
        <div className="flex justify-center h-40">
    <input value="TASE" type="button" onClick={()=> {sendMessage()}} className="p-5 transition-all duration-200 rounded-2xl text-8xl text-cyan-400 bg-slate-500 hover:cursor-pointer hover:p-8 active:p-4 active:h-[9.75rem] active:mt-[0.25rem]"></input></div>
    )
}

export default Button