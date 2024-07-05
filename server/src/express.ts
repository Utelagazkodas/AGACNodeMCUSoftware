import * as express from "express"
import * as logger from "./logger.js"
import * as fs from "fs"


const loaded = []

export function get(req: express.Request, res: express.Response) {
    if (req.url == "/" || req.url == ""){
        if(fs.existsSync("docs/index.html")){
            sendFile("docs/index.html", req, res)
        }
    }

    else if(fs.existsSync("docs/" + req.url)){
        sendFile("docs/" + req.url, req,res)
    }
    else {
        res.send("error404")
    }
}

export function started() {
    logger.log("Webserver Sucesfully started")
}

function sendFile(path: string, req: express.Request, res: express.Response): void {

    if(req.url.slice(req.url.length - 3) == ".js"){
        res.setHeader('Content-Type', 'application/javascript'); 
    }

    //checks if the path they are trying to send has already been loaded
    if (loaded[path]) {
        res.write(loaded[path])
        res.end()
        return
    }

    // reads and sends a file
    fs.readFile(path, (err, data) => {

        //if no error is encountered then sends the file and loads it 
        if (err === null) {
            loaded[path] = data
            res.write(data)
            res.end()
            return
        }

        else {
            logger.logError(["An error accured while trying to read file", "the error happened when ip: " + req.ip, "Made " + req.method + " request to: " + req.path, "error: ", err])
            return
        }
    })
}