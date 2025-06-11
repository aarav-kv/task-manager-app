import { useState, useRef, useEffect } from "react";
import { MoreVertical, List, Flag, CircleCheck, AlertCircle, Calendar, Check } from "lucide-react";
import "../styles/MoreOption.css";

const MoreOption = ({ pageName, setData, clearSelection, onClear }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const [dropdownItems, setDropdownItem] = useState();
    const [listName, setListName] = useState("");
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedPriority, setSelectedPriority] = useState(null);
    const [selectedDateString, setSelectedDateString] = useState('');

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (clearSelection) {
            setSelectedDate('')
            setSelectedPriority(null)
            setSelectedDateString('')
            setListName('')
            setDropdownItem('')
            onClear();
        }
    }, [clearSelection]);

    useEffect(() => {
        setData({
            date: selectedDate,
            priority: selectedPriority,
            listName: listName
        })
    }, [selectedDate, selectedPriority, listName])

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    // Only render for today or calendar types
    if (pageName !== 'today' && pageName !== 'calendar') {
        return null;
    }

    const handleDateSelect = (date) => {
        let dateObj = new Date();

        if (date === "Tomorrow") {
            setSelectedDateString(date)
            dateObj.setDate(dateObj.getDate() + 1);
        } else if (date === "Next Week") {
            setSelectedDateString(date)
            dateObj.setDate(dateObj.getDate() - 1);
        } else if (date === "Today") {
            setSelectedDateString(date)
            dateObj = new Date();
        } else {
            setSelectedDateString('')
            dateObj = new Date(date);
        }

        setSelectedDate(dateObj);
    };

    const handlePrioritySelect = (priority) => {
        if (priority == selectedPriority) {
            setSelectedPriority('');
        } else {
            setSelectedPriority(priority);
        }
    };


    const toggleDropdownItem = (item) => {
        setDropdownItem(prev => {
            if (prev === item) {
                return "";
            } else {
                return item
            }
        });
    };

    return (
        <div className="more-option-container" ref={dropdownRef}>
            <button className="more-option-btn" onClick={toggleDropdown}>
                <div className={`dot-menu ${showDropdown ? 'is-active' : ''}`}>
                    <span className="dot dot-1"></span>
                    <span className="dot dot-2"></span>
                    <span className="dot dot-3"></span>
                </div>
            </button>

            <div className={`dropdown-menu ${showDropdown ? 'show' : ''}`} >
                {pageName != 'calendar' && <div className={`dropdown-item ${dropdownItems == 'addlist' ? 'open' : ''}`} onClick={() => { toggleDropdownItem('addlist') }}>
                    <div className="header" >
                        <List size={18} />
                        <span>Add to list</span>
                        {listName != '' && <CircleCheck strokeWidth={2} size={17} style={{ stroke: 'white', fill: "green", paddingTop: "2px" }} />}
                        <div className="submenu-arrow">›</div>
                    </div>
                    <div className="item-content" onClick={(e) => e.stopPropagation()}>
                        <span className="list-dropdown-title">List Name</span>
                        <div className="list-input-wrapper ">
                            <input type="text" className="add-list-input" placeholder="Give a list name" value={listName} maxLength={50} onChange={(e) => { setListName(e.target.value) }} />
                        </div>
                    </div>
                </div>}


                <div className={`dropdown-item ${dropdownItems == 'priority' || pageName == 'calendar' ? 'open' : ''}`} onClick={() => { toggleDropdownItem('priority') }}>
                    <div className="header">
                        <Flag size={18} />
                        <span>Set priority</span>
                        {selectedPriority !== null && <CircleCheck strokeWidth={2} size={17} style={{ stroke: 'white', fill: "green", paddingTop: "2px" }} />}
                        <div className="submenu-arrow">
                            ›
                        </div>
                    </div>
                    <div className="item-content" onClick={(e) => e.stopPropagation()}>
                        <div
                            className="priority-option"
                            onClick={() => handlePrioritySelect("High")}
                        >
                            <div>
                                <div className="priority-dot high "></div>
                                <div>High</div>
                            </div>

                            <Check className={`checkIcon ${(selectedPriority == 'High') ? "active" : ""}`} />
                        </div>
                        <div
                            className="priority-option"
                            onClick={() => handlePrioritySelect("Medium")}
                        >
                            <div>
                                <div className="priority-dot medium"></div>
                                <div>Medium</div>
                            </div>

                            <Check className={`checkIcon ${(selectedPriority == 'Medium') ? "active" : ""}`} />
                        </div>
                        <div
                            className="priority-option"
                            onClick={() => handlePrioritySelect("Low")}
                        >
                            <div>
                                <div className="priority-dot low"></div>
                                <div>Low</div>
                            </div>
                            <Check className={`checkIcon ${(selectedPriority == 'Low') ? "active" : ""}`} />
                        </div>
                    </div>
                </div>
                {pageName != 'calendar' &&
                    <div className={`dropdown-item ${dropdownItems == 'selectdate' ? 'open' : ''}`} onClick={() => { toggleDropdownItem('selectdate') }}>
                        <div className="header" >
                            <Calendar size={18} />
                            <span>Select date</span>
                            {selectedDate != '' && <CircleCheck strokeWidth={2} size={17} style={{ stroke: 'white', fill: "green", paddingTop: "2px" }} />}
                            <div className="submenu-arrow">›</div>
                        </div>
                        <div className="item-content" onClick={(e) => e.stopPropagation()}>
                            <div className="date-picker-header">
                                <span>Select Due Date</span>
                            </div>

                            <div className="quick-date-options">
                                <div className="option" onClick={() => handleDateSelect("Today")}><span >Today</span><Check className={`checkIcon ${selectedDateString === 'Today' ? 'active' : ""}`} /></div>
                                <div className="option" onClick={() => handleDateSelect("Tomorrow")}><span>Tomorrow</span><Check className={`checkIcon ${selectedDateString === 'Tomorrow' ? 'active' : ""}`} /></div>
                                <div className="option" onClick={() => handleDateSelect("Next Week")}><span>Next Week</span><Check className={`checkIcon ${selectedDateString === 'Next Week' ? 'active' : ""}`} /></div>
                            </div>
                            <div className="custom-date">
                                <input
                                    type="date"
                                    onChange={(e) => handleDateSelect(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>}
            </div>
        </div>
    );
};

export default MoreOption;