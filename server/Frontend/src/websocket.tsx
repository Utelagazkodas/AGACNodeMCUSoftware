import { setCounter } from "./Counter"

export let socket : WebSocket


export function initializeWebsocket(){
    socket = new WebSocket("ws://"+window.location.hostname+":443")

    socket.addEventListener("message", (event)=>{
        setCounter(JSON.parse(event.data))
    })
}

export function sendMessage(){
    if(socket.OPEN){
        socket.send("")
    }
}