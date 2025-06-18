import { useState, useEffect, useRef } from "react";
import { List, CalendarDays, FileCode2, Sprout, Dumbbell, Ham, Droplets, CodeSquare, Play, PenLine, Pause } from 'lucide-react'
import Task from "../services/TaskService.js";

function Timer1({ isExpanded, isRunning, addNew, timer, indx, uniqueID, taskID }) {

    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState('00:00:00');
    const [startTimeDraft, setStartTimeDraft] = useState(startTime);
    // console.log(timer ? timer.is_running ? timer.start_timer : "00:00:00" : "00:00:00")

    const [endTime, setEndTime] = useState('00:00:00');
    const [endTimeDraft, setEndTimeDraft] = useState(endTime);

    const [timerValue, setTimerValue] = useState('00:00:00');
    const [timerValueDraft, setTimerValueDraft] = useState(timerValue);

    const [timerRunning, setTimerRunning] = useState(addNew ? false : timer?.is_running);
    const [intervalID, setIntervalID] = useState(null);
    const [currentTime, setCurrentTime] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");


    const toSeconds = (timeStr) => {
        const [h, m, s] = timeStr.split(':').map(Number);
        return h * 3600 + m * 60 + s;
    };

    const fromSeconds = (totalSeconds) => {
        const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const s = String(totalSeconds % 60).padStart(2, '0');
        return `${h}:${m}:${s}`;
    };
    const timerValueRef = useRef(toSeconds(timerValue));

    useEffect(() => {
        timerValueRef.current = toSeconds(timerValue + timerValueDraft);
    }, [timerValue]);

    useEffect(() => {
        const now = new Date();
        setStartDate(now);
        setEndDate(now);

        const timeString = now.toLocaleTimeString('en-GB', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
        setCurrentTime(timeString);

    }, []);


    const formatDate = (inputDate) => {
        const date = new Date(inputDate);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear().toString().slice(-2);
        return `${day}/${month}/${year}`;
    };

    // Set current date on initial load
    useEffect(() => {
        const today = new Date();
        // const formattedToday = formatDate(today.toISOString());
        setSelectedDate(today.toISOString());
    }, []);



    useEffect(() => {
        if (timer?.start_time) {
            setStartTime(new Date(timer.start_time));
            setStartTimeDraft(new Date(timer.start_time));
        }
        if (timer?.end_time) {
            setEndTime(new Date(timer.end_time));
            setEndTimeDraft(new Date(timer.end_time));
        }
    }, [timer]);

    const startTimer = () => {
        if (!timerRunning) {
            let startValSeconds = toSeconds(startTimeDraft);
            let endValSeconds = toSeconds(endTimeDraft);
            let currentSeconds = toSeconds(currentTime);
            let formatedStartTime = "00:00:00";
            let formatedEndTime = "00:00:00";

            let difference = endValSeconds - startValSeconds;

            if (difference === 0) {
                if (currentSeconds !== 0) {
                    const currentFormatted = fromSeconds(currentSeconds);
                    formatedStartTime = formatedEndTime = currentFormatted;
                    setStartTimeDraft(formatedStartTime);
                    setEndTimeDraft(formatedEndTime);
                }
            }


            Task.add_timer(taskID, uniqueID, '12-3-2025', formatedStartTime, startDate, formatedEndTime, endDate, description, true).then((res) => {
                const id = setInterval(() => {
                    timerValueRef.current = timerValueRef.current + 1
                    setTimerValueDraft(fromSeconds(timerValueRef.current));
                }, 1000);

                setIntervalID(id);
            });
        }
    }


    function stopTimer() {
        console.log("stoping Timer Frontend")

        const formatedEndTime = fromSeconds(toSeconds(endTimeDraft) + toSeconds(timerValueDraft));
        clearInterval(intervalID);

        // Now safely use the correct value
        Task.stop_timer('6836450a0573505947469f34', uniqueID, startTimeDraft, formatedEndTime, description, false).then((res) => {
            // if (add) {
            //     addClockifyEntry(id, res)
            // }
        });
    }

    function getDifference(start, end) {
        let startSec = toSeconds(start);
        let endSec = toSeconds(end);
        let diff = endSec - startSec;
        return fromSeconds(diff);
    }

    const addEntryToClockify = (taskId, newClockifyEntry) => {
        console.log(newClockifyEntry)
        // setData(prevData =>
        //     prevData.map(task =>
        //         task._id === taskId
        //             ? {
        //                 ...task,
        //                 clockify: [...task.clockify, newClockifyEntry]
        //             }
        //             : task
        //     )
        // );
    };
    const [showPicker, setShowPicker] = useState(false);
    const inputRef = useRef();

    const isValidTime = (time) => {
        return /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(time);
    };

    function formatDateToDDMMYY(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = String(date.getFullYear()).slice(-2); // Get last 2 digits
        return `${day}/${month}/${year}`;
    }

    return (
        <>
            <div className={`time-handler ${isExpanded ? 'expanded' : ''} ${addNew || timerRunning
                ? 'add-new' : ''}`}

                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault(); // ❌ This can interfere with focus/click behavior
                }}

                style={
                    !isExpanded ? { display: "none" } : { display: "flex" }
                }
            >
                <>
                    {addNew ?
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
                                {formatDateToDDMMYY(selectedDate)}
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
                                {formatDateToDDMMYY(timer.start_date)}
                            </span>
                        </>}

                </>

                <span className="input-wrapper">
                    {
                        addNew || timer.is_running ?
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
                        addNew || timer.is_running ?
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
                                        if (isValidTime(startTimeDraft)) {
                                            setStartTime(startTimeDraft);

                                            const timerValSeconds = toSeconds(timerValueDraft);
                                            const startValSeconds = toSeconds(startTimeDraft);
                                            const endValSeconds = toSeconds(endTimeDraft);

                                            // const durationSeconds = toSeconds(timerValueDraft);
                                            let formatedDifference = "00:00:00"
                                            if (startValSeconds > endValSeconds) {
                                                formatedDifference = fromSeconds(86400 + (endValSeconds - startValSeconds));
                                            } else {
                                                formatedDifference = fromSeconds(endValSeconds - startValSeconds);
                                            }
                                            setTimerValueDraft(formatedDifference);
                                            setTimerValue(formatedDifference);

                                        } else {
                                            setStartTimeDraft(startTime); // revert to original
                                        }
                                    }}
                                />
                            </> :
                            <>
                                <span className="time-value ">{timer ? timer.start_time : '00:00:00'}</span>
                            </>
                    }
                </span>




                <span className="separator">-</span>

                <span className="time-label">End:</span>
                <span className="pill-element time-element">
                    {
                        addNew ?
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
                                        console.log(isValidTime(endTimeDraft))
                                        if (isValidTime(endTimeDraft)) {
                                            setEndTime(endTimeDraft);

                                            const timerValSeconds = toSeconds(timerValueDraft);
                                            const startValSeconds = toSeconds(startTimeDraft);
                                            const endValSeconds = toSeconds(endTimeDraft);


                                            if (startValSeconds > endValSeconds) {
                                                const newTimerVal = fromSeconds(86400 + (endValSeconds - startValSeconds));
                                                setTimerValueDraft(newTimerVal);
                                                setTimerValue(newTimerVal);
                                            } else {
                                                const newTimerVal = fromSeconds(endValSeconds - startValSeconds);
                                                setTimerValueDraft(newTimerVal);
                                                setTimerValue(newTimerVal);
                                            }

                                        } else {
                                            setEndTimeDraft(endTime);
                                        }
                                    }}
                                />
                            </> :
                            <>
                                <span className="time-value">{timer ? timer.end_time : '00:00:00'}</span>
                            </>
                    }


                </span>
                <span>:</span>
                <span className="pill-element time-element">
                    {addNew ? (
                        <input
                            type="text"
                            className="timer-input-value"
                            value={timerValueDraft}
                            onChange={
                                (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setTimerValueDraft(e.target.value);
                                }
                            }
                            onBlur={() => {
                                if (timerRunning == false) {
                                    if (isValidTime(timerValueDraft)) {
                                        setTimerValue(timerValueDraft);

                                        const startSec = toSeconds(startTime);
                                        const timerSec = toSeconds(timerValueDraft);
                                        const newEndTimeSec = startSec + timerSec;

                                        setEndTimeDraft(fromSeconds(newEndTimeSec));
                                        setEndTime(fromSeconds(newEndTimeSec));
                                    } else {
                                        setTimerValueDraft(timerValue); // revert
                                    }
                                }
                            }}
                        />
                    ) : (
                        <span className="timer-input-value">
                            {getDifference(
                                timer?.start_time || "00:00:00",
                                timer?.end_time || "00:00:00"
                            )}
                        </span>
                    )}
                </span>

                <span
                    className="play-button"
                    onClick={() => {
                        if (timerRunning) {
                            stopTimer()

                        } else {
                            startTimer()
                        }
                        setTimerRunning((prev) => !prev)
                    }}
                    style={{
                        opacity: addNew || timer?.is_running ? 1 : 0,
                        pointerEvents: addNew || timer?.is_running ? 'auto' : 'none',
                    }}
                >
                    {timerRunning ? <Pause /> : <Play />}
                </span>

            </div >
        </>
    )
}

export default Timer1