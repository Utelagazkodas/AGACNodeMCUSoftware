const forcesfile =await Deno.readFileSync("./data/launch4/force.txt")
const timestampsfile = await Deno.readFileSync("./data/launch4/timestamp.txt")

const decoder = new TextDecoder("utf-8");

const forces : number[] = JSON.parse(decoder.decode(forcesfile))
const timestamps : number[] = JSON.parse(decoder.decode(timestampsfile))


console.log(forces)