import { useEffect, useContext, useRef, useState } from "react";
import { SidebarContext } from "../context/SideBarContext";
import "../styles/Dashboard.css";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import DateLabel from "../services/DateLabel.js"
import Task from "../services/TaskService.js"
import ListDashboard from "../components/ListDashboard.jsx";
import React from 'react';
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

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
const Dashboard = () => {
    const { setActiveTab, setNav } = useContext(SidebarContext);
    // const lineChartRef = useRef(null);

    useEffect(() => {
        setActiveTab("dashboard");
        setNav({ title: "dashboard" })
    }, [setActiveTab]);


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
                    text: 'Days', // 👈 x-axis heading
                },
                grid: {
                    display: false // Removes vertical lines
                },
                ticks: {
                    callback: function (value, index) {
                        if (updatedLabels[index] === 'Today') {
                            return '\u200B' + updatedLabels[index]; // Trick to make it bold using dataset override
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
                    display: false // Removes vertical lines
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
    const todayIndex = new Date().getDay(); // 0 (Sunday) to 6 (Saturday)

    // Replace today's label with "Today"
    const updatedLabels = labels.map((label, index) => {
        if (index === todayIndex) {
            return 'Today';
        }
        return label;
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
                backgroundColor: 'rgba(99, 255, 133, 0.27)',
            },
        ],
    };

    const [activeInsideTab, setActiveInsideTab] = useState('upcoming');
    const [tasks, setTasks] = useState([]);
    useEffect(() => {
        Task.get("dashboard").then(res => {
            console.log(res)

            if (res.length > 0) {
                setTasks(res)
            }
        })
    }, []);


    const [taskCounts, setTaskCounts] = useState({
        total: 0,
        completed: 0,
        overdue: 0,
        upcoming: 0
    });

    useEffect(() => {
        Task.get("tasklist").then(res => {
            if (res.length > 0) {
                setTasks(res);

                // Calculate counts
                let total = 0;
                let completed = 0;
                let overdue = 0;
                let upcoming = 0;
                const now = new Date();

                res.forEach(task => {
                    if (task.list && task.list.task) {
                        task.list.task.forEach(t => {
                            total++;
                            if (t.completed) completed++;
                            else if (new Date(t.due_date) < now) overdue++;
                            else upcoming++;
                        });
                    } else {
                        total++;
                        if (task.completed) completed++;
                        else if (new Date(task.due_date) < now) overdue++;
                        else upcoming++;
                    }
                });

                setTaskCounts({ total, completed, overdue, upcoming });
            }
        });
    }, []);


    const now = new Date();
    const filteredTaskList = [];
    if (tasks.length) {
        tasks.forEach((task) => {
            let filteredtask = {};
            if (task.list) {
                const tasklist = task.list;
                if (tasklist.task && tasklist.task.length > 0) {
                    filteredtask['list'] = {
                        name: tasklist.name,  // take name from tasklist
                        task: tasklist.task.filter(list => {
                            if (list) {
                                if (activeInsideTab === "completed") {
                                    return list.completed;
                                } else if (activeInsideTab === "overdue") {
                                    return !list.completed && new Date(list.due_date) < now;
                                } else if (activeInsideTab === "calendar") {
                                    return !list.completed && new Date(list.due_date) >= now;
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
                tasks: t.filter(t => {
                    if (!t.list) {
                        if (activeInsideTab === "completed") {
                            return t.completed;
                        } else if (activeInsideTab === "overdue") {
                            return !t.completed && new Date(t.due_date) < now;
                        } else if (activeInsideTab === "upcoming") {
                            return !t.completed && new Date(t.due_date) >= now;
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
    const groupedTasks = {};
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


    // 3. Define order based on tab 
    const currentMonthIndex = new Date().getMonth(); // 0 = Jan, 11 = Dec
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const upcomingMonths = monthNames.slice(currentMonthIndex + 1).concat(monthNames.slice(0, currentMonthIndex));
    const pastMonths = [...monthNames.slice(0, currentMonthIndex)].reverse();

    let labelOrder = []

    if (activeInsideTab === 'upcoming') {
        labelOrder = ["This Week", "Next Week", "Next Month", ...upcomingMonths]
    } else if (activeInsideTab === 'overdue') {
        labelOrder = ["This Week", "Last Week", "Last Month", ...pastMonths]
    } else {
        labelOrder = monthNames.reverse()
    }

    return (
        <div className="dashboard-container">
            <div className="status-cards-container">
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

                <div className="status-card tasks">
                    <div className="icon-container">
                        <svg className="icon tasks-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 11.5l2 2 4-4"></path>
                            <rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                    </div>
                    <div className="card-content">
                        <h2 className="count">{taskCounts.total}</h2>
                        <p className="label">Tasks</p>
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
                        <h2 className="count">{taskCounts.completed}</h2>
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
                        <h2 className="count">{taskCounts.overdue}</h2>
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
                        <h2 className="count">{taskCounts.upcoming}</h2>
                        <p className="label">Upcoming</p>
                    </div>
                </div>
            </div>

            <div className="main-content">
                <div className="task-list-container">
                    <div className="task-tabs">
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
                            labelOrder.map(label => {
                                if (groupedTasks[label] && groupedTasks[label].length) {
                                    return (
                                        <div key={label} className="date-wrapper">
                                            <div className="date-label">{label}</div>
                                            {
                                                groupedTasks[label].map((groupedTask, idx) => {

                                                    if (groupedTask.list) {

                                                        return (
                                                            <ListDashboard
                                                                groupedTask={groupedTask}
                                                                idx={idx}
                                                            />)
                                                    } else {
                                                        return (
                                                            <span className={`taskcard-dashboard ${groupedTask.priority}`} key={idx}>
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
                                                                        className={groupedTask.completed ? "task-completed" : ""}
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

                    </div>
                </div>

                <div className="chart-card">
                    <div className="chart-header">Tracker</div>
                    <div className="chart-container">
                        <Bar options={options} data={data} />
                    </div>
                </div>

            </div>
        </div >
    );
};

export default Dashboard;