import React, { useRef, useState } from "react";
import timerUtility from "../utility/TimerUtility.js";
import { Play, Pause, Square, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
const TimeEntryCard = (data) => {
    const [isOpen, setIsOpen] = useState(false);
    console.log(data)
    const toggleExpand = () => {
        setIsOpen((prev) => !prev);
    };
    return (
        <div className="time-entry-group">
            {/* Header with period label and total time */}
            <div className="time-entry-header">
                <div className="header-left">
                    <label className="radio-label">{group.label}</label>
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
                        <span className="date-label">{group.label}</span>
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
                                    defaultValue={entry.description}
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

export default TimeEntryCard;
