import {useEffect, useState} from "react"
import {getPosition, getSunRiseSet} from "./helpers/sundata"
import {SunData, Loader} from "./SunData"

export function DataTableSun() {
    const [position, setPosition] = useState({ position: {}})
    const [sunTimes, setSunTimes] = useState({})

    // next step: change this so that data is cached
    // in localstorage so the APIs aren't getting repeatedly hit.
    useEffect(() => {
        getPosition().then((positionData) => {
            setPosition(positionData.coords)
            getSunRiseSet(positionData).then((sunData) => {
                setSunTimes(sunData)
            })
        })
    }, [])

    // ⛔️ Warning: React.jsx: type is invalid -- expected a string
    // 👇 Has to be a function or class, not a variable
    const Panel = () => {
        return Object.entries(sunTimes).length === 0 ? Loader() : SunData(sunTimes)
    }

    return (
        <>
            <Panel />
        </>
    )
}