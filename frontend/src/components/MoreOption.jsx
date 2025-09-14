import { useState, useRef, useEffect } from "react";
import { MoreVertical, Flag, CircleCheck, AlertCircle, Calendar, Check } from "lucide-react";
import "../styles/MoreOption.css";
import { List, CalendarDays, FileCode2, Sprout, Dumbbell, Ham, Droplets, CodeSquare, Play, PenLine, Pause } from 'lucide-react'
const MoreOption = ({ pageName, handleData, clearSelection, onClear }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const [dropdownItems, setDropdownItem] = useState();
    const [listName, setListName] = useState("");
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedPriority, setSelectedPriority] = useState(null);
    const [selectedDateString, setSelectedDateString] = useState('');
    const [selectedListIcon, setListIcon] = useState('')
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
        handleData({
            date: selectedDate,
            priority: selectedPriority,
            listName: listName,
            listIcon: selectedListIcon
        })
    }, [selectedDate, selectedPriority, listName, selectedListIcon])

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    // Only render for today or calendar types
    if (pageName !== 'today' && pageName !== 'calendar') {
        // return null;
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

    const handleListIconSelect = (icon) => {
        if (icon == selectedListIcon) {
            setListIcon('');
        } else {
            setListIcon(icon);
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
            {/* Button design */}
            <button className="more-option-btn" onClick={toggleDropdown}>
                <div className={`dot-menu ${showDropdown ? 'is-active' : ''}`}>
                    <span className="dot dot-1"></span>
                    <span className="dot dot-2"></span>
                    <span className="dot dot-3"></span>
                </div>
            </button>

            {/* Actual dropdown */}
            <div className={`dropdown-menu ${showDropdown ? 'show' : ''}`} >
                {
                    pageName === 'today' || pageName === 'tasklist' &&
                    <>
                        {
                            (pageName != 'calendar') &&
                            < div className={`dropdown-item ${dropdownItems == 'addlist' ? 'open' : ''}`} onClick={() => { toggleDropdownItem('addlist') }}>
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
                            </div>
                        }


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

                        {
                            pageName != 'calendar' &&
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
                            </div>
                        }
                    </>
                }

                {
                    pageName === 'list' &&
                    <>
                        <div className={`dropdown-item ${dropdownItems == 'listicon' || pageName == 'list' ? 'open' : ''} listicon`} onClick={() => { toggleDropdownItem('listicon') }}>
                            <div className="header">
                                <Flag size={18} />
                                <span>List Icon</span>
                                {selectedPriority || selectedListIcon && <CircleCheck strokeWidth={2} size={17} style={{ stroke: 'white', fill: "green", paddingTop: "2px" }} />}
                                <div className="submenu-arrow">
                                    ›
                                </div>
                            </div>
                            <div className="item-content" onClick={(e) => e.stopPropagation()}>
                                <div
                                    className="priority-option"
                                    onClick={() => handleListIconSelect("default")}
                                >
                                    <div>
                                        <List />
                                        <div>Default</div>
                                    </div>

                                    <Check className={`checkIcon ${(selectedListIcon == 'default') ? "active" : ""}`} />
                                </div>
                                <div
                                    className="priority-option"
                                    onClick={() => handleListIconSelect("dumbell")}
                                >
                                    <div>
                                        <Dumbbell fill="red" />
                                        <div>Dumbell</div>
                                    </div>

                                    <Check className={`checkIcon ${(selectedListIcon == 'dumbell') ? "active" : ""}`} />
                                </div>
                                <div
                                    className="priority-option"
                                    onClick={() => handleListIconSelect("file")}
                                >
                                    <div>
                                        <FileCode2 fill="white" />

                                        <div>File</div>
                                    </div>
                                    <Check className={`checkIcon ${(selectedListIcon == 'file') ? "active" : ""}`} />
                                </div>


                                <div
                                    className="priority-option"
                                    onClick={() => handleListIconSelect("plant")}
                                >
                                    <div>
                                        <Sprout fill="green" stroke="green" />


                                        <div>Plant</div>
                                    </div>
                                    <Check className={`checkIcon ${(selectedListIcon == 'plant') ? "active" : ""}`} />
                                </div>

                                <div
                                    className="priority-option"
                                    onClick={() => handleListIconSelect("meat")}
                                >
                                    <div>
                                        <Ham fill="#985824" />


                                        <div>Plant</div>
                                    </div>
                                    <Check className={`checkIcon ${(selectedListIcon == 'meat') ? "active" : ""}`} />
                                </div>


                                <div
                                    className="priority-option"
                                    onClick={() => handleListIconSelect("droplet")}
                                >
                                    <div>
                                        <Droplets fill="lightblue" />

                                        <div>Droplet</div>
                                    </div>
                                    <Check className={`checkIcon ${(selectedListIcon == 'droplet') ? "active" : ""}`} />
                                </div>
                            </div>
                        </div>
                    </>
                }

            </div>
        </div >
    );
};

export default MoreOption;