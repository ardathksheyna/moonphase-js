import './PillControl.scss'

export function PillControl() {
    return (
        <div>
            <input type="checkbox" name="switch" className="pill-switch" id="pillSwitch" />
            <label htmlFor="pillSwitch">
                <span className="label">Animate</span>
            </label>
        </div>
    );
}