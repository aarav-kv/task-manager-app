import { useState, useEffect, useRef } from "react";
import { useContext } from "react";
import { Play, Pause, Square, Trash2 } from 'lucide-react'
import TaskContext from "../context/TaskContext.jsx";
import timerUtility from "../utility/TimerUtility.js";

function SaveExistingTimer({ isExpanded, addNew, timer, uniqueID, taskID, updateData }) {

    const { setCurrentlyRunningTimer, currentlyRunningTimer } = useContext(TaskContext)
    // const [timerUtility] = useState(() => new TimerUtility(setCurrentlyRunningTimer, timer));

    const [TimerID, setTimerID] = useState(timer?._id);
    const [description, setDescription] = useState('');

    const [showPicker, setShowPicker] = useState(false);
    const inputRef = useRef();

    const [startTime, setStartTime] = useState('00:00:00');
    const [startTimeDraft, setStartTimeDraft] = useState(startTime);

    const [endTime, setEndTime] = useState('00:00:00');
    const [endTimeDraft, setEndTimeDraft] = useState(endTime);

    const [timerValue, setTimerValue] = useState('00:00:00');
    const [timerValueDraft, setTimerValueDraft] = useState(timerValue);

    const [isActive, setIsActive] = useState(timer ? timer.is_active : false);

    const [selectedDate, setSelectedDate] = useState("");



    // Set current date on initial load
    useEffect(() => {
        const today = new Date();
        setSelectedDate(today.toISOString());
    }, []);

    useEffect(() => {
        if (timer?.start_time) {
            setStartTime(timer.start_time);
            setStartTimeDraft(timer.start_time);
        }
        if (timer?.end_time) {
            setEndTime(timer.end_time);
            setEndTimeDraft(timer.end_time);
        }

        if (Object.keys(currentlyRunningTimer).length === 0) {
            timerUtility.init(setCurrentlyRunningTimer, timer)
            // setTimerValueDraft(timerUtility.getDifference(timer.start_time, timer.end_time))
            if (timer?.start_time) {
                timerUtility.setStartTime(timer.start_time, timer.end_time)
            }
            if (timer?.end_time) {
                timerUtility.setEndTime(timer.end_time, timer.end_time)
            }

            // if (timer.is_active) {
            //     timerUtility.Run(TimerID, timer.task_id)
            // }
        }
    }, [timer]);


    return (
        <>
            <div className={`time-handler ${isExpanded ? 'expanded' : ''}`}

                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                }}


            >
                <>
                    {isActive ?
                        <>
                            <span
                                className="pill-element date-element"
                                onClick={() => {
                                    setShowPicker(true);
                                    if (inputRef.current?.showPicker) {
                                        inputRef.current.showPicker();
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

                        </> :
                        <>
                            <span
                                className="pill-element date-element"
                                onClick={() => {
                                    setShowPicker(true);
                                    if (inputRef.current?.showPicker) {
                                        inputRef.current.showPicker(); // ✅ This is now allowed
                                    }
                                }}
                                style={{ cursor: "default" }}
                            >
                                {timerUtility.formatDateToDDMMYY(timer.start_date)}
                            </span>
                        </>}

                </>

                <span className="input-wrapper">
                    {
                        isActive ?
                            <>
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
                            </> :
                            <>
                                <input
                                    type="text"
                                    className="input-element"
                                    placeholder="Add a description"
                                    value={timer.description && timer.description}
                                    onChange={(e) => {
                                        setDescription(e.target.value);
                                    }}
                                    readOnly
                                />

                            </>
                    }

                </span>

                <span className="time-label">Start:</span>
                <span className="pill-element time-element">
                    {
                        timer.is_active ?
                            <>
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
                                            timerUtility.setStartTime(startTimeDraft, endTimeDraft)
                                        } else {
                                            setStartTimeDraft(startTime, endTimeDraft)
                                            timerUtility.setStartTime(startTime)
                                        }
                                        setTimerValueDraft(timerUtility.getElapsedTime());
                                        setTimerValue(timerUtility.getElapsedTime());
                                    }}
                                />
                            </> :
                            <>
                                <span className="time-value ">{timer ? timer.start_time : '00:00:00'}</span>
                            </>
                    }
                </span>




                <span className="separator" style={{ marginLeft: "8px" }}>-</span>

                <span className="time-label">End:</span>
                <span className="pill-element time-element">
                    {
                        isActive ?
                            <>
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
                                            timerUtility.setEndTime(startTimeDraft, endTimeDraft)
                                        } else {
                                            setEndTimeDraft(endTime);
                                            timerUtility.setEndTime(startTimeDraft, endTime)
                                        }

                                        setTimerValueDraft(timerUtility.getElapsedTime());
                                        setTimerValue(timerUtility.getElapsedTime());
                                    }}
                                />
                            </> :
                            <>
                                <span className="time-value">{timer ? timer.end_time : '00:00:00'}</span>
                            </>
                    }


                </span>
                <span style={{ marginLeft: "8px" }}>:</span>
                <span className="pill-element time-element">
                    {isActive ? (
                        <input
                            type="text"
                            className="timer-input-value"
                            value={Object.keys(currentlyRunningTimer).length === 0 ? timerValueDraft : currentlyRunningTimer.formatedElapsedTime}
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

                    ) : (
                        <span className="timer-input-value">
                            {
                                timerUtility.fromSeconds(timer?.elapsed_time)
                            }
                        </span>
                    )}
                </span>

                {/* STOP BUTTON , ONLY SHOWS WHEN TIMER IS ACTIVLY RUNING*/}
                <span
                    className={`stop-button ${isActive && 'show'} spacing`}
                    onClick={() => {
                        setIsActive(false)
                        timerUtility.stopTimer(TimerID).then((res) => {
                            const isDelete = false;
                            setCurrentlyRunningTimer({})
                            updateData(TimerID, res.data.updatedRecord, isDelete)
                        })
                    }}
                >
                    <Square fill="#ee3017cc" stroke="#fff" />
                </span>
                {/* DELETE BUTTON */}
                {!isActive &&
                    <span
                        className={`play-button`}
                        onClick={async () => {
                            await timerUtility.deleteTimer(timer._id)
                            const isDelete = true;
                            const entry = null
                            updateData(timer._id, entry, isDelete)
                        }}
                    >
                        <Trash2 fill="#fefe" />
                    </span>
                }

                {isActive &&
                    <span
                        className="play-button"
                        onClick={async () => {
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
                        }}
                    >
                        {timerUtility.paused ? <Play /> : <Pause />}
                    </span>
                }
            </div >
        </>
    )
}

export default SaveExistingTimer