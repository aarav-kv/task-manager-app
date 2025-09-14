import { useState, useEffect, useRef, useContext } from "react";
import TaskContext from "../context/TaskContext.jsx";
import { List, CalendarDays, FileCode2, Sprout, Dumbbell, Ham, Droplets, CodeSquare, Play, PenLine, Pause } from 'lucide-react'


const ListCard = ({ list, listCheckedID, openList, showSelectionCheckbox, setListCheckedID }) => {
    const { openListEditor, getListIcon } = useContext(TaskContext)
    return (

        <>
            <div style={{ position: "relative" }}>
                <div className={`list-section-checkbox checkbox-wrapper-combined  ${showSelectionCheckbox ? 'show' : ''}`} >
                    <input
                        className="inp-cbx visually-hidden"
                        type="checkbox"
                        id={`cbx-${list.list_id}`}
                        checked={listCheckedID?.includes(list.list_id)}
                        onChange={(e) => {
                            setListCheckedID(list.list_id);
                        }}
                    />
                    <label className="cbx" htmlFor={`cbx-${list.list_id}`}>
                        <span
                            className={`checkbox-container priority-low`}
                        >
                            <svg width="13" height="11" viewBox="0 0 15 14" fill="none">
                                <path d="M2 8.36364L6.23077 12L13 2" stroke="currentColor" strokeWidth="2" />
                            </svg>
                        </span>
                    </label>
                </div>

                <span className='list-card' key={list.list_id} onClick={() => { openList(list) }}>
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
            </div>
        </>
    )
}

export default ListCard