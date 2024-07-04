import { useState } from 'react';

export let setCounter : Function

function Counter(){
    const [count, setCount] = useState(-1);

    setCounter = setCount

    const style : string = "flex h-10 place-items-center"

    if(count == -1){
        return (<div className={style}></div>)
    }

    else if(count == 0){
        return (<div className={style}>I havent been tased yet</div>)
    }
    else if(count == 1){
        return (<div className={style}>I have been tased 1 time</div>)
    }else {
        return (<div className={style}>I have been tased {count} times</div>)
    }
}

export default Counter