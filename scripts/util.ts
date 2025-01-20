export const AIRDENSITY : number= 1.293
export const GRAVITY : number = 9.80665

export function threshold(value : number, initial: number, threshold : number){
    return !(value > initial + threshold || value < initial - threshold)
}

export function trapezoid(a : number, c: number, h : number) : number{
    return ((a+c)/2)*h
}