import React, { useState } from "react";
import { initializeWebsocket } from "./websocket";

export function Connect() : React.ReactNode {
    const [token, setToken] = useState("token")
    const [tokenEnable, setTokenEnable] = useState(true)

    return (<>
        <input type="button" value="connect" onClick={()=>{initializeWebsocket((!tokenEnable) ? token: undefined)}}/>
        <input type="text" name="tokenText" id="tokenText" disabled={tokenEnable} onChange={(event) => {setToken(event.target.value)}} value={token}/>
        <input type="checkbox" name="tokenCheck" id="tokenCheck" onClick={()=>{setTokenEnable(!tokenEnable)}} />
    </>)
}