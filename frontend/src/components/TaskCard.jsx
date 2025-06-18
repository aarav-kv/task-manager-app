import { useState, useEffect, useRef, useContext } from "react";
import TaskContext from "../context/TaskContext.jsx";
import { List, CalendarDays, FileCode2, Sprout, Dumbbell, Ham, Droplets, CodeSquare, Play, PenLine, Pause } from 'lucide-react'

function TaskCard({ task, isExpanded, toggleTaskExpand }) {
    const { openTaskEditor, openListEditor } = useContext(TaskContext)
    const [taskChecked, setTaskChecked] = useState(false);
    return (
        <>
            <span className="taskcard">
                <span key={task._id}>
                    <div className="checkbox-wrapper-combined" >
                        <input
                            className="inp-cbx visually-hidden"
                            type="checkbox"
                            id={`cbx-${task._id}`}
                            checked={taskChecked}
                            onChange={() => setTaskChecked((prev) => !prev)}
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
        </>
    )

}
export default TaskCard
