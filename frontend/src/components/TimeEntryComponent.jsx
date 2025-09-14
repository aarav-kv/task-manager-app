import React, { useEffect, useState, useContext } from 'react';
import { Play, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import '../styles/TimeEntry.css';
import Task from '../services/TaskService';
import { SidebarContext } from "../context/SideBarContext";
import TrackerBar from "../components/TrackerBar";
const TimeEntryComponent = () => {
    const [tasksData, setTaskData] = useState([])

    const tab_name = "clockify"
    const { setActiveTab, setNav, setPageName } = useContext(SidebarContext)
    useEffect(() => {
        setPageName(tab_name)
        setActiveTab(tab_name)
        setNav({ title: tab_name });
    }, [])

    useEffect(() => {
        Task.clockifydata().then((res) => {
            setTaskData(res)
        })
    }, [])

    const timerUtility = {
        fromSeconds: (seconds) => {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    };

    const getWeekStart = (date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    };

    const getCurrentWeekStart = () => {
        return getWeekStart(new Date());
    };

    const isThisWeek = (dateString) => {
        const entryDate = new Date(dateString);
        const weekStart = getCurrentWeekStart();
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        return entryDate >= weekStart && entryDate <= weekEnd;
    };

    const isToday = (dateString) => {
        const today = new Date();
        const entryDate = new Date(dateString);
        return today.toDateString() === entryDate.toDateString();
    };

    const formatDateLabel = (dateString) => {
        const entryDate = new Date(dateString);
        if (isToday(dateString)) {
            return "Today";
        } else if (isThisWeek(dateString)) {
            return entryDate.toLocaleDateString('en-GB', {
                weekday: 'long'
            });
        } else {
            return entryDate.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        }
    };

    // Flatten all time entries from all tasks and group by period
    const allTimeEntries = tasksData.flatMap(task =>
        task.clockifyData.map(entry => ({
            ...entry,
            taskTitle: task.list_name,
            taskDescription: task.description
        }))
    );

    const groupEntriesByPeriod = (entries) => {
        const groups = {};

        entries.forEach(entry => {
            let groupKey;
            let groupLabel;
            if (isThisWeek(entry.created_date)) {
                groupKey = 'thisWeek';
                groupLabel = 'This week';
            } else {
                const entryDate = new Date(entry.created_date);
                const weekStart = getWeekStart(entryDate);
                groupKey = weekStart.toISOString().split('T')[0];
                groupLabel = weekStart.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                });
            }

            if (!groups[groupKey]) {
                groups[groupKey] = {
                    label: groupLabel,
                    title: entry.taskTitle,
                    entries: [],
                    totalTime: 0
                };
            }

            groups[groupKey].entries.push(entry);
            groups[groupKey].totalTime += entry.elapsed_time;
        });

        return groups;
    };

    const groupedEntries = groupEntriesByPeriod(allTimeEntries);

    return (
        <span>

            <div className="time-entry-container">
                {Object.entries(groupedEntries).map(([groupKey, group]) => (
                    <TimeEntryGroup
                        key={groupKey}
                        group={group}
                        timerUtility={timerUtility}
                        formatDateLabel={formatDateLabel}
                    />
                ))}
            </div>
            <TrackerBar />
        </span>

    );
};

const TimeEntryGroup = ({ group, timerUtility, formatDateLabel }) => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleExpand = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="time-entry-group">
            {console.log(group)}
            {/* Header with period label and total time */}
            <div className="time-entry-header">
                <div className="header-left">
                    <div className="radio-group">
                        <input
                            type="radio"
                            id={`task-${group.label}`}
                            name="entry-type"
                            className="radio-input"
                        />
                        <label htmlFor={`task-${group.label}`} className="radio-label">{group.label}</label>
                    </div>
                </div>
                <div className="total-time">
                    {timerUtility.fromSeconds(group.totalTime)}
                </div>
            </div>

            {/* Time Entry Card */}
            <div className="time-entry-card">
                {/* Expandable Header */}
                <div
                    className="card-header"
                    onClick={toggleExpand}
                >
                    <div className="card-header-left">
                        <span className="entry-count">{group.entries.length}</span>
                        <span className="date-label">{group.title}</span>
                    </div>
                    <div className="card-header-right">
                        <span className="total-label">Total: <span className="total-value">{timerUtility.fromSeconds(group.totalTime)}</span></span>
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                </div>

                {/* Collapsible Content */}
                <div className={`collapsible-content ${isOpen ? 'expanded' : 'collapsed'}`}>
                    <div className="entries-container">
                        {group.entries.map((entry, index) => (
                            <div key={index} className="entry-row">
                                {/* Date Badge */}
                                <div className={`date-badge ${entry.elapsed_time > 0 ? 'active' : ''}`}>
                                    {new Date(entry.created_date).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: '2-digit'
                                    })}
                                </div>

                                {/* Description Input */}
                                <input
                                    type="text"
                                    placeholder="Add a description"
                                    className="description-input"
                                    defaultValue={entry.description || ''}
                                />

                                {/* Time Controls */}
                                <div className="time-controls">
                                    <span className="time-label">Start:</span>
                                    <div className="time-value">
                                        {entry.start_time}
                                    </div>
                                    <span className="time-separator">-</span>
                                    <span className="time-label">End:</span>
                                    <div className={`time-value ${entry.elapsed_time > 0 ? 'active' : ''}`}>
                                        {entry.end_time}
                                    </div>
                                    <span className="time-separator">:</span>
                                    <div className={`duration ${entry.elapsed_time > 0 ? 'active' : ''}`}>
                                        {timerUtility.fromSeconds(entry.elapsed_time)}
                                    </div>
                                    <button className="action-button">
                                        {entry.elapsed_time > 0 ? (
                                            <Trash2 size={14} className="action-icon" />
                                        ) : (
                                            <Play size={14} className="action-icon" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimeEntryComponent;