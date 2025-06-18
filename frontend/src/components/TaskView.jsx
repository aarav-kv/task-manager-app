
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
import objectId from 'bson-objectid';
import Timer1 from "./Timer1.jsx"
import TaskCard from "./TaskCard.jsx";
const TaskView = ({ activeTab }) => {
    const [isLoading, setIsLoading] = useState(true);
    const { openListEditor, getListIcon } = useContext(TaskContext)
    const { setActiveTab, userTheme, setNav, setPageName, pageName } = useContext(SidebarContext)
    const [data, setData] = useState([]);
    const [showInput, setShowInput] = useState(false);
    const [currentTime, setCurrentTime] = useState("");
    const [uniqueID, setUniqueIDs] = useState([]);

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


    function openList(data) {
        setData([]);
        setIsLoading(true);
        setPageName('tasklist')
        setNav({ title: data.list_name, icon: data.list_icon });
        Task.get('tasklist', data.list_id).then((res) => {
            // console.log(res)
            const ids = [];
            if (res && res.length > 0) {
                console.log(res)
                res.slice().reverse().forEach(() => {
                    ids.push(objectId().toHexString());
                });
            }

            setUniqueIDs(ids);
            setIsLoading(false);
            setData(res);

            console.log(uniqueID)
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
                                    (task, index) => {
                                        const isExpanded = expandedTasks.has(task._id);
                                        const isAnyRunning = task.clockify?.some(timer => timer.is_running);
                                        const taskId = task._id;

                                        return (
                                            <span className='taskcard-wrapper' id={`task-${taskId}`} key={taskId} onClick={() => { toggleTaskExpand(taskId) }}>
                                                <TaskCard task={task} isExpanded={isExpanded} toggleTaskExpand={toggleTaskExpand} />
                                                {pageName === 'tasklist' &&
                                                    <>
                                                        {
                                                            (task.clockify && task.clockify.length > 0)
                                                            &&
                                                            task.clockify.map((timer) => {

                                                                return <Timer1 isExpanded={isExpanded} timer={timer} taskID={taskId} />
                                                            })
                                                        }
                                                        {!isAnyRunning
                                                            &&
                                                            <Timer1 isExpanded={isExpanded} addNew={true} uniqueID={uniqueID[index]} taskID={taskId} />
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
                        // for list 
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
