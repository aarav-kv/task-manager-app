import React, { useRef, useState } from "react";

const TimeEntryCard = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleExpand = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <div className={`time-entry-card `}>
            <div className="time-entry-header" onClick={toggleExpand}>
                <div className="entry-date-info flex items-center gap-4">
                    <div className="entry-count">2</div>
                    <span className="entry-date-label text-gray-600">Today</span>
                </div>
                <span className="entry-total-duration text-gray-600">
                    Total: <span className="text-gray-800">00:00:00</span>
                    <span>
                        <i className={`fa-solid ${isOpen ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
                    </span>
                </span>
            </div>

            <div className={`time-entry-list transition-list ${isOpen ? "expanded" : "collapsed"}`}>
                <div className="time-entry-row">
                    <input
                        type="text"
                        placeholder="Add description"
                        className="entry-description ml-4 flex-1 border-none focus:ring-0"
                    />
                    <div className="entry-meta">
                        <span className="entry-time-range">
                            <span className="entry-start-time">00:00</span>
                            <span className="time-separator">-</span>
                            <span className="entry-end-time">00:00</span>
                        </span>
                        <i className="fas fa-calendar-alt text-gray-400"></i>
                        <span className="entry-duration text-gray-800">00:00:00</span>
                        <i className="fas fa-play text-gray-400"></i>
                        <i className="fas fa-ellipsis-v text-gray-400"></i>
                    </div>
                </div>
                <div className="time-entry-row">
                    <input
                        type="text"
                        placeholder="Add description"
                        className="entry-description ml-4 flex-1 border-none focus:ring-0"
                    />
                    <div className="entry-meta">
                        <span className="entry-time-range">
                            <span className="entry-start-time">00:00</span>
                            <span className="time-separator">-</span>
                            <span className="entry-end-time">00:00</span>
                        </span>
                        <i className="fas fa-calendar-alt text-gray-400"></i>
                        <span className="entry-duration text-gray-800">00:00:00</span>
                        <i className="fas fa-play text-gray-400"></i>
                        <i className="fas fa-ellipsis-v text-gray-400"></i>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimeEntryCard;
