import {useEffect, useRef} from "react"
import {drawFavicon, drawMoon} from './helpers/moonfx'

export function Moon() {
    const canvas = useRef()

    useEffect(() => {
        if (typeof canvas == 'object') {
            const context = canvas.current.getContext('2d');
            let {height, width} = canvas.current

            drawMoon(context, {height, width})
            drawFavicon()
        }
    })

    return (
        <canvas ref={canvas} id="currentphase" height="288" width="288">
            You need a browser that supports HTML5 and JavaScript enabled to see this.
        </canvas>
    )
}
