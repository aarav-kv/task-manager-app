import { useEffect, useContext, useRef, useState } from "react";
import { SidebarContext } from "../context/SideBarContext";
import "../styles/Dashboard.css";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import DateLabel from "../services/DateLabel.js"
import Task from "../services/TaskService.js"
import ListDashboard from "../components/ListDashboard.jsx";
import React from 'react';
import timerUtility from "../utility/TimerUtility.js";
import blackbox from "../animations/blackbox.json";
import whitebox from "../animations/whitebox.json";
import Lottie from "lottie-react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import { Bar } from 'react-chartjs-2';
import TaskContext from "../context/TaskContext.jsx";
import { ListIcon } from "lucide-react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const { setActiveTab, setNav, activeTab, userTheme } = useContext(SidebarContext);
    // const lineChartRef = useRef(null);
    const [TimerPaused, setTimerPaused] = useState(false);
    const [TimerExists, setTimerExists] = useState(false)
    const { setCurrentlyRunningTimer, currentlyRunningTimer } = useContext(TaskContext)
    const [listname, setListName] = useState(null)

    useEffect(() => {
        if (!currentlyRunningTimer?.taskID) return;

        const fetchListName = async () => {
            const name = await Task.getListByTaskId(currentlyRunningTimer.taskID);
            setListName(name.list_id.list_name);
        };

        fetchListName();
    }, [currentlyRunningTimer.taskID]);

    useEffect(() => {
        if (Object.keys(currentlyRunningTimer).length > 0) {
            setTimerPaused(currentlyRunningTimer.paused)
            setTimerExists(true)
        } else {
            setTimerPaused(false)
            setTimerExists(false)
        }
    }, [currentlyRunningTimer])

    useEffect(() => {
        setActiveTab("today");
        setNav({ title: "today" })
    }, [setActiveTab]);

    useEffect(() => {
        if (localStorage.getItem("timer") != null) {
            var temp = JSON.parse(localStorage.getItem("timer"))
            clearInterval(temp.intervalID)
            temp.intervalID = null
            if (!temp.intervalID && !TimerExists) {
                timerUtility.init(setCurrentlyRunningTimer)
                // setTimerValueDraft(timerUtility.getDifference(timer.start_time, timer.end_time))
                if (temp?.start_time) {
                    timerUtility.setStartTime(temp.start_time, temp.end_time)
                }
                if (temp?.end_time) {
                    timerUtility.setEndTime(temp.end_time, temp.end_time)
                }
                timerUtility.Run(temp.id, temp.taskID)
            }
        }
    }, [])

    const options = {
        plugins: {
            title: {
                display: true,
            },
        },
        responsive: true,
        scales: {
            x: {
                stacked: true,
                title: {
                    display: true,
                    text: 'Days',
                },
                grid: {
                    display: false
                },
                ticks: {
                    callback: function (value, index) {
                        if (updatedLabels[index] === 'Today') {
                            return '\u200B' + updatedLabels[index];
                        }
                        return updatedLabels[index];
                    },
                    font: function (context) {
                        const index = context.index;
                        if (updatedLabels[index] === 'Today') {
                            return {
                                weight: 'bold',
                            };
                        }
                        return {
                            weight: 'normal',
                        };
                    }
                }
            },
            y: {
                stacked: true,
                max: 24,
                ticks: {
                    callback: function (value) {
                        return value + ' hr';
                    }
                },
                grid: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Hours',
                },
            },
        },
    };

    const labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const gymData = [3, 6, 2, 4, 5, 1, 3];
    const codingData = [2, 4, 3, 2, 5, 2, 4];

    const totalDayHours = 24;

    const remainingTime = labels.map((_, index) => {
        return totalDayHours - (gymData[index] + codingData[index]);
    });

    // Get today's day name
    const todayIndex = new Date().getDay();

    // Replace today's label with "Today"
    const updatedLabels = labels.map((label, index) => {
        if (index === todayIndex) {
            return 'Today';
        }
        return label;
    });
    const [taskCounts, setTaskCounts] = useState({
        totalTasks: 0,
        completedTasks: 0,
        overdueTasks: 0,
        upcomingTasks: 0
    });

    const data = {
        labels,
        datasets: [
            {
                label: 'Gym',
                data: gymData,
                backgroundColor: 'rgb(255, 99, 132)',
            },
            {
                label: 'Coding',
                data: codingData,
                backgroundColor: 'rgb(112, 99, 255)',
            },
            {
                label: 'Remaining Time',
                data: remainingTime,
                backgroundColor: 'rgba(99, 255, 133, 0)',
            },
        ],
    };

    const [activeInsideTab, setActiveInsideTab] = useState('upcoming');
    const [tasks, setTasks] = useState([]);
    useEffect(() => {
        Task.get("dashboard").then(res => {
            if (res.length > 0) {
                setTasks(res)
            }
        })

        Task.get("totalcount").then(res => {
            setTaskCounts(res.stats)
        })

    }, []);


    const [labelOrder, setLabelOrder] = useState([])
    const [groupedTasks1, setGroupedTasks] = useState({})

    useEffect(() => {
        const now = new Date();
        const filteredTaskList = [];
        if (tasks.length) {
            tasks.forEach((task) => {
                let filteredtask = {};
                if (task.list) {
                    const tasklist = task.list;
                    if (tasklist.task && tasklist.task.length > 0) {
                        filteredtask['list'] =
                        {
                            name: tasklist.name,  // take name from tasklist
                            task: tasklist.task.filter(list => {
                                if (list) {
                                    if (activeInsideTab === "completed") {
                                        return list.completed;
                                    } else if (activeInsideTab === "overdue") {
                                        return !list.completed && list.due_date && new Date(list.due_date) < now;
                                    } else if (activeInsideTab === "upcoming") {
                                        return !list.completed && list.due_date && new Date(list.due_date) >= now;
                                    }
                                } else {

                                }
                                return false;
                            })
                        }

                        if (filteredtask.list.task.length > 0) {
                            filteredTaskList.push(filteredtask);
                        }

                    }
                }
            })
        }


        //For standalone tasks
        let filteredtask = {}

        tasks.forEach(t => {

            if (!t.list) {

                filteredtask = {
                    tasks: t.filter(t1 => {
                        if (!t.list) {
                            if (activeInsideTab === "completed") {
                                return t1.completed;
                            } else if (activeInsideTab === "overdue") {
                                return !t1.completed && new Date(t1.due_date) < now;
                            } else if (activeInsideTab === "upcoming") {
                                return !t1.completed && new Date(t1.due_date) >= now;
                            }
                            return true
                        }
                    })
                }
            }
        })

        if (filteredtask.tasks && filteredtask.tasks.length > 0) {
            filteredTaskList.push(filteredtask);
        }

        // 2. Group tasks by label
        let groupedTasks = {}
        filteredTaskList.forEach(task => {
            if (task.list) {
                const list = task.list;
                if (list.task && list.task.length > 0) {
                    const labelsAdded = new Set(); // 💡 to track where already added
                    list.task.forEach(t => {
                        const label = DateLabel.get(t.due_date);
                        if (!labelsAdded.has(label)) { // only add once per label
                            if (!groupedTasks[label]) {
                                groupedTasks[label] = [];
                            }
                            const filteredTasks = list.task.filter(innerTask => DateLabel.get(innerTask.due_date) === label);

                            groupedTasks[label].push({
                                list: {
                                    name: list.name,
                                    task: filteredTasks
                                }
                            });

                            labelsAdded.add(label);
                        }
                    });
                }
            } else {
                if (task.tasks && task.tasks.length > 0) {
                    task.tasks.forEach(t => {
                        const label = DateLabel.get(t.due_date);
                        if (!groupedTasks[label]) {
                            groupedTasks[label] = [];
                        }
                        groupedTasks[label].push(t);
                    });
                }
            }
        });
        setGroupedTasks(groupedTasks)

        // 3. Define order based on tab 
        const currentMonthIndex = new Date().getMonth(); // 0 = Jan, 11 = Dec
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const upcomingMonths = monthNames.slice(currentMonthIndex + 1).concat(monthNames.slice(0, currentMonthIndex));
        const pastMonths = [...monthNames.slice(0, currentMonthIndex)].reverse();

        let labelOrder1 = []
        if (activeInsideTab === 'upcoming') {
            labelOrder1 = ["This Week", "Next Week", "Next Month", ...upcomingMonths]
        } else if (activeInsideTab === 'overdue') {
            labelOrder1 = ["This Week", "Last Week", "Last Month", ...pastMonths]
        } else {
            labelOrder1 = monthNames.reverse()
        }
        setLabelOrder(labelOrder1)
    }, [activeInsideTab, tasks]);



    return (
        <div className="dashboard-container">
            <section className="section1">
                <div className={`status-cards-container ${userTheme}`} >
                    <div className="status-card greeting">
                        <div className="greet-icon-conainer">
                            <DotLottieReact
                                src="/assets/sun.lottie"
                                loop
                                autoplay
                                style={{ transform: "scale(2.2, 1)" }}
                            />
                        </div>
                        <div className="msg-time-wrapper">
                            <span className="message">Hello, <span>Aarav</span></span>
                            <span className="datetime">Today is Monday, 20 Oct 2025</span>
                        </div>
                    </div>

                    {/* Completed Card */}
                    <div className="status-card completed">
                        <div className="icon-container">
                            <svg className="icon completed-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                        <div className="card-content">
                            <h2 className="count">{taskCounts.completedTasks}</h2>
                            <p className="label">Completed</p>
                        </div>
                    </div>

                    {/* Overdue Card */}
                    <div className="status-card overdue">
                        <div className="icon-container">
                            <svg className="icon overdue-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="6" x2="12" y2="12"></line>
                                <line x1="12" y1="12" x2="16" y2="14"></line>
                            </svg>
                        </div>
                        <div className="card-content">
                            <h2 className="count">{taskCounts.overdueTasks}</h2>
                            <p className="label">Overdue</p>
                        </div>
                    </div>

                    {/* Upcoming Card */}
                    <div className="status-card upcoming">
                        <div className="icon-container">
                            <svg className="icon upcoming-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                                <line x1="8" y1="14" x2="8" y2="14"></line>
                                <line x1="12" y1="14" x2="12" y2="14"></line>
                                <line x1="16" y1="14" x2="16" y2="14"></line>
                                <line x1="8" y1="18" x2="8" y2="18"></line>
                                <line x1="12" y1="18" x2="12" y2="18"></line>
                                <line x1="16" y1="18" x2="16" y2="18"></line>
                            </svg>
                        </div>
                        <div className="card-content">
                            <h2 className="count">{taskCounts.upcomingTasks}</h2>
                            <p className="label">Upcoming</p>
                        </div>
                    </div>
                </div>
                <div className={`task-list-container ${userTheme}`}>
                    <div className={`task-tabs  ${userTheme}`}>
                        <button
                            className={`tab ${activeInsideTab === 'upcoming' ? 'active' : ''}`}
                            onClick={() => setActiveInsideTab('upcoming')}
                        >
                            Upcoming
                        </button>
                        <button
                            className={`tab ${activeInsideTab === 'overdue' ? 'active' : ''}`}
                            onClick={() => setActiveInsideTab('overdue')}
                        >
                            Overdue
                        </button>
                        <button
                            className={`tab ${activeInsideTab === 'completed' ? 'active' : ''}`}
                            onClick={() => setActiveInsideTab('completed')}
                        >
                            Completed
                        </button>
                    </div>

                    <div className="task-list">
                        {
                            Object.keys(groupedTasks1).length > 0 ? <>
                                {
                                    labelOrder.map(label => {
                                        if (groupedTasks1[label] && groupedTasks1[label].length) {
                                            return (
                                                <div key={label} className="date-wrapper">
                                                    <div className="date-label">{label}</div>
                                                    {
                                                        groupedTasks1[label].map((groupedTask, idx) => {

                                                            if (groupedTask.list) {
                                                                return (
                                                                    <ListDashboard
                                                                        groupedTask={groupedTask}
                                                                        idx={idx}
                                                                    />)
                                                            } else {
                                                                return (
                                                                    <span className={`taskcard-dashboard ${groupedTask.priority ? groupedTask.priority.toLowerCase() : "default"}}`} key={idx}>
                                                                        <span
                                                                            style={{
                                                                                display: "flex",
                                                                                justifyContent: "space-between",
                                                                                alignItems: "center",
                                                                                width: "100%",
                                                                                height: "30px",
                                                                                lineHeight: "30px",
                                                                            }}
                                                                        >
                                                                            <input
                                                                                type="checkbox"
                                                                                id={`cbx-${groupedTask._id}`}
                                                                                checked={groupedTask.completed || false}
                                                                                onChange={() => { /* handle complete toggle */ }}
                                                                            />
                                                                            <label
                                                                                style={{
                                                                                    margin: "0 10px",
                                                                                    fontSize: "13px",
                                                                                    width: "100%",
                                                                                }}
                                                                                className={groupedTask.completed ? `${userTheme} task-completed` : `${userTheme}`}
                                                                                onClick={() => { /* handle click on task name */ }}
                                                                            >
                                                                                {groupedTask.title}
                                                                            </label>
                                                                        </span>
                                                                    </span>
                                                                );
                                                            }
                                                        })}
                                                </div>

                                            );
                                        }
                                        return null;
                                    })
                                }
                            </> :
                                <span className="emptydata">
                                    <Lottie
                                        animationData={userTheme === "dark" ? blackbox : whitebox}
                                        loop
                                        autoplay
                                        style={{ width: "100px", height: "200px" }}
                                    />
                                    {activeInsideTab === "overdue" && "No overdue tasks"}
                                    {activeInsideTab === "completed" && "No completed tasks"}
                                    {activeInsideTab !== "overdue" && activeInsideTab !== "completed" && "No upcoming tasks"}
                                </span>

                        }

                    </div>
                </div>
            </section>
            <section className="section2">

                <div className={`chart-card  ${userTheme}`}>
                    <div className="chart-header">Tracker</div>
                    <div className="chart-container">
                        <Bar options={options} data={data} />
                    </div>
                </div>
                <div class={`timer-section ${userTheme}`}>
                    <div className="timer-section-header">
                        <div className="timer-label">Current Timer</div>
                        <div className="tag" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                            <ListIcon size={13} />
                            {listname ? listname : ""}
                        </div>
                    </div>
                    <div className="timer-body">
                        <div className="timer-display">{
                            TimerExists ? currentlyRunningTimer.formatedElapsedTime : "00:00:00"
                        }   </div>
                        <div className="time-inputs-container">
                            <div className="time-input-group">
                                <label className="time-input-label">Start Time</label>
                                <input className="time-input" value={
                                    TimerExists ? currentlyRunningTimer.start_time : "00:00:00"} id="startTime" />
                            </div>
                            <div className="time-input-group">
                                <label className="time-input-label">End Time</label>
                                <input className="time-input" value={
                                    TimerExists ? currentlyRunningTimer.end_time : "00:00:00"} id="endTime" />
                            </div>
                            <button className="timer-button">
                                {
                                    !TimerExists && "Start"
                                }

                                {
                                    TimerExists && "Pause"
                                }
                            </button>
                        </div>
                    </div>

                </div>
            </section >
        </div >
    );
};

export default Dashboard;