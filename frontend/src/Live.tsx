import React, { useState } from "react";
import { tables } from "./websocket";
import { setLaunchedGlobal } from "./Button";
import {LineChart, Legend, Tooltip, XAxis, YAxis, Line, CartesianGrid} from "recharts"
import { generateRandomColor } from "./util/utility";
import { globLaunched } from "./main";



let colors : Map<string, string> = new Map<string, string>()
let lines : string[] = []

export let globalSetLocalTables : Function = ()=>{}

export function Live(): React.ReactNode {
    let [localTables, setLocalTables]= useState(new Map(tables))
    globalSetLocalTables = setLocalTables

    let [launched, setLaunched] = useState(globLaunched)
    setLaunchedGlobal.push(setLaunched)

    

    if(launched){
    return (<>
        <div>Live</div>
        <LineChart width={730} height={250} data={makeData(localTables)} >
            <Legend stroke="#ffffff"/>
            <Tooltip/>
            <XAxis dataKey={"timestamp"} stroke="#ffffff"/>
            <YAxis stroke="#ffffff"/>

            {lines.map((key) =>
                
                    <Line key={key} type={"monotone"} dataKey={key} stroke={colors.get(key)} isAnimationActive={false}/>
                
            )}

            
            <CartesianGrid strokeDasharray="3 3" />
        </LineChart>
    </>)
    }
    else {
        return (<>
            please wait for someone to launch the rocket
        </>)
    }
}

function makeData(toCreate : Map<string, unknown[]>): { [key: string]: any }[] {
    let ret: { [key: string]: any }[] = []
    lines = []

    toCreate.forEach((values, key)=>{
        

        if(key == "launched"){
            return
        }

        // takes care of color
        if(!colors.has(key)){
            colors.set(key, generateRandomColor())
        }

        if(key != "timestamp"){
            lines.push(key)
        }
        

        let i = 0;
        values.forEach((value)=>{
            

            if (!ret[i]) {
                ret[i] = {}
            }

            // Assign the key-value pair for this row (i)
            ret[i][key] = value

            i+=1
        })  
    })

    return ret
}