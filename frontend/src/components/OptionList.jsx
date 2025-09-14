import timerUtility from "../utility/TimerUtility.js";
import TaskContext from "../context/TaskContext.jsx";
import { useState, useEffect, useRef, useContext } from "react";
import { ChevronDown } from "lucide-react";
import { SortDropdown } from '../components/SortDropdown.jsx';
const OptionList = ({
    data,
    listCheckedID,
    totalElapsedSum,
    setShowSelectionCheckbox,
    showSelectionCheckbox,
    toggleActiveOptionList,
    activeOptionList,
    setListCheckedID,
    pageName,
    handleDeleteClick,
    showInput,
    setShowInput }) => {

    const [TimerPaused, setTimerPaused] = useState(false);
    const [TimerExists, setTimerExists] = useState(false)
    const { setCurrentlyRunningTimer, currentlyRunningTimer } = useContext(TaskContext)
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


    const scrollToTask = (taskId) => {
        const taskEl = document.getElementById(`taskcard-${taskId}`);
        const scrollContainer = document.querySelector('.task-scroll-view');

        if (taskEl && scrollContainer) {
            const taskRect = taskEl.getBoundingClientRect();
            const containerRect = scrollContainer.getBoundingClientRect();

            const scrollTopOffset = taskRect.top - containerRect.top + scrollContainer.scrollTop;

            scrollContainer.scrollTo({
                top: scrollTopOffset,
                behavior: 'smooth'
            });
        }
    };


    const showSortDropdown = () => {

    }

    return (
        <>
            <div className="option-list">

                <span className={`rounded-box  info total-elapsed-time ${pageName === 'tasklist' ? 'show' : ''} `}>{timerUtility.fromSeconds(totalElapsedSum)}</span>

                <span className={`rounded-box  info running-timer ${TimerExists ? 'show' : ''}`} onClick={() => { scrollToTask(currentlyRunningTimer.taskID) }}>
                    {
                        TimerExists ? currentlyRunningTimer.formatedElapsedTime : "00:00:00"
                    }
                    {
                        TimerExists && !currentlyRunningTimer.paused ?
                            <span className={`main-stop-timer active`}>stop</span> :
                            <></>
                    }

                </span>

                {/* SELECT */}
                {
                    <span className={`rounded-box info select ${activeOptionList.includes('select-list') ? 'active-option' : ''}  ${pageName === 'list' ? 'show' : ''} `}
                        onClick={() => {
                            setShowSelectionCheckbox(prev => !prev)
                            toggleActiveOptionList('select-list')
                        }}>Select</span>
                }



                {/* SELECT ALL */}

                {
                    <span
                        className={`${!showSelectionCheckbox ? 'disable' : ''} rounded-box info select-all ${(activeOptionList.includes('select-all-list') || (data.length === listCheckedID.length && listCheckedID.length > 0)) ? 'active-option' : ''} ${pageName === 'list' ? 'show' : ''} `}
                        onClick={
                            () => {
                                toggleActiveOptionList('select-all-list')
                                if (!activeOptionList.includes('select-all-list')) {
                                    setListCheckedID(data.map((list) => list.list_id));
                                } else {
                                    setListCheckedID([]);
                                }
                            }
                        }
                    >
                        <div className={`checkbox-wrapper-combined select-all-cbx`} >
                            <input
                                className="inp-cbx visually-hidden"
                                type="checkbox"
                                id={`cbx-selectall`}
                                checked={(activeOptionList.includes('select-all-list') || (data.length === listCheckedID.length && listCheckedID.length > 0))}
                                onChange={(e) => {

                                    // setTaskChecked((prev) => !prev)
                                }}
                            />
                            <label className="cbx">
                                <span
                                    className={`checkbox-container priority-low`}
                                >
                                    <svg width="13" height="11" viewBox="0 0 15 14" fill="none">
                                        <path d="M2 8.36364L6.23077 12L13 2" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </span>
                            </label>
                        </div>
                        <span>Select All</span>
                    </span>
                }

                {/* Delete */}
                <span
                    className={`${!showSelectionCheckbox ? 'disable' : ''} rounded-box info select-all active-option-click ${pageName === 'list' ? 'show' : ''} `}
                    onClick={handleDeleteClick}
                >
                    <span>Delete</span>
                </span>

                {/* ADD BUTTON */}
                <div className={`rounded-box  show action ${showInput ? 'hide' : ''}`} onClick={() => {
                    setShowInput(true)
                }}>
                    {pageName == 'list' ? <span>Add List</span> : <span>Add Task</span>} +
                </div>

                <SortDropdown />
            </div>
        </>
    )
}

export default OptionList