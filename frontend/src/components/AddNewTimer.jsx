import { useState, useEffect, useRef } from "react";
import { useContext } from "react";
import { List, CalendarDays, FileCode2, Sprout, Dumbbell, Ham, Droplets, CodeSquare, Play, PenLine, Pause, CircleStop, Square, PauseIcon, PlayIcon } from 'lucide-react'
import Task from "../services/TaskService.js";
import TaskContext from "../context/TaskContext.jsx";
import timerUtility from "../utility/TimerUtility.js";
import { useMessage } from "../hooks/useMessage.js";
function AddNewTimer({ isExpanded, addNew, timer, uniqueID, taskID, updateData }) {
    const { setCurrentlyRunningTimer, currentlyRunningTimer } = useContext(TaskContext)
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState('00:00:00');
    const [startTimeDraft, setStartTimeDraft] = useState(startTime);
    const [TimerID, setTimerID] = useState(null);
    const [endTime, setEndTime] = useState('00:00:00');
    const [endTimeDraft, setEndTimeDraft] = useState(endTime);
    const [timerValue, setTimerValue] = useState('00:00:00');
    const [timerValueDraft, setTimerValueDraft] = useState(timerValue);
    const [selectedDate, setSelectedDate] = useState("");
    const message = useMessage()
    // Set current date on initial load
    useEffect(() => {
        const today = new Date();
        setSelectedDate(today.toISOString());
        if (!currentlyRunningTimer) {
            timerUtility.init(setCurrentlyRunningTimer)
        }
    }, []);

    const [showPicker, setShowPicker] = useState(false);
    const inputRef = useRef();


    return (
        <>
            <div className={`time-handler ${isExpanded ? 'expanded' : ''} add-new`}

                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                }}

                style={
                    !isExpanded ? { display: "none" } : { display: "flex" }
                }
            >
                <>
                    <span
                        className="pill-element date-element"
                        onClick={() => {
                            setShowPicker(true);
                            if (inputRef.current?.showPicker) {
                                inputRef.current.showPicker(); // ✅ This is now allowed
                            }
                        }}
                        style={{ cursor: "pointer" }}
                    >
                        {timerUtility.formatDateToDDMMYY(selectedDate)}
                    </span>

                    {showPicker && (
                        <input
                            ref={inputRef}
                            type="date"
                            style={{
                                position: "absolute",
                                top: "100%",
                                left: 0,
                                zIndex: 10,
                            }}
                            onBlur={() => setShowPicker(false)}
                            onChange={(e) => {
                                setSelectedDate(e.target.value)
                                setStartDate(e.target.value)
                                setEndDate(e.target.value)
                                setShowPicker(false);
                            }}
                        />
                    )}

                </>

                <span className="input-wrapper">
                    {
                        <input
                            type="text"
                            className="input-element"
                            placeholder="Add a description"
                            value={description && description !== ''
                                ? description
                                : timer && timer.description !== ''
                                    ? timer.description
                                    : ''}
                            onChange={(e) => {
                                setDescription(e.target.value);
                            }}
                        />
                    }

                </span>
                <span className="time-label">Start:</span>
                <span className="pill-element time-element">
                    {
                        <input
                            type="text"
                            className="time-value"
                            placeholder="00:00"
                            value={startTimeDraft}
                            onChange={(e) => {
                                setStartTimeDraft(e.target.value);
                            }}
                            onBlur={() => {
                                if (timerUtility.isValidTime(startTimeDraft)) {
                                    setStartTime(startTimeDraft);
                                    timerUtility.setStartTime(startTimeDraft)
                                } else {
                                    setStartTimeDraft(startTime);
                                    timerUtility.setStartTime(startTime);
                                }
                                setTimerValueDraft(timerUtility.getElapsedTime());
                                setTimerValue(timerUtility.getElapsedTime());
                            }}
                        />

                    }
                </span>




                <span className="separator" style={{ marginLeft: "8px" }}>-</span>

                <span className="time-label">End:</span>
                <span className="pill-element time-element">

                    <input
                        type="text"
                        className="time-value"
                        placeholder="00:00"
                        value={endTimeDraft}
                        onChange={(e) => {
                            setEndTimeDraft(e.target.value);
                        }}
                        onBlur={() => {
                            // console.log(endTimeDraft)
                            // console.log(timerUtility.isValidTime(endTimeDraft))
                            if (timerUtility.isValidTime(endTimeDraft)) {
                                setEndTime(endTimeDraft);
                                timerUtility.setEndTime(endTimeDraft)
                            } else {
                                setEndTimeDraft(endTime);
                                timerUtility.setEndTime(endTime)
                            }

                            setTimerValueDraft(timerUtility.getElapsedTime());
                            setTimerValue(timerUtility.getElapsedTime());
                        }}
                    />
                </span>
                <span style={{ marginLeft: "8px" }}>:</span>
                <span className="pill-element time-element timervalue">
                    <input
                        type="text"
                        className="timer-input-value"
                        value={
                            currentlyRunningTimer.taskID !== taskID ? timerValueDraft : currentlyRunningTimer.formatedElapsedTime
                        }
                        onChange={
                            (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setTimerValueDraft(e.target.value);
                            }
                        }
                        onBlur={() => {
                            // if (isActive == false) {
                            //     if (isValidTime(timerValueDraft)) {
                            //         // setTimerValue(timerValueDraft);
                            //         // timerUtility.setEndTime()
                            //         // const startSec = timerUtility.toSeconds(startTime);
                            //         // const timerSec = timerUtility.toSeconds(timerValueDraft);
                            //         // const newEndTimeSec = startSec + timerSec;
                            //         // setEndTimeDraft(timerUtility.fromSeconds(newEndTimeSec));
                            //         // setEndTime(timerUtility.fromSeconds(newEndTimeSec));
                            //     } else {
                            //         setTimerValueDraft(timerValue); // revert
                            //     }
                            // }
                        }}
                    />

                </span>

                {/* STOP TIMER  */}

                <span
                    className={`stop-button ${TimerID !== null ? 'show' : ''}`}
                    onClick={() => {
                        timerUtility.stopTimer(TimerID).then((res) => {
                            setStartTimeDraft("00:00:00")
                            setEndTimeDraft("00:00:00");
                            setTimerValueDraft("00:00:00")
                            setTimerID(null)
                            updateData(TimerID, res.data.updatedRecord, false)
                            setCurrentlyRunningTimer({})
                        })
                    }}
                >
                    <Square fill="#ee3017cc" stroke="#fff" strokeWidth={1} />
                </span>

                <span
                    className="play-button"
                    onClick={async () => {
                        if (TimerID) {
                            if (timerUtility.paused) {
                                timerUtility.togglePauseTimer(TimerID, false).then(() => {
                                    setStartTimeDraft(timerUtility.getStartTime())
                                    setEndTimeDraft(timerUtility.getEndTime());
                                })
                            } else {
                                timerUtility.togglePauseTimer(TimerID, true).then(() => {
                                    setStartTimeDraft(timerUtility.getStartTime())
                                    setEndTimeDraft(timerUtility.getEndTime());
                                })
                            }
                        } else {
                            if (Object.keys(currentlyRunningTimer).length === 0) {
                                timerUtility.startTimer(taskID, uniqueID, startTimeDraft, endTimeDraft, selectedDate).then((result) => {
                                    if (result?.data) {
                                        setTimerID(result?.data?._id)
                                        timerUtility.Run(result?.data?._id, taskID)
                                        setStartTimeDraft(timerUtility.getStartTime())
                                        setEndTimeDraft(timerUtility.getEndTime());

                                    } else {
                                        message.add('Something went wrong', message.TYPE.WARNING);
                                    }
                                })
                            }
                            else {
                                message.add('A timer is already running. Please stop it before starting a new one.', message.TYPE.WARNING);
                            }
                        }
                    }}
                >

                    {Object.keys(currentlyRunningTimer).length > 0 && currentlyRunningTimer.taskID == taskID && !currentlyRunningTimer.paused ? <PauseIcon /> : <PlayIcon />}
                </span>
            </div >
        </>
    )
}

export default AddNewTimer