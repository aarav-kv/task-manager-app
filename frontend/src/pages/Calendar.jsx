import { useState, useEffect, useContext, useRef } from "react";
import { SidebarContext } from "../context/SideBarContext";
import { useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, CalendarDays, Flag, Clock, X } from 'lucide-react';
import InputHandler from "../components/InputHandler";
import '../styles/Calendar.css'
import Task from "../services/TaskService";

const Calendar = () => {
    const location = useLocation();
    const { setActiveTab, setNav } = useContext(SidebarContext);
    const [isTaskInputOpen, toggleTaskInput] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        setActiveTab("calendar");
        setNav({ title: "calendar" })
    }, [setActiveTab]);

    // State for current date and view type
    const [currentDate, setCurrentDate] = useState(new Date());

    // Calculate dates for the calendar view
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    // Navigate to previous/next week or month
    const navigate = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + (direction * 7));
        setCurrentDate(newDate);
    };


    // Function to format date as "Month YYYY"
    const formatMonthYear = (date) => {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    // Format date for task container header
    const formatFullDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Get the current day for highlighting
    const today = new Date();
    const isToday = (date) => {
        return date &&
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    // Check if date is selected
    const isSelected = (date) => {
        return date &&
            date.getDate() === selectedDate.getDate() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear();
    };

    // Handle date click to show tasks
    const handleDateClick = (date) => {
        if (date) {
            setSelectedDate(date);
        }
    };

    // Add new task on specific date
    const handleAddTask = (date) => {
        setSelectedDate(date);
        toggleTaskInput(true);
    };

    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        Task.get('today').then(res => {
            setTasks(res);
        });
    }, []); // empty dependency array = run only once   

    // Get tasks for a specific date
    const getTasksForDate = (date) => {
        if (!date) return [];

        return tasks.filter(task => {

            let taskDate = new Date(task.due_date);
            // console.log(taskDate.getDate() + "/" + (taskDate.getMonth() + 1) + "/" + taskDate.getFullYear())
            return (
                taskDate.getDate() === date.getDate() &&
                taskDate.getMonth() === date.getMonth() &&
                taskDate.getFullYear() === date.getFullYear()
            );
        });
    };



    // Get tasks for selected date
    const selectedDateTasks = getTasksForDate(selectedDate);

    // Generate dates for the week view
    const weekDates = Array(7).fill(0).map((_, index) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + index);
        return date;
    });

    // Priority icon colors
    const priorityColors = {
        low: 'text-green-500',
        medium: 'text-yellow-500',
        high: 'text-red-500'
    };

    //Outside click, when outside clikc hide input box
    const calenderref = useRef(null)
    useEffect(() => {
        const handleClickOutside = (event) => {
            // console.log(event.target.className)
            if (event.target.className.includes("calendar-page-container") || event.target.className.includes("main-view-container")) {
                toggleTaskInput(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className={`calendar-page-container ${isTaskInputOpen ? 'addspace' : ""}`} ref={calenderref}>
            <div className="calendar-container">
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-1 rounded-full hover:bg-gray-100"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <span className="text-gray-700">Today</span>
                            <button
                                onClick={() => navigate(1)}
                                className="p-1 rounded-full hover:bg-gray-100"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        <span className="font-medium text-gray-700">{formatMonthYear(currentDate)}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <div
                            className="p-2 border rounded-md bg-white"
                        >
                            Week
                        </div>
                    </div>
                </div>

                {/* Calendar grid */}
                <div className="flex flex-col calendar-dates">
                    <div className="grid grid-cols-7 flex-grow">
                        {
                            weekDates.map((date, index) => (
                                <div
                                    key={index}
                                    className={`border-r border-b min-h-32 ${isSelected(date) ? 'selected-date' : ''}`}
                                    onClick={() => handleDateClick(date)}
                                >
                                    <div className="p-2 flex justify-center">
                                        <div className={`flex flex-col items-center`}>
                                            <div className="text-xs text-gray-500">
                                                {date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                                            </div>
                                            <div className={`flex items-center justify-center w-8 h-8 rounded-full 
                                                ${isToday(date) ? 'bg-blue-500 text-white' : ''}
                                                ${isSelected(date) && !isToday(date) ? 'bg-blue-100' : ''}`}>
                                                {date.getDate()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-1">
                                        {getTasksForDate(date).map(task => (
                                            < div key={task.id} className={`task-calender ${(task.priority == '') ? 'low' : (task.priority !== null) ? task.priority.toLowerCase() : 'low'}`}>
                                                <div className="title">{task.title}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))


                        }
                    </div>
                </div>
                <InputHandler type={'calendar'} date={selectedDate} toggle={isTaskInputOpen} onClose={() => toggleTaskInput(false)} />
            </div>

            {/* Task Show Container */}
            <div className="task-show-container">
                <div className="task-show-header">
                    <h2 className="task-date-heading">{formatFullDate(selectedDate)}</h2>
                    <div className="task-count">
                        {selectedDateTasks.length > 0
                            ? `${selectedDateTasks.length} task${selectedDateTasks.length > 1 ? 's' : ''}`
                            : 'No tasks'}
                    </div>
                </div>

                <div className="task-list-container">
                    {selectedDateTasks.length > 0 ? (
                        selectedDateTasks.map(task => (
                            <div key={task.id} className="task-item">
                                <div className="task-item-header">
                                    <h3 className="task-title">{task.title}</h3>
                                    <div className="task-actions">
                                        <button className="task-edit-btn">Edit</button>
                                        <button className="task-delete-btn">
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="task-details">
                                    <div className="task-detail">
                                        <Clock size={16} className="task-icon" />
                                        <span>{task.time}</span>
                                    </div>
                                    <div className="task-detail">
                                        <Flag size={16} className={`task-icon ${priorityColors[task.priority]}`} />
                                        <span className="capitalize">{task.priority} priority</span>
                                    </div>
                                </div>
                                {task.description && (
                                    <div className="task-description">
                                        {task.description}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="empty-task-message">
                            <div className="empty-task-illustration">
                                <CalendarDays size={48} className="text-gray-300" />
                            </div>
                            <p>No tasks scheduled for this day</p>
                            <button
                                className="add-task-btn"
                                onClick={() => toggleTaskInput(true)}
                            >
                                + Add new task
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}

export default Calendar;