import './App.scss';
import {PillControl} from "./components/controls/PillControl"
import {Moon} from "./components/Moon"
import {DataTableMoon} from "./components/DataTable_Moon"
import {DataTableSun} from "./components/DataTable_Sun"
import {useEffect, useState} from "react"
import {getPosition, getSunRiseSet, timeOfDay} from "./components/helpers/sundata"
import {getCurrentConditionsDisplay, getWeatherData} from "./components/helpers/weatherdata"
import {CurrentConditions} from "./components/CurrentConditions"

function App() {
    const [position, setPosition] = useState({ position: {}})
    const [sunTimes, setSunTimes] = useState({})
    const [dayTime, setDayTime] = useState({})
    const [currentWeather, setCurrentWeather] = useState({})
    const [currentWeatherDisplay, setCurrentWeatherDisplay] = useState({})

    useEffect(() => {
        getPosition().then((positionData) => {
            setPosition(positionData.coords)
            getSunRiseSet(positionData).then((sunData) => {
                setSunTimes(sunData)
                setDayTime(timeOfDay(sunData))
            })

            getWeatherData(positionData).then((weatherData) => {
                setCurrentWeatherDisplay(getCurrentConditionsDisplay(weatherData.weather))
                setCurrentWeather(weatherData)
            })
        })
    }, [])

    return (
        <div className={`body ${dayTime} ${currentWeatherDisplay}`}>
            <PillControl/>
            <main>
                <header className="screen-reader-text">
                    <h1 className="h h1">MoonPhase App</h1>
                </header>
                <Moon />
                <div className="clouds"></div>
                <CurrentConditions props={currentWeather} />
                <DataTableMoon />
                <DataTableSun sunTimes={sunTimes} />
                <footer className="ground-pane grass row">
                </footer>
            </main>
        </div>
    );
}

function drawFavion() {
    let link = document.createElement('link'),
        canvas = document.getElementById('currentphase');

    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = canvas.toDataURL("image/x-icon");
    link.id = "favicon";
    document.getElementsByTagName('head')[0].appendChild(link);
}

export default App;
