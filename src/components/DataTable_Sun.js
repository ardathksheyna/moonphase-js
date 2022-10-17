import {SunData, Loader} from "./SunData"

export function DataTableSun(props) {

    let sunTimes = props.sunTimes

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