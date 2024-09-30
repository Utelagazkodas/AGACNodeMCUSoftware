import React, { useState } from "react";
import { tables } from "./websocket";
import { setLaunchedGlobal } from "./Button";
import {LineChart} from "recharts"

type dataStructure = { timeStamp: number, value: unknown, tableName: string }

export function Live(): React.ReactNode {
    let data = React.useMemo((): [] => makeData(), [tables])

    let [launched, setLaunched] = useState(false);
    setLaunchedGlobal.push(setLaunched);




    return (<>
        <div>Live</div>
        <LineChart>

        </LineChart>
    </>)
}

function makeData(): [] {
    let ret: [] = []

    tables.forEach((values, key)=>{
        ret.push()
    })
    


    return ret
}