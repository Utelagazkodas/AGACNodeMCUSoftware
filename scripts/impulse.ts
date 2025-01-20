import {  GRAVITY, threshold } from './util.ts';
import { trapezoid } from './util.ts';
import { AIRDENSITY } from './util.ts';
const forcesfile =await Deno.readFileSync("./data/launch5/force.txt")
const timestampsfile = await Deno.readFileSync("./data/launch5/timestamp.txt")

const decoder = new TextDecoder("utf-8");



const forces : number[] = JSON.parse(decoder.decode(forcesfile))
const timestamps : number[] = JSON.parse(decoder.decode(timestampsfile))


const endTrim = 457 //     5: 457      4: 0
const startTrim = 1522 // 5: 1522     4: 340

forces.splice(0, startTrim)
forces.splice(forces.length - endTrim, endTrim)

timestamps.splice(0, startTrim)
timestamps.splice(timestamps.length - endTrim, endTrim)

if(forces.length != timestamps.length){
    throw "you are gay and fat and noone loves you"
}

let i = 0

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

let impulse : number = 0
let velocity : number = 0


const WEIGHT = 0.2 // WEIGHT IN KG WITHOUT THE ROCKET MOTOR
const RADIUS = 0.01 // RADIUS IN METERS
const DRAGCOEFFICENT = 0.75 // DRAG COEFFICENT OF ROCKET


console.log(forces)

const crossSection = RADIUS * RADIUS * Math.PI 

let mass = WEIGHT + before / GRAVITY
let height = 0
let timetopeak = 0

while(i < forces.length-1){
    //change in impulse
    let time = (timestamps[i +1] - timestamps[i]) / 1000
    timetopeak += time

    let tImpulse = trapezoid(forces[i] - (d * i), forces[i+1] - (d * (i + 1)), time)

    // add impulse to sum
    impulse += tImpulse

    // remove mass from rocket mass
    mass -= d / GRAVITY

    // add to velocity
    let AvgMass = (mass + (mass - d/GRAVITY))/2 
    let tVelocity = velocity
    let drag = 0.5 * AIRDENSITY * velocity * tVelocity* crossSection * DRAGCOEFFICENT
    velocity += (tImpulse / AvgMass) - (time * (drag / AvgMass))

    height += ((velocity + tVelocity ) / 2) * time

    // iterate
    i++
}
// make mass final
mass -= d/GRAVITY

console.log("Height:", height, "Velocity:", velocity);

// Apex loop
const STEP = 0.01;

while (velocity > 0) {
  const drag =
    0.5 * AIRDENSITY * velocity * velocity * crossSection * DRAGCOEFFICENT;

  velocity -= STEP * (GRAVITY + drag / mass);
  height += velocity * STEP;
}

console.log("Final height at apex:", height);