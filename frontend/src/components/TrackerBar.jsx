import { useState } from "react";
import "../styles/TrackerBar.css";

const TrackerBar = () => {
    const [manualMode, setManualMode] = useState(false);

    return (
        <div className="tracker-container">
            <input
                type="text"
                className="tracker-input"
                placeholder={manualMode ? "What have you worked on?" : "What are you working on?"}
            />

            <div className="tracker-options">

                {manualMode ? (
                    <>
                        <input type="time" className="time-field" defaultValue="13:08" />
                        <span>-</span>
                        <input type="time" className="time-field" defaultValue="13:08" />
                        <i className="fa fa-calendar icon calendar-icon"></i>
                        <span className="today-text">Today</span>
                    </>
                ) : (
                    <span className="timer">00:00:00</span>
                )}

                <button className="start-btn">{manualMode ? "ADD" : "START"}</button>

                <div className="end-icons">
                    <i className="fa fa-clock icon"
                        onClick={() => setManualMode(false)}
                    ></i>
                    <i
                        className="fa fa-list icon"
                        onClick={() => setManualMode(true)}
                    ></i>
                </div>
            </div>
        </div>
    );
};

export default TrackerBar;
