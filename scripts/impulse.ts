import {  threshold } from './util.ts';
import { trapezoid } from './util.ts';
const forcesfile =await Deno.readFileSync("./data/launch5/force.txt")
const timestampsfile = await Deno.readFileSync("./data/launch5/timestamp.txt")

const decoder = new TextDecoder("utf-8");



const forces : number[] = JSON.parse(decoder.decode(forcesfile))
const timestamps : number[] = JSON.parse(decoder.decode(timestampsfile))


const endTrim = 557
const startTrim = 1522

forces.splice(0, startTrim)
forces.splice(forces.length - endTrim, endTrim)

timestamps.splice(0, startTrim)
timestamps.splice(timestamps.length - endTrim, endTrim)

if(forces.length != timestamps.length){
    throw "you are gay and fat and noone loves you"
}

let i = 0
let sum = 0

const before = forces[0]
const after = forces[forces.length-1]

const THRESHOLD = 0.1

while (threshold(forces[i+1], before, THRESHOLD) ){

forces.splice(i, 1)
timestamps.splice(i, 1)

}

i = forces.length -1

while(threshold(forces[i-1], after, THRESHOLD)){

    forces.splice(i,1)
    timestamps.splice(i, 1)

    i--
}

i = 0
const d :number = (before-after) / forces.length

while(i < forces.length-1){
    sum += trapezoid(forces[i] - (d * i), forces[i+1] - (d * (i + 1)), (timestamps[i +1] - timestamps[i]) / 1000)


    i++
}

console.log(sum)