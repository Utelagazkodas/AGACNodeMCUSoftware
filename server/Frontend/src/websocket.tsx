export let socket : WebSocket

export function initializeWebsocket(){
    socket = new WebSocket("ws://"+window.location.hostname+":443")

    socket.addEventListener("message", (event)=>{
        let t = JSON.parse(event.data)
    })
}

export function launchRocket(){
    socket.send("")
}
