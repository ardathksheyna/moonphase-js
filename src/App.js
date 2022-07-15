import './App.scss';
import {PillControl} from "./components/controls/PillControl"
import {Moon} from "./components/Moon"
import {DataTableMoon} from "./components/DataTable_Moon"
import {DataTableSun} from "./components/DataTable_Sun"
import {getMoonData} from "./components/helpers/moonfx"

function App() {

    const moonData = getMoonData()

    return (
        <div className="body bg--daytime">
            <PillControl/>
            <main>
                <header className="screen-reader-text">
                    <h1 className="h h1">MoonPhase App</h1>
                </header>
                <Moon />
                <div className="clouds"></div>
                <DataTableMoon />
                <DataTableSun />
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
