
import "../styles/TaskViewer.css";
import { useState, useEffect, useRef } from "react";
import NavigationBar from "./NavigationBar";
import { useContext } from "react";
import TaskContext from "../context/TaskContext.jsx";
import Lottie from "lottie-react";
import loading from "../animations/loading.json"
import { SidebarContext } from "../context/SideBarContext.jsx";
import Task from "../services/TaskService.js";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import InputHandler from "./InputHandler.jsx";
import { List, CalendarDays, FileCode2, Sprout, Dumbbell, Ham, Droplets, CodeSquare, Play, PenLine, Pause } from 'lucide-react'

const TaskView = ({ activeTab }) => {
    const [isLoading, setIsLoading] = useState(true);
    const { openTaskEditor, openListEditor } = useContext(TaskContext)
    const { setActiveTab, userTheme, setNav, setPageName, pageName } = useContext(SidebarContext)
    const [data, setData] = useState([]);
    const [checkedIds, setCheckedId] = useState([]);
    const [showInput, setShowInput] = useState(false);

    const [newDescription, setNewDescription] = useState([]);
    const [newStartTime, setNewStartTime] = useState({});
    const [newEndTime, setNewEndTime] = useState({});

    const [timerRunning, setTimerRunning] = useState({});
    const [timerValue, setTimerValue] = useState({});
    const [someTimerRunning, setSomeTimerRunning] = useState(false);
    const [currentTime, setCurrentTime] = useState("");

    useEffect(() => {
        const now = new Date();
        const timeString = now.toLocaleTimeString(); // e.g., "3:24:19 PM"
        setCurrentTime(timeString);
    }, []);

    useEffect(() => {
        const handleClick = (event) => {
            if (event.target.classList.contains('task-scroll-view')) {
                setShowInput(false)
            }
        };

        document.addEventListener("click", handleClick);

        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, []);


    useEffect(() => {
        if (activeTab === 'today') {
            setData([]);
            setIsLoading(true);
            Task.get('today').then((res) => {
                setData(res);
                setIsLoading(false);
            });
        } else if (activeTab === 'list' && pageName == 'list') {
            setData([]);
            setIsLoading(true);
            Task.get('list').then((res) => {
                setData(res);
                setIsLoading(false);
            });
        }
    }, [pageName]);

    function formatDuration(ms) {
        const seconds = Math.floor(ms / 1000) % 60;
        const minutes = Math.floor(ms / 60000) % 60;
        const hours = Math.floor(ms / 3600000);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    const addTaskToView = (task) => {
        setData(prev => [...prev, task])
    }

    // Add this state at the top of your component (where you have other useState)
    const [expandedTasks, setExpandedTasks] = useState(new Set());

    // Replace the previous toggleTaskExpand function with this:
    const toggleTaskExpand = (taskId) => {
        setExpandedTasks(prev => {
            const newSet = new Set(prev);
            if (newSet.has(taskId)) {
                newSet.delete(taskId);
            } else {
                newSet.add(taskId);
            }
            return newSet;
        });
    };

    const addTaskToListView = (data) => {
        // console.log(data)
        setData([data.task])
        setActiveTab('list')
        setNav({ title: data.list.list_name });
        window.history.pushState({}, '', '/list');
    }

    const updateRunningStatus = (clockifyId) => {
        setData((prevData) =>
            prevData.map((task) => ({
                ...task,
                clockify: task.clockify.map((entry) =>
                    entry._id === clockifyId
                        ? { ...entry, is_running: false }
                        : entry
                )
            }))
        );
    };

    function openList(data) {
        setData([]);
        setIsLoading(true);
        setPageName('tasklist')
        setNav({ title: data.list_name, icon: data.list_icon });
        Task.get('tasklist', data.list_id).then((res) => {
            // console.log(res)
            setData(res);
            setIsLoading(false);
        });
    }

    const toggleCheck = (taskId) => {
        setCheckedId(prev =>
            prev.includes(taskId)
                ? prev.filter(id => id !== taskId)
                : [...prev, taskId]
        );
    };

    const getEmptyMessage = () => {
        switch (activeTab) {
            case "list": return "No task list yet.\nAdd one!";
            case "today": return "No task for today yet.\nAdd one!";
            case "calendar": return "No task yet.\nAdd one!";
            case "clockify": return "Let's start tracking time!";
            default: return "";
        }
    };

    const getLottieSrc = () => {
        if (activeTab === "clockify") return "public/assets/empty-clockify.lottie";
        return userTheme === "dark"
            ? "/assets/empty-dark.lottie"
            : "/assets/empty.lottie";
    };


    const getListIcon = (icon) => {
        if (icon == 'default') {
            return <List className="icon" />
        } else if (icon == 'FileCode2') {

        } else if (icon == 'Sprout') {

        }
        else if (icon == 'Dumbbell') {

        }
        else if (icon == 'Droplets') {

        }
        else if (icon == 'Ham') {

        }
        else {
            return <List className="icon" />
        }
    }

    const [clockifyDescription, setClockifyDescription] = useState('')


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
    const intervalRefs = useRef({});


    function stopTimer(id, add) {
        console.log("stoping Timer Frontend")
        // Toggle timer running state
        setTimerRunning(prev => ({
            ...prev,
            [id]: !prev[id]
        }));

        setSomeTimerRunning(false);
        updateRunningStatus(id)
        // Stop and clear the interval if it exists
        clearInterval(intervalRefs.current[id]);
        delete intervalRefs.current[id];
        console.log(id)
        console.log(newStartTime[id])
        console.log(newEndTime[id])

        const timerDiffSec = toSeconds(getDifference(newStartTime[id], newEndTime[id]));
        const startSec = toSeconds(newStartTime[id] || "00:00:00");
        const newDiff = startSec + timerDiffSec;
        const newEndTimeStr = fromSeconds(newDiff);

        // Set it in state
        setNewEndTime((prev) => ({
            ...prev,
            [id]: newEndTimeStr
        }));

        // Now safely use the correct value
        Task.stop_timer(id, newStartTime[id], newEndTimeStr, newDescription[id], false).then((res) => {
            if (add) {
                addClockifyEntry(id, res)
            }
        });
    }


    const startTimer = (task_id, id, due_date, start_time = '', end_time = '', description = '', alreadyRunning = 0) => {
        // update state to trigger re-render
        setTimerRunning(prev => ({
            ...prev,
            [id]: !prev[id]
        }));


        if (start_time === '' || start_time === '00:00') {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');

            // const seconds = String(now.getMinutes()).padStart(2, '0');
            start_time = `${hours}:${minutes}:${seconds}`;
        }

        setNewStartTime({ [id]: start_time })

        if (toSeconds(end_time) > 0) {
            setNewEndTime({ [id]: end_time })
        } else {
            setNewEndTime({ [id]: start_time })
            end_time = start_time;
        }

        if (!alreadyRunning) {
            Task.add_timer(task_id, due_date, start_time, end_time, description, true).then((res) => { });
        }

        start_time = toSeconds(start_time);
        end_time = toSeconds(end_time);



        let diffSeconds = 0;
        let newStartSec = 0;
        if (start_time > end_time) {
            newStartSec += 86400; // add 24 hours
            diffSeconds = newStartSec - start_time;
        } else {
            diffSeconds = end_time - start_time;
        }

        let totalSeconds = diffSeconds;

        console.log(intervalRefs.current)

        if (!intervalRefs.current[id]) {
            // Start and store the interval ID
            intervalRefs.current[id] = setInterval(() => {
                totalSeconds++;
                const updatedTime = fromSeconds(totalSeconds);
                console.log('hie')
                setTimerValue(
                    (prev) => {
                        return {
                            ...prev,
                            [id]: updatedTime
                        }
                    }
                );

            }, 1000);
        }

    }

    function calculateDifference(id) {
        let start = newStartTime[id];
        let end = newEndTime[id];

        if (!start || start === '') {
            start = "00:00:00";
            setNewStartTime({ [id]: start });
        }

        if (!end || end === '') {
            end = start;
            setNewEndTime({ [id]: end });
        }

        let startSec = toSeconds(start);
        let endSec = toSeconds(end);

        let diffSeconds = 0;
        let newStartSec = 0;
        if (startSec > endSec) {
            newStartSec += 86400; // add 24 hours
            diffSeconds = newStartSec - startSec;
        } else {
            diffSeconds = endSec - startSec;
        }

        const result = fromSeconds(diffSeconds);
        setTimerValue({ [id]: result });
    }


    function isValidDurationFormat(value) {
        return /^(\d{1,}:\d{2})(:\d{2})?$/.test(value);
    }

    function autoFormatDuration(value) {
        const parts = value.split(":").map(part => part.trim());

        if (parts.length < 2 || parts.length > 3) return null; // Invalid format

        const [hours, minutes, seconds] = parts;

        // Pad minutes and seconds to 2 digits
        const hh = hours.padStart(2, '0');
        const mm = minutes.padStart(2, '0');
        const ss = parts.length === 3 ? seconds.padStart(2, '0') : undefined;

        return parts.length === 3 ? `${hh}:${mm}:${ss}` : `${hh}:${mm}`;
    }


    const addClockifyEntry = (taskId, newClockifyEntry) => {
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

    useEffect(() => {
        if (pageName === 'tasklist' && data) {
            // console.log(data)
            let isAnyRunning = false;

            for (const t of data) {
                const runningItems = t.clockify?.filter(element => element.is_running);

                if (runningItems && runningItems.length > 0) {
                    isAnyRunning = true;

                    const running = runningItems[0]; // Assuming you want the first running timer
                    console.log(running);

                    // Optional: start the timer if needed
                    startTimer(t._id, running._id, t.due_date, running.start_time, running.end_time, running.description, running.is_running);

                    break; // Exit early since one is already running
                }
            }

            setSomeTimerRunning(isAnyRunning);
        }
    }, [pageName, data]);


    function getDifference(start, end) {
        let startSec = toSeconds(start);
        let endSec = toSeconds(end);
        let diff = endSec - startSec;
        return fromSeconds(diff);
    }

    function getEndTime(is_running, start_time, end_time) {
        if (!is_running) {
            return end_time;
        }

        const now = new Date();

        // Convert "HH:mm:ss" to Date object (using today's date)
        const [h, m, s] = start_time.split(":").map(Number);
        const start = new Date(now);
        start.setHours(h, m, s, 0);

        // If the task started yesterday or earlier, adjust manually if needed
        if (start > now) {
            start.setDate(start.getDate() - 1);
        }

        // Calculate elapsed time in ms
        const elapsedMs = now - start;

        // Add elapsed time to start_time as Date
        const end = new Date(start.getTime() + elapsedMs);

        // Format to HH:mm:ss (supporting 24+ hour durations)
        const startSec = toSeconds(start_time);
        const totalSeconds = Math.floor(elapsedMs / 1000);

        // const hours = Math.floor(totalSeconds / 3600);
        // const minutes = Math.floor((totalSeconds % 3600) / 60);
        // const seconds = totalSeconds % 60;

        // const pad = (num) => String(num).padStart(2, "0");
        const newEndTimeSec = fromSeconds(startSec + totalSeconds)
        return `${newEndTimeSec}`
    }

    return (
        <>
            <div className={`task-scroll-view ${userTheme} ${data && data.length > 0 ? '' : 'empty'}`}>
                {pageName === 'tasklist'
                    &&
                    <div className="total-time-wraper">
                        <div className="total-time-inner-wrap">
                            <span className="total-time-title">Total Time : </span><span className="total-time-value">00:00:00</span>
                        </div>
                    </div>
                }
                <div className={`list-card add-list ${showInput ? 'hide' : ''}`} onClick={() => {
                    setShowInput(true)
                }}>
                    + {pageName == 'list' ? 'Add List' : 'Add Task'}
                </div>
                {isLoading ? (
                    <div className="loading-container">
                        <span className="loader"></span><span style={{ marginRight: "15px" }}>Loading....</span>
                    </div>
                ) : (data && data.length > 0) ? (
                    (activeTab === 'today' || pageName === 'tasklist') ?
                        <>
                            {
                                data.slice().reverse().map(
                                    (task) => {
                                        const isExpanded = expandedTasks.has(task._id);
                                        return (
                                            <span className='taskcard-wrapper' id={`task-${task._id}`} key={task._id} onClick={() => { toggleTaskExpand(task._id) }}>
                                                <span className="taskcard">
                                                    <span style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        width: "100%",
                                                        height: "50px",
                                                        lineHeight: "50px",
                                                    }} key={task._id}>
                                                        <div className="checkbox-wrapper-combined" >
                                                            <input
                                                                className="inp-cbx visually-hidden"
                                                                type="checkbox"
                                                                id={`cbx-${task._id}`}
                                                                checked={checkedIds.includes(task._id)}
                                                                onChange={() => toggleCheck(task._id)}
                                                            />
                                                            <label className="cbx" htmlFor={`cbx-${task._id}`}>
                                                                <span
                                                                    className={`checkbox-container ${task.priority === 'high'
                                                                        ? 'priority-high'
                                                                        : task.priority === 'medium'
                                                                            ? 'priority-medium'
                                                                            : 'priority-low'
                                                                        }`}
                                                                >
                                                                    <svg width="13" height="11" viewBox="0 0 15 14" fill="none">
                                                                        <path d="M2 8.36364L6.23077 12L13 2" stroke="currentColor" strokeWidth="2" />
                                                                    </svg>
                                                                </span>
                                                                <span className="checkbox-text" onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    e.preventDefault()
                                                                    toggleTaskExpand(task._id)
                                                                    return
                                                                }}>{task.title}</span>
                                                            </label>
                                                        </div>

                                                    </span>
                                                    <div className="task-card-section-right">
                                                        <div className="task-edit-button-wrap"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                e.preventDefault();
                                                                openTaskEditor(task);
                                                            }}
                                                            data-bs-toggle="tooltip"
                                                            title="Edit">
                                                            <PenLine />
                                                        </div>

                                                        {task.due_date !== null && (
                                                            <div className="calendarIconWrap">
                                                                <CalendarDays className="calendarIcon" />
                                                                <span>
                                                                    {new Date(task.due_date).getDate() + 1}/
                                                                    {new Date(task.due_date).getMonth() + 1}/
                                                                    {new Date(task.due_date).getFullYear()}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {(task.priority) &&
                                                            <div className={`priorityIconWrap ${task.priority.toLowerCase()}`}>
                                                                <span className={`priorityIcon ${task.priority.toLowerCase()}`}></span>
                                                                {task.priority}
                                                            </div>
                                                        }


                                                        <div className="chevron-right-icon">
                                                            <i className={`${isExpanded && 'expanded'} fa-solid fa-chevron-right ${task.completed ? "completed" : ""}`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    e.preventDefault()
                                                                    toggleTaskExpand(task._id)
                                                                }
                                                                }
                                                            ></i>
                                                        </div>
                                                    </div>

                                                </span>

                                                {pageName === 'tasklist' &&
                                                    <>
                                                        {
                                                            (task.clockify && task.clockify.length > 0) ?
                                                                <>
                                                                    {task.clockify.map((element) => {
                                                                        return (
                                                                            <div className={`time-handler ${isExpanded ? 'expanded' : ''}`}
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation()
                                                                                    e.preventDefault()
                                                                                }}

                                                                                style={
                                                                                    !isExpanded ? { display: "none" } : { display: "flex" }
                                                                                }
                                                                            >
                                                                                <span class="pill-element date-element">
                                                                                    {new Date(task.due_date).getDate() + 1}/
                                                                                    {new Date(task.due_date).getMonth() + 1}/
                                                                                    {new Date(task.due_date).getFullYear()}
                                                                                </span>

                                                                                <span class="input-wrapper">
                                                                                    <input

                                                                                        type="text"
                                                                                        class="input-element"
                                                                                        placeholder="Add a description"
                                                                                        value={clockifyDescription[element._id] !== undefined ? clockifyDescription[element._id] : element.description}
                                                                                        onChange={(e) => {
                                                                                            setClockifyDescription((prev) => {
                                                                                                return {
                                                                                                    ...prev,
                                                                                                    [element._id]: e.target.value
                                                                                                };
                                                                                            });

                                                                                        }}
                                                                                    />
                                                                                </span>
                                                                                <span class="time-label">Start:</span>

                                                                                <span class="pill-element time-element">
                                                                                    <span class="time-value ">{element.start_time}</span>
                                                                                </span>

                                                                                <span class="separator">-</span>

                                                                                <span class="time-label">End:</span>
                                                                                <   span class="pill-element time-element">
                                                                                    <span class="time-value">
                                                                                        {
                                                                                            getEndTime(element.is_running, element.start_time, newEndTime[element._id] ? newEndTime[element._id] : element.end_time)
                                                                                        }
                                                                                    </span>
                                                                                </span>

                                                                                :
                                                                                <span class="pill-element time-element">
                                                                                    <input
                                                                                        type="text"
                                                                                        class="timer-input-value"
                                                                                        value={getDifference(element.start_time, getEndTime(element.is_running, element.start_time, newEndTime[element._id] ? newEndTime[element._id] : element.end_time))}
                                                                                        readOnly
                                                                                    />
                                                                                </span>

                                                                                <span
                                                                                    class="play-button"
                                                                                    onClick={() => {
                                                                                        if (element.is_running) {
                                                                                            stopTimer(element._id, 0);
                                                                                        }
                                                                                    }}
                                                                                    style={element.is_running && someTimerRunning ? {} : { opacity: 0, pointerEvents: "none" }}
                                                                                >
                                                                                    {element.is_running ? (
                                                                                        <Pause />
                                                                                    ) : (
                                                                                        <Play />
                                                                                    )}
                                                                                </span>
                                                                            </div>
                                                                        )
                                                                    })}

                                                                    {/* add the below div content inside the task map  */}

                                                                    <div className={`time-handler ${isExpanded ? 'expanded' : ''} add-new`}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation()
                                                                            e.preventDefault()
                                                                        }}

                                                                        style={
                                                                            !isExpanded ? { display: "none" } : { display: "flex" }
                                                                        }
                                                                    >
                                                                        <span class="pill-element date-element">
                                                                            {new Date(task.due_date).getDate() + 1}/
                                                                            {new Date(task.due_date).getMonth() + 1}/
                                                                            {new Date(task.due_date).getFullYear()}
                                                                        </span>

                                                                        <span class="input-wrapper">
                                                                            <input
                                                                                type="text"
                                                                                class="input-element"
                                                                                placeholder='Add a description...'
                                                                                value={newDescription[task._id] !== undefined ? newDescription[task._id] : ''}
                                                                                onChange={(e) => {
                                                                                    setNewDescription((prev) => {
                                                                                        return {
                                                                                            ...prev,
                                                                                            [task._id]: e.target.value
                                                                                        }
                                                                                    })
                                                                                }}
                                                                            />
                                                                        </span>
                                                                        <span class="time-label">Start:</span>
                                                                        <span class="pill-element time-element">
                                                                            <input
                                                                                type="text"
                                                                                class="time-value"
                                                                                placeholder='00:00'
                                                                                value={
                                                                                    newStartTime[task._id] == undefined ? '00:00:00' : newStartTime[task._id]
                                                                                }
                                                                                onChange={(e) => {
                                                                                    setNewStartTime((prev) => {
                                                                                        return {
                                                                                            ...prev,
                                                                                            [task._id]: e.target.value
                                                                                        }
                                                                                    })
                                                                                }}
                                                                                onBlur={(e) => {
                                                                                    let value = e.target.value;
                                                                                    value = autoFormatDuration(value)
                                                                                    // console.log(value)
                                                                                    // Validate HH:MM format (24-hour)

                                                                                    const isValid = isValidDurationFormat(value)
                                                                                    console.log(isValid)

                                                                                    if (isValid) {
                                                                                        setNewStartTime((prev) => {
                                                                                            return {
                                                                                                ...prev,
                                                                                                [task._id]: value
                                                                                            }
                                                                                        })
                                                                                        calculateDifference(task._id);

                                                                                    } else {
                                                                                        setNewStartTime((prev) => {
                                                                                            const updated = { ...prev };
                                                                                            delete updated[task._id];
                                                                                            return updated
                                                                                        })
                                                                                    }
                                                                                }}
                                                                            />
                                                                        </span>

                                                                        <span class="separator">-</span>

                                                                        <span class="time-label">End:</span>
                                                                        <span class="pill-element time-element">
                                                                            <input
                                                                                type="text"
                                                                                class="time-value"
                                                                                placeholder='00:00'
                                                                                value={newEndTime[task._id] == undefined ? '00:00:00' : newEndTime[task._id]}
                                                                                onChange={(e) => {
                                                                                    setNewEndTime((prev) => {
                                                                                        return {
                                                                                            ...prev,
                                                                                            [task._id]: e.target.value
                                                                                        }
                                                                                    })
                                                                                }}

                                                                                onBlur={(e) => {

                                                                                    let value = e.target.value;
                                                                                    value = autoFormatDuration(value)
                                                                                    const isValid = isValidDurationFormat(value)
                                                                                    console.log(isValid)
                                                                                    if (isValid) {
                                                                                        setNewEndTime((prev) => {
                                                                                            return {
                                                                                                ...prev,
                                                                                                [task._id]: value
                                                                                            }
                                                                                        })
                                                                                        calculateDifference(task._id);

                                                                                    } else {
                                                                                        setNewEndTime((prev) => {
                                                                                            const updated = { ...prev };
                                                                                            delete updated[task._id];
                                                                                            return updated
                                                                                        })
                                                                                    }
                                                                                }}
                                                                            />
                                                                        </span>
                                                                        <span>:</span>
                                                                        <span class="pill-element time-element">
                                                                            <input
                                                                                type="text"
                                                                                class="timer-input-value"
                                                                                value={timerValue[task._id] == undefined ? "00:00:00" : timerValue[task._id]}
                                                                            />
                                                                        </span>
                                                                        {

                                                                            timerRunning[task._id] ?
                                                                                (
                                                                                    <span
                                                                                        onClick={() => stopTimer(task._id, 1)}
                                                                                        className="play-button"
                                                                                        style={someTimerRunning ? { opacity: 0, pointerEvents: "none" } : {}}
                                                                                    >
                                                                                        <Pause />
                                                                                    </span>
                                                                                ) : (
                                                                                    <span
                                                                                        onClick={() => startTimer(task._id, task.due_date, newStartTime[task._id], newEndTime[task._id], newDescription[task._id])}
                                                                                        className="play-button"
                                                                                        style={someTimerRunning ? { opacity: 0, pointerEvents: "none" } : {}}
                                                                                    >
                                                                                        <Play />
                                                                                    </span>
                                                                                )
                                                                        }


                                                                    </div>

                                                                </>
                                                                :
                                                                // will change
                                                                <>
                                                                </>
                                                        }
                                                    </>

                                                }
                                            </span>
                                        )
                                    }

                                )
                            }
                        </>
                        :

                        <>
                            {
                                data.slice().reverse().map((list) => {
                                    const copy = { title: list.list_name, icon: list.list_icon };
                                    return (
                                        <span className='list-card' key={list._id} onClick={() => { openList(list) }}>
                                            <div className="wrapper">
                                                {getListIcon(list.list_icon)}
                                                <span className="list-name">{list.list_name}</span>
                                            </div>

                                            <div className="options">
                                                <div className="calendarIconWrap">
                                                    <div className="subTaskCountIcon">
                                                        {list.task && Array.isArray(list.task) ? list.task.length : 0}
                                                    </div>
                                                    Subtasks
                                                </div>
                                                <div
                                                    className="ellipsis-icon-container"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openListEditor(list);
                                                    }}
                                                >
                                                    <div className="ellipsis-dot"></div>
                                                    <div className="ellipsis-dot"></div>
                                                    <div className="ellipsis-dot"></div>
                                                </div>



                                                <div>
                                                    <i className={`fa-solid fa-chevron-right  `}></i>
                                                </div>
                                            </div>

                                        </span>
                                    );
                                })
                            }
                        </>
                ) : (
                    <div className="empty-list-animation">
                        <DotLottieReact
                            src={getLottieSrc()}
                            loop
                            autoplay
                            style={{ transform: "scale(1.7, 1)" }}
                        />
                        <div>{getEmptyMessage()}</div>
                    </div>
                )}
            </div >

            <InputHandler pageName={pageName} date={''} toggle={showInput} addTaskToView={addTaskToView} addTaskToListView={addTaskToListView} />
        </>
    );
};

export default TaskView;
