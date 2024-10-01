import * as webSocket from "ws"
import { log, logError } from "./logger.js"
import { tables, token, wss, settings } from "./index.js"
import { ClientRequest } from "http"
import { error, table } from "console"
import { formatText, validVariable } from "./format.js"
import { clearInterval } from "timers"

var chunkInterval: NodeJS.Timeout = null

var sendOut: Map<string, unknown[]> = new Map<string, unknown[]>()
var snapShot: Map<string, unknown[]> = new Map<string, unknown[]>()

var amountOfDatas : number = undefined

export function connection(ws: webSocket.WebSocket, req: ClientRequest) {
    log("Someone Connected to websocket", ["with ip: " + req.socket.remoteAddress])


    // sends the websocket all the existing tables
    var temp: { entries: [{ table: string, values: unknown[] }] } = { entries: [null] }

    // needs this to work
    temp.entries.pop()

    //loops through tables back and adds all the data to the temp variable
    snapShot.forEach((value: unknown[], key: string) => {
        temp.entries.push({ table: key, values: value })
    })
    ws.send(JSON.stringify(temp))


    // sets the default authentication to false
    var authenticated: boolean = false

    ws.on("message", (data: webSocket.RawData, isBinary: boolean) => {


        // authenticates the websocket if they send the token
        if (token == data.toString()) {
            log("Authenticated a websocket")

            if (settings.sendVerificationBack) {
                ws.send("authenticated")
            }
            authenticated = true

            return

        }
        // AUTHENTIACETED SENDS MESSAGE
        else if (authenticated == true) {
            var stringified = data.toString()

            if (stringified == "ready"){
                addData("launched", false)
                send()
                return
            }
            else if(stringified == "launch"){
                addData("launched", undefined)
                send()
                return
                
            }
            else if(stringified == "launched"){
                addData("launched", true)
                send()
                return
            }


            //if the message is too long terminates it
            if (stringified.length > settings.messageLenghtMaximum) {
                logError(["Message too long"])
                ws.terminate()
                return
            }

            


            // checks if the thing sent is valid json
            try {
                var newEntrie: {
                    entries: [{ table: string, value: unknown, values: [unknown] }],
                } = JSON.parse(stringified)

                let hasTimeStamp : boolean = false;
                let SameLenght : number = undefined

                

                if (validVariable(newEntrie.entries) || newEntrie.entries.length > 1) {
                    if(newEntrie.entries.length != amountOfDatas && amountOfDatas != undefined && settings.sameDataEveryTime){
                        throw "you must have the exact same tables every time"
                    }


                    newEntrie.entries.forEach((entrie: { table: string, value: unknown, values: [unknown] }) => {
                        if(entrie.table == "launched"){
                            throw "launched table is reserved"
                        }
                        else if(entrie.table == "timestamp"){
                            hasTimeStamp = true
                        }




                        //checks if value exists but values doesnt
                        if (validVariable(entrie.value) && !validVariable(entrie.values)) {
                            addData(entrie.table, entrie.value)

                            if(SameLenght == undefined || !settings.necesarryTimeStampTable){
                                SameLenght = 1
                            }
                            else if(SameLenght != 1){
                                throw "all values for all tables have to be the same length"
                            }
                        }
                        //checks if values exists but value doesnt 
                        else if (!validVariable(entrie.value) && validVariable(entrie.values)) {
                            addData(entrie.table, entrie.values, true)

                            if(SameLenght == undefined || !settings.necesarryTimeStampTable){
                                SameLenght = entrie.values.length
                            }
                            else if(SameLenght != entrie.values.length){
                                throw "all values for all tables have to be the same length"
                            }

                        } else {
                            throw "you cant have value and values both or neither in entries"
                        }
                    })
                } else {
                    // different errors
                    throw "entries or table has to have more than one (timestamp) value"
                    
                }

                if(settings.sameDataEveryTime && amountOfDatas == undefined){
                    amountOfDatas = newEntrie.entries.length
                }

                if(!hasTimeStamp && settings.necesarryTimeStampTable){
                    throw "a timestamp table is necesarry"
                }


                // starts the chunk interval
                if (chunkInterval == null && settings.chunkInterval != 0) {
                    chunkInterval = setInterval(send, settings.chunkInterval * 1000)
                } else if (settings.chunkInterval == 0) {
                    send()
                }

                return

            } catch (err) {
                // throws an error if there is a problem parsing the json
                logError(["Bad message: " + data.toString(), err])
                ws.terminate()
                return
            }

        }

        // Terminates the websocket if it isnt authenticated and tries to send a message
        log("Terminated websocket", ["With ip: " + req.socket.remoteAddress, "Tried sending message: " + data.toString()])
        ws.terminate()
    })



    // Handles closing
    ws.on("close", () => {
        if (authenticated) {
            log("Terminated websocket", ["With ip: " + req.socket.remoteAddress, "Closed", "Unauthenticated him"])
            authenticated = false
            ws.terminate()
            return
        }

        log("Terminated websocket", ["With ip: " + req.socket.remoteAddress, "Closed"])
        ws.terminate()
    })

    // handles error
    ws.on("error", () => {
        if (authenticated) {
            log("Terminated websocket", ["With ip: " + req.socket.remoteAddress, "Error occured", "Unauthenticated him"])
            authenticated = false
            ws.terminate()
            return
        }
        log("Terminated websocket", ["With ip: " + req.socket.remoteAddress, "Error occured"])

        ws.terminate()
    })

}


function addData(table: string, value: any, isArray: boolean = false) {

    // if the value is an array then loops through it
    if (typeof value == typeof [] && isArray) {
        value.forEach((element) => {
            addData(table, element)
        })
        return
    }

    if (tables.has(table) == false) {
        if (settings.sameDataEveryTime && amountOfDatas != undefined){
            throw "you cant create new datas after its established"
        }


        // checks for illegal charachters
        if (table != formatText(table)) {
            throw "illegal charachter in table"
        }

        //creates table
        tables.set(table, [value])

        // adds the value to the sendout
        addToSendOut(table, value)

        return
    }

    var values = tables.get(table)

    if (typeof values[0] == typeof value || settings.multipleTypesInTable || table == "launched") {
        // adds new value to the table
        values[values.length] = value
        tables.set(table, values)

        // adds the value to the sendout
        addToSendOut(table, value)

        return true
    }
    else {
        throw "all values in the table need to be the same type"
    }


}

function send() {

    //  clears the chunks interval
    clearInterval(chunkInterval)
    chunkInterval = null

    var temp: { entries: [{ table: string, values: unknown[] }] } = { entries: [null] }

    // needs this to work
    temp.entries.pop()

    //loops through send back and adds all the data to the temp variable
    sendOut.forEach((value: unknown[], key: string) => {
        temp.entries.push({ table: key, values: value })
    })

    var i = 0

    var data = JSON.stringify(temp)

    // sends out the data to all the connected websockets
    wss.clients.forEach((client: webSocket.WebSocket) => {
        if (client.readyState == webSocket.WebSocket.OPEN) {
            i += 1
            client.send(data)
        }

    })

    log("sent out new data", ["to " + i + " number of clients", data])

    snapShot = tables

    // resets sendOut
    sendOut = new Map<string, unknown[]>()
}



// adds values to the send out map
function addToSendOut(table: string, value: unknown) {
    if (sendOut.has(table)) {

        var add = sendOut.get(table)
        add[add.length] = value

        sendOut.set(table, add)
        return
    }
    else {
        sendOut.set(table, [value])
    }

}