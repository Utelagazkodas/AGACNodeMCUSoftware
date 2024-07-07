import React, { useState } from "react";
import { initializeWebsocket } from "./websocket";

export function Connect() : React.ReactNode {
    const [token, setToken] = useState("token")
    const [tokenEnable, setTokenEnable] = useState(true)

    return (<>
        <input type="button" value="connect" className="hover:cursor-pointer bg-stone-600 m-2 p-1 text-stone-200 rounded" onClick={()=>{initializeWebsocket((!tokenEnable) ? token: undefined)}}/>
        <input type="text" name="tokenText" id="tokenText" disabled={tokenEnable} className="px-2" onChange={(event) => {setToken(event.target.value)}} value={token}/>
        <input type="checkbox" name="tokenCheck" id="tokenCheck" className="size-6 m-2 hover:cursor-pointer " onClick={()=>{setTokenEnable(!tokenEnable)}} />
    </>)
}