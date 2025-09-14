
import "../styles/TaskViewer.css";
import { useState, useEffect, useRef } from "react";
import { useContext } from "react";
import { SidebarContext } from "../context/SideBarContext.jsx";
import Task from "../services/TaskService.js";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import InputHandler from "./InputHandler.jsx";
import objectId from 'bson-objectid';
import SaveExistingTimer from "./SaveExistingTimer.jsx"
import AddNewTimer from "./AddNewTimer.jsx"
import TaskCard from "./TaskCard.jsx";
import ListCard from "./ListCard.jsx";
import { useMessage } from "../hooks/useMessage.js";
import OptionList from "./OptionList.jsx";
import TaskDetailPopup from "./TaskDetailPopup.jsx";
import Dashboard from "../pages/Dashboard.jsx";

const TaskView = ({ activeTab }) => {
    const [isLoading, setIsLoading] = useState(true);
    const { setActiveTab, userTheme, setNav, setPageName, pageName } = useContext(SidebarContext)
    const [data, setData] = useState([]);
    const [showInput, setShowInput] = useState(false);
    const [uniqueID, setUniqueIDs] = useState([]);
    const [activeListID, setActiveListID] = useState(null);
    const message = useMessage()

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const [sampleTask, setSampleTask] = useState({ title: "" })


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
        if (activeTab === 'list' && pageName == 'list') {
            setData([]);
            setIsLoading(true);
            Task.get('list').then((res) => {
                setData(res);
                setIsLoading(false);
            });
        } else if (activeTab == "today") {
            setIsLoading(false);
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


    const addListView = (listdata) => {
        // setData([list])
        var newdata = {
            list_icon: listdata.list_icon,
            list_id: listdata._id,
            list_name: listdata.list_name,
            task: []
        };

        setData([...data, newdata]);
    }

    function openList(data) {
        setActiveListID(data.list_id)
        setData([]);
        setListCheckedID([]);
        setShowSelectionCheckbox(false)
        setActiveOptionList([]);
        setIsLoading(true);
        setPageName('tasklist')
        setNav({ title: data.list_name, icon: data.list_icon });
        Task.get('tasklist', data.list_id).then((res) => {
            const ids = [];
            if (res && res.length > 0) {
                res.slice().reverse().forEach(() => {
                    ids.push(objectId().toHexString());
                });
            }

            setUniqueIDs(ids);
            setIsLoading(false);
            setData(res);
        });
    }

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

    const [showSelectionCheckbox, setShowSelectionCheckbox] = useState(false)

    function AddOrUpdate({ taskId, timerId, entry, data, isDelete }) {
        // If deleting a timer
        if (isDelete && timerId) {
            return data.map(task => {
                if (!Array.isArray(task.clockify)) return task;

                const updatedClockify = task.clockify.filter(timer => timer._id !== timerId);

                return {
                    ...task,
                    clockify: updatedClockify,
                };
            });
        }

        // If updating or adding a timer
        if (taskId && entry) {
            return data.map(task => {
                if (task._id !== taskId) return task;

                if (!task.clockify) {
                    task.clockify = [];
                }

                const timerExists = task.clockify.some(timer => timer._id === timerId);

                let updatedClockify;
                if (timerExists) {
                    // Update existing timer
                    updatedClockify = task.clockify.map(timer => {
                        return timer._id === timerId ? { ...timer, ...entry } : timer;
                    });
                } else {
                    // Add new timer
                    updatedClockify = [...task.clockify, entry];
                }

                return {
                    ...task,
                    clockify: updatedClockify,
                };
            });
        }

        // If nothing to change, return original data
        return data;
    }

    let totalElapsedSum = data?.reduce((taskSum, task) => {
        const taskTotal = task.clockify?.reduce((timerSum, timer) => {
            return timerSum + (timer.elapsed_time || 0);
        }, 0) || 0;
        return taskSum + taskTotal;
    }, 0);

    const [taskChecked, setTaskChecked] = useState(false);
    const [activeOptionList, setActiveOptionList] = useState([]);
    const toggleActiveOptionList = (name) => {
        setActiveOptionList(prev => {
            if (prev.includes(name)) {
                return prev.filter(n => n !== name); // remove it
            } else {
                return [...prev, name]; // add it
            }
        });
    };


    const [listCheckedID, setListCheckedID] = useState([])


    const handleDeleteClick = () => {
        toggleActiveOptionList('delete');
        if (listCheckedID.length > 0) {
            Task.delete_list(listCheckedID)
            setData(prev => prev.filter(list => !listCheckedID.includes(list.list_id)))
            setListCheckedID([])
        } else {
            message.add('No item selected', message.TYPE.WARNING);
        }
    };

    const handlePopupShow = (task) => {
        setSampleTask(task)
        setIsPopupOpen(prev => !prev)
    }


    return (
        <>
            <div className={`task-scroll-view ${userTheme} ${data && data.length > 0 ? '' : 'empty'}`}>
                {pageName == "list" || pageName == "tasklist" ?
                    <OptionList
                        pageName={pageName}
                        setListCheckedID={setListCheckedID}
                        toggleActiveOptionList={toggleActiveOptionList}
                        activeOptionList={activeOptionList}
                        setShowSelectionCheckbox={setShowSelectionCheckbox}
                        totalElapsedSum={totalElapsedSum}
                        showSelectionCheckbox={showSelectionCheckbox}
                        data={data}
                        listCheckedID={listCheckedID}
                        handleDeleteClick={handleDeleteClick}
                        showInput={showInput}
                        setShowInput={setShowInput}
                    />
                    : <></>
                }



                {isLoading ? (
                    <div className="loading-container">
                        <span className="loader"></span><span style={{ marginRight: "15px" }}>Loading....</span>
                    </div>
                ) : (data && data.length > 0 || activeTab === 'today') ? (
                    <>
                        {
                            (activeTab === 'list' && pageName === 'tasklist') &&
                            <>
                                {
                                    data.slice().reverse().map(
                                        (task, index) => {
                                            const isExpanded = expandedTasks.has(task._id);
                                            const isAnyRunning = task.clockify?.some(timer => timer.is_active);
                                            const totalElapsedTime = task.clockify?.reduce((sum, timer) => {
                                                return sum + (timer.elapsed_time || 0);
                                            }, 0);
                                            const taskId = task._id;

                                            return (
                                                <span className='taskcard-wrapper' id={`task-${taskId}`} key={taskId} >
                                                    <TaskCard task={task} isExpanded={isExpanded} toggleTaskExpand={toggleTaskExpand} total={totalElapsedTime} handlePopupShow={handlePopupShow} />
                                                    {pageName === 'tasklist' &&
                                                        <>
                                                            {
                                                                (task.clockify && task.clockify.length > 0)
                                                                &&
                                                                task.clockify.map((timer) => {
                                                                    return <SaveExistingTimer isExpanded={isExpanded} timer={timer} taskID={taskId} updateData={
                                                                        (timerID, entry, isDelete) => {
                                                                            setData(AddOrUpdate({ taskId: taskId, timerId: timerID, isDelete, data, entry }))
                                                                        }
                                                                    } />
                                                                })
                                                            }
                                                            {
                                                                !isAnyRunning
                                                                &&
                                                                <AddNewTimer
                                                                    isExpanded={isExpanded}
                                                                    addNew={true}
                                                                    uniqueID={uniqueID[index]}
                                                                    taskID={taskId}
                                                                    updateData={
                                                                        (timerID, entry, isDelete) => {
                                                                            setData(AddOrUpdate({ taskId: taskId, timerId: timerID, isDelete, data, entry }))
                                                                        }
                                                                    }

                                                                />
                                                            }
                                                        </>
                                                    }
                                                </span>
                                            )
                                        }

                                    )
                                }
                            </>
                        }

                        {
                            (activeTab === 'list' && pageName === 'list') &&
                            <>
                                {
                                    data.slice().reverse().map((list) => {
                                        return (
                                            <ListCard
                                                list={list}
                                                listCheckedID={listCheckedID}
                                                openList={openList}
                                                showSelectionCheckbox={showSelectionCheckbox}
                                                setListCheckedID={(listID) => {
                                                    setListCheckedID((prev) => {
                                                        if (prev.includes(listID)) {
                                                            return prev.filter((id) => id !== listID);
                                                        } else {
                                                            // React requires immutability when updating state
                                                            // If you mutate state directly (e.g., using push())
                                                            // React might not detect the change, and the component might not re-render properly.
                                                            return [...prev, listID];
                                                        }
                                                    })
                                                }} />
                                        );
                                    })
                                }
                            </>
                        }


                        {
                            (activeTab === 'today' && pageName === 'today') && <Dashboard />
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

            <InputHandler pageName={pageName} date={''} toggle={showInput} addTaskToView={addTaskToView} addTaskToListView={addTaskToListView} addListView={addListView} activeListID={activeListID} />

            <div className="task-detail-popup-wrapper">
                <TaskDetailPopup
                    isOpen={isPopupOpen}
                    onClose={() => setIsPopupOpen(false)}
                    task={sampleTask}
                    userTheme={userTheme}
                />
            </div>

        </>
    );
};

export default TaskView;
