import "./css/Timeline.css";

function Timeline() {

    return <>
        <div className="timeline">
            <div className="timeline-body">
                <p>Frame: <input type="number" defaultValue={0} min={0} /></p>
                <p>X: <input type="number" /> | Y: <input type="number" /></p>
            </div>
        </div>
    </>;
}

export default Timeline;